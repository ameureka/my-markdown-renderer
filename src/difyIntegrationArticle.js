// Dify工作流集成模块 - 专门用于文章生成功能
const DIFY_API_URL = 'https://api.dify.ai/v1';

/**
 * 调用Dify工作流API - 文章生成 (流式响应)
 * @param {Object} inputs - 输入参数，包含prompt(标题)、style、context
 * @param {string} apiKey - Dify API密钥
 * @param {Object} callbacks - 回调函数集合
 * @param {number} maxRetries - 最大重试次数
 * @returns {Promise<Object>} - 返回取消调用的函数
 */
export async function callDifyArticleWorkflow(inputs, apiKey, callbacks = {}, maxRetries = 2) {
  const { onStart, onProgress, onComplete, onError } = callbacks;
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      if (onStart && retryCount === 0) onStart();
      
      if (retryCount > 0) {
        console.log(`尝试重新连接 (${retryCount}/${maxRetries})...`);
        if (onProgress) onProgress(`尝试重新连接 (${retryCount}/${maxRetries})...`);
      }
      
      console.log(`调用Dify文章工作流API，参数:`, JSON.stringify(inputs).substring(0, 100) + '...');
      
      const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs,
          response_mode: "streaming",
          user: "markdown-renderer-user"
        }),
        // 避免浏览器/系统级别超时
        signal: AbortSignal.timeout(300000) // 5分钟超时
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API响应错误 (${response.status}): ${errorText}`);
        
        if (response.status === 504 || response.status === 502) {
          // 网关错误，可能是因为需要更长的处理时间
          retryCount++;
          if (retryCount <= maxRetries) {
            const waitTime = 3000 * retryCount; // 逐渐增加等待时间
            console.log(`网关错误，等待${waitTime/1000}秒后重试...`);
            if (onProgress) onProgress(`网关错误，等待${waitTime/1000}秒后重试...`);
            await new Promise(r => setTimeout(r, waitTime));
            continue;
          }
        }
        
        // 其他错误或重试次数已用尽
        if (retryCount >= maxRetries) {
          console.log(`经过${maxRetries}次尝试后仍然失败，使用模拟数据`);
          if (onProgress) onProgress(`经过${maxRetries}次尝试后仍然失败，使用模拟数据`);
          return handleWithMockData(inputs, callbacks);
        }
        
        retryCount++;
        continue;
      }

      console.log("连接成功，开始接收流式响应...");
      if (onProgress) onProgress("连接成功，开始接收数据...");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let result = "";
      let workflowRunId = "";
      let nodeCount = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("流式响应结束 (完成)");
            if (onComplete) onComplete(result);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = line.slice(5).trim();
              
              if (data === "[DONE]") {
                console.log("流式响应结束 [DONE]");
                if (onComplete) onComplete(result);
                return { cancel: () => {} }; // 已完成，返回空取消函数
              }
              
              try {
                console.log("收到数据:", data.substring(0, 100) + (data.length > 100 ? "..." : ""));
                const parsedData = JSON.parse(data);
                
                // 处理事件类型的数据
                if (parsedData.event) {
                  // 处理工作流相关事件
                  if (parsedData.event === 'workflow_started') {
                    workflowRunId = parsedData.workflow_run_id;
                    console.log("工作流已开始, ID:", workflowRunId);
                    if (onProgress) onProgress('工作流已开始', { workflowRunId });
                  } else if (parsedData.event === 'workflow_finished') {
                    console.log("工作流已完成, ID:", parsedData.workflow_run_id);
                    if (onProgress) onProgress('工作流已完成', { workflowRunId, done: true });
                  } 
                  // 处理节点相关事件
                  else if (parsedData.event === 'node_started') {
                    console.log("节点开始处理:", parsedData.node_id || parsedData.data?.node_id || '未知节点');
                    if (onProgress) onProgress('节点开始处理', { 
                      nodeId: parsedData.node_id || parsedData.data?.node_id || '未知节点' 
                    });
                  } else if (parsedData.event === 'node_finished') {
                    nodeCount++;
                    console.log("节点处理完成:", parsedData.node_id || parsedData.data?.node_id || '未知节点');
                    if (onProgress) onProgress(`节点处理完成 (${nodeCount})`, { nodeCount });
                  } 
                  // 处理文本块事件
                  else if (parsedData.event === 'text_chunk' && parsedData.data?.text) {
                    // 累加文本块
                    const newText = parsedData.data.text;
                    result += newText;
                    console.log("收到文本块:", newText.substring(0, 30) + (newText.length > 30 ? "..." : ""));
                    // 将进度信息和当前累积的内容传给回调
                    if (onProgress) onProgress('接收内容', { 
                      workflowRunId, 
                      nodeCount, 
                      content: result, 
                      chunk: newText 
                    });
                  } 
                  // 处理消息事件
                  else if (parsedData.event === 'message') {
                    console.log("收到message事件:", JSON.stringify(parsedData.message).substring(0, 100));
                    if (parsedData.message?.content) {
                      result += parsedData.message.content;
                      if (onProgress) onProgress('接收内容', { 
                        workflowRunId, 
                        nodeCount, 
                        content: result,
                        chunk: parsedData.message.content
                      });
                    }
                  }
                } 
                // 处理非事件类型的数据
                else {
                  let hasNewContent = false;
                  
                  // 处理各种可能的内容字段
                  if (parsedData.answer) {
                    result += parsedData.answer;
                    hasNewContent = true;
                  } else if (parsedData.text) {
                    result += parsedData.text;
                    hasNewContent = true;
                  } else if (parsedData.output) {
                    result += parsedData.output;
                    hasNewContent = true;
                  } else if (parsedData.content) {
                    result += parsedData.content;
                    hasNewContent = true;
                  } 
                  // 处理嵌套的outputs结构
                  else if (parsedData.outputs && typeof parsedData.outputs === 'object') {
                    const content = parsedData.outputs.text || parsedData.outputs.output || parsedData.outputs.content;
                    if (content) {
                      result += content;
                      hasNewContent = true;
                    }
                  }
                  
                  if (hasNewContent && onProgress) {
                    onProgress('接收内容', { content: result });
                  }
                }
              } catch (e) {
                if (data.length > 0 && data !== "[DONE]") {
                  console.error("解析流式响应失败:", e.message);
                  console.error("原始数据:", data.substring(0, 100));
                }
              }
            }
          }
        }
      } catch (streamError) {
        console.error('处理响应流时出错:', streamError);
        
        // 如果已经接收到一些有意义的内容，直接返回
        if (result.length > 100) {
          console.log('已接收足够内容，返回现有结果');
          if (onComplete) onComplete(result);
          return { cancel: () => {} };
        }
        
        // 否则尝试重试
        retryCount++;
        if (retryCount <= maxRetries) {
          console.log(`流处理出错，第${retryCount}次重试...`);
          if (onProgress) onProgress(`连接中断，正在重试 (${retryCount}/${maxRetries})...`);
          continue;
        } else {
          // 重试次数用尽，使用模拟数据
          console.log('重试次数用尽，使用模拟数据');
          if (onError) onError(streamError);
          return handleWithMockData(inputs, callbacks);
        }
      }

      // 流正常处理完成，返回取消函数
      return {
        cancel: () => {
          reader.cancel();
          if (onProgress) onProgress('已取消', { workflowRunId, nodeCount, canceled: true });
        }
      };
    } catch (error) {
      console.error('调用Dify文章工作流出错:', error);
      
      retryCount++;
      if (retryCount <= maxRetries) {
        console.log(`出错，第${retryCount}次重试...`);
        if (onProgress) onProgress(`出错，正在重试 (${retryCount}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      
      // 重试次数用尽，使用模拟数据
      if (onError) onError(error);
      return handleWithMockData(inputs, callbacks);
    }
  }
  
  // 不应该运行到这里，但以防万一
  console.log('所有重试尝试失败，使用模拟数据');
  return handleWithMockData(inputs, callbacks);
}

/**
 * 使用模拟数据
 * @param {Object} inputs - 输入参数
 * @param {Object} callbacks - 回调函数集合
 * @returns {Promise<Object>} - 返回取消对象
 */
function handleWithMockData(inputs, callbacks = {}) {
  const { onStart, onProgress, onComplete, onError } = callbacks;
  const { prompt: title, style, context } = inputs;
  
  console.log('使用模拟数据，标题:', title);
  
  // 创建适合标题的模拟内容
  const createMockContent = (title, style) => {
    const styleText = style ? `以${style}的风格` : '';
    const titleEscaped = title.replace(/[<>]/g, '');
    
    return `# ${titleEscaped}

## 引言

这是关于${titleEscaped}的内容${styleText}。这是一个由模拟数据生成的内容，因为Dify API调用失败或不可用。

## 主要内容

### 1. ${titleEscaped}的重要性

在当今快速发展的世界中，${titleEscaped}变得越来越重要。理解它的核心概念和应用场景可以帮助我们更好地应对挑战。

### 2. 关键技术和方法

- 结构化思维
- 清晰表达
- 技术应用
- 实践案例

### 3. 未来展望

随着技术的不断发展，${titleEscaped}将继续演化，并在更多领域发挥作用。

## 总结

${titleEscaped}是一个重要的话题，它将继续影响我们的工作和生活。通过深入理解和应用，我们能够从中获得更多价值。`;
  };

  // 模拟内容
  const mockContent = createMockContent(title, style);
  
  // 模拟发送事件
  let isCancelled = false;
  
  // 启动模拟事件发送
  if (onStart) onStart();
  
  const mockEvents = [
    { status: '正在开始生成...', delay: 300 },
    { status: '工作流已开始', data: { workflowRunId: 'mock-workflow-' + Date.now() }, delay: 500 },
    { status: '节点开始处理', data: { nodeId: 'node-1' }, delay: 700 },
    { status: '接收内容', data: { content: `# ${title}\n\n## 引言\n\n` }, delay: 1000 },
    { status: '接收内容', data: { content: mockContent.substring(0, Math.floor(mockContent.length * 0.3)) }, delay: 1500 },
    { status: '节点处理完成 (1)', delay: 300 },
    { status: '接收内容', data: { content: mockContent.substring(0, Math.floor(mockContent.length * 0.7)) }, delay: 1000 },
    { status: '接收内容', data: { content: mockContent }, delay: 1000 },
    { status: '生成完成', data: { content: mockContent, done: true }, delay: 500 }
  ];
  
  let currentIndex = 0;
  
  const sendNextEvent = () => {
    if (isCancelled || currentIndex >= mockEvents.length) return;
    
    const event = mockEvents[currentIndex];
    if (onProgress) onProgress(event.status, event.data || {});
    
    currentIndex++;
    
    if (currentIndex < mockEvents.length) {
      setTimeout(sendNextEvent, event.delay);
    } else {
      // 完成所有事件
      if (onComplete) onComplete(mockContent);
    }
  };
  
  // 开始发送模拟事件
  setTimeout(sendNextEvent, 100);
  
  // 返回取消函数
  return {
    cancel: () => {
      isCancelled = true;
      if (onProgress) onProgress('已取消', { canceled: true });
    }
  };
}