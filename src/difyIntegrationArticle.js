// Dify工作流集成模块 - 专门用于文章生成功能
const DIFY_API_URL = 'https://api.dify.ai/v1';

/**
 * 调用Dify工作流API生成文章内容(流式响应)
 * @param {Object} inputs - 输入参数：prompt(标题)、style(风格)、context(上下文)
 * @param {string} apiKey - Dify API密钥
 * @param {Object} callbacks - 回调函数对象
 * @param {Function} callbacks.onStart - 开始生成时的回调
 * @param {Function} callbacks.onProgress - 生成进度回调，接收状态和数据
 * @param {Function} callbacks.onComplete - 完成生成时的回调，接收最终内容
 * @param {Function} callbacks.onError - 错误处理回调
 * @param {number} maxRetries - 最大重试次数
 * @returns {Promise<Object>} 返回带cancel方法的对象，可取消生成
 */
export async function callDifyArticleWorkflow(inputs, apiKey, callbacks = {}, maxRetries = 2) {
  const { onStart, onProgress, onComplete, onError } = callbacks;
  
  // 验证输入参数
  if (!inputs || !inputs.prompt) {
    const error = new Error('缺少必要参数：prompt(标题)');
    if (onError) onError(error);
    return { cancel: () => {} };
  }
  
  // 日志和回调辅助函数
  const log = (message, data = null) => {
    const logMsg = data ? `${message}: ${JSON.stringify(data).substring(0, 100)}${data.length > 100 ? '...' : ''}` : message;
    console.log(logMsg);
  };
  
  const notify = (status, data = {}) => {
    if (onProgress) onProgress(status, data);
  };
  
  // 重试逻辑
  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      // 首次尝试或重试提示
      if (retryCount === 0) {
        if (onStart) onStart();
        log(`开始调用Dify文章工作流生成: ${inputs.prompt}`);
      } else {
        log(`尝试第${retryCount}次重新连接...`);
        notify(`尝试重新连接 (${retryCount}/${maxRetries})...`);
      }
      
      // 1. 发起请求
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
        signal: AbortSignal.timeout(300000) // 5分钟超时
      });
      
      // 2. 处理错误响应
      if (!response.ok) {
        const errorText = await response.text();
        log(`API响应错误 (${response.status}): ${errorText}`);
        
        // 处理网关超时错误 - 这类错误值得重试
        if (response.status === 504 || response.status === 502) {
          if (retryCount < maxRetries) {
            const waitTime = 3000 * (retryCount + 1);
            log(`网关错误，等待${waitTime/1000}秒后重试...`);
            notify(`网关错误，等待${waitTime/1000}秒后重试...`);
            await new Promise(r => setTimeout(r, waitTime));
            continue;
          }
        }
        
        // 其他错误或重试次数用尽，回退到模拟数据
        if (retryCount >= maxRetries) {
          log(`经过${maxRetries}次尝试后仍然失败，使用模拟数据`);
          notify(`无法连接到服务器，将使用本地生成的内容`);
          return createMockResponse(inputs, callbacks);
        }
        continue;
      }
      
      // 3. 开始处理流式响应
      log("连接成功，开始接收流式响应...");
      notify("连接成功，开始接收数据...");
      
      // 4. 设置流式解析的状态
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let resultContent = "";
      let workflowRunId = "";
      let nodeCount = 0;
      
      // 5. 读取和处理流式数据
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          // 流读取完成
          if (done) {
            log("流式响应结束（正常完成）");
            if (onComplete) onComplete(resultContent);
            break;
          }
          
          // 处理新接收的数据
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          
          // 处理每一行数据
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              log("收到流结束标记");
              if (onComplete) onComplete(resultContent);
              return { cancel: () => {} };
            }
            
            try {
              log("收到原始数据", { data: data.substring(0, 100) });
              
              // 1. 首先检查是否是直接的结果对象 {"result": "..."}
              try {
                const directResult = JSON.parse(data);
                if (directResult && directResult.result && typeof directResult.result === 'string') {
                  log("检测到直接结果格式", { previewLength: directResult.result.length });
                  resultContent = directResult.result;
                  
                  // 通知进度
                  notify('接收内容', { 
                    content: resultContent,
                    result: resultContent
                  });
                  
                  // 完成处理
                  if (onComplete) {
                    log("工作流返回了完整结果，调用完成回调");
                    onComplete(resultContent);
                  }
                  return { cancel: () => {} };
                }
              } catch (parseError) {
                log("解析直接结果JSON失败", { error: parseError.message });
                // 继续尝试解析为事件数据
              }
              
              // 2. 解析事件数据
              let parsedData;
              let actualData;
              
              try {
                parsedData = JSON.parse(data);
                actualData = parsedData;
                
                // 检查是否有嵌套的data字段
                if (parsedData.data && typeof parsedData.data === 'string') {
                  try {
                    // 尝试解析嵌套的JSON字符串
                    const nestedData = JSON.parse(parsedData.data);
                    log("解析内部嵌套数据", { event: nestedData.event || '无事件' });
                    actualData = nestedData;
                  } catch (innerError) {
                    log("解析内部嵌套数据失败，使用原始数据", { error: innerError.message });
                  }
                }
              } catch (parseError) {
                log("解析事件JSON失败", { error: parseError.message });
                continue;
              }

              // 提取内容的统一方法 - 增强版
              const extractContent = (data) => {
                // 尝试从各种可能的位置提取内容
                if (!data) return null;
                
                // 1. 直接字段
                for (const field of ['result', 'text', 'content', 'answer', 'output']) {
                  if (data[field] && typeof data[field] === 'string') {
                    log(`从字段[${field}]提取内容`);
                    return data[field];
                  }
                }
                
                // 2. 嵌套在data字段中
                if (data.data && typeof data.data === 'object') {
                  for (const field of ['result', 'text', 'content', 'answer']) {
                    if (data.data[field] && typeof data.data[field] === 'string') {
                      log(`从data.${field}提取内容`);
                      return data.data[field];
                    }
                  }
                }
                
                // 3. 嵌套在outputs字段中 (workflow_finished和node_finished事件)
                if (data.outputs) {
                  // 如果outputs是字符串，尝试解析为JSON
                  if (typeof data.outputs === 'string') {
                    try {
                      const outputsObj = JSON.parse(data.outputs);
                      for (const field of ['result', 'text', 'content', 'output', 'answer']) {
                        if (outputsObj[field] && typeof outputsObj[field] === 'string') {
                          log(`从解析的outputs.${field}提取内容`);
                          return outputsObj[field];
                        }
                      }
                    } catch (e) {
                      // 如果解析失败，直接返回outputs字符串
                      return data.outputs;
                    }
                  } 
                  // 如果outputs是对象，直接查找
                  else if (typeof data.outputs === 'object') {
                    for (const field of ['result', 'text', 'content', 'output', 'answer']) {
                      if (data.outputs[field] && typeof data.outputs[field] === 'string') {
                        log(`从outputs.${field}提取内容`);
                        return data.outputs[field];
                      }
                    }
                  }
                }
                
                // 4. 嵌套在message字段中
                if (data.message) {
                  if (typeof data.message === 'string') {
                    return data.message;
                  } else if (data.message.content) {
                    log(`从message.content提取内容`);
                    return data.message.content;
                  }
                }
                
                // 5. 检查data.data如果它是字符串
                if (data.data && typeof data.data === 'string') {
                  try {
                    // 尝试解析data.data如果它是JSON字符串
                    const dataObj = JSON.parse(data.data);
                    for (const field of ['result', 'text', 'content', 'answer', 'output']) {
                      if (dataObj[field]) {
                        log(`从解析的data.data.${field}提取内容`);
                        return dataObj[field];
                      }
                    }
                  } catch (e) {
                    // 如果不是JSON，作为纯文本返回
                    return data.data;
                  }
                }
                
                return null;
              };
              
              // 处理事件类型数据
              if (actualData.event) {
                log(`处理事件: ${actualData.event}`);
                
                switch (actualData.event) {
                  case 'workflow_started':
                    workflowRunId = actualData.workflow_run_id;
                    log("工作流已开始", { id: workflowRunId });
                    notify('工作流已开始', { workflowRunId });
                    break;
                    
                  case 'workflow_finished':
                    log("工作流已完成", { id: actualData.workflow_run_id, data: JSON.stringify(actualData).substring(0, 200) });
                    
                    // 先尝试从data.outputs字段获取结果，这是API文档明确指定的输出位置
                    let finalContent = null;
                    if (actualData.data && actualData.data.outputs) {
                      log("检测到data.outputs字段", { 
                        type: typeof actualData.data.outputs,
                        structure: JSON.stringify(actualData.data.outputs).substring(0, 200)
                      });
                      
                      // 直接完整打印outputs内容，不截断
                      console.log('完整的data.outputs内容:', JSON.stringify(actualData.data.outputs));
                      
                      // 处理outputs字段，可能是对象或字符串
                      if (typeof actualData.data.outputs === 'string') {
                        try {
                          // 如果是JSON字符串，尝试解析
                          const outputsObj = JSON.parse(actualData.data.outputs);
                          log("解析outputs成功", { keys: Object.keys(outputsObj) });
                          
                          // 常见字段名：result, content, text, output
                          for (const field of ['result', 'content', 'text', 'output']) {
                            if (outputsObj[field]) {
                              finalContent = outputsObj[field];
                              log(`从outputs解析结果中找到[${field}]字段`, { length: finalContent.length });
                              break;
                            }
                          }
                        } catch (e) {
                          // 如果不是有效JSON，直接使用outputs字符串内容
                          finalContent = actualData.data.outputs;
                          log("outputs非JSON格式，直接使用文本内容", { length: finalContent.length });
                        }
                      } 
                      // 如果是对象，直接查找字段
                      else if (typeof actualData.data.outputs === 'object') {
                        // 记录outputs对象的所有键，帮助诊断
                        const outputKeys = Object.keys(actualData.data.outputs);
                        log("outputs对象的键", { keys: outputKeys });
                        
                        // 1. 检查常见字段名
                        for (const field of ['result', 'content', 'text', 'output', 'out','answer']) {
                          if (actualData.data.outputs[field]) {
                            finalContent = actualData.data.outputs[field];
                            log(`从outputs对象中找到[${field}]字段`, { length: finalContent.length });
                            break;
                          }
                        }
                        
                        // 2. 如果没找到，尝试直接使用第一个非空值
                        if (!finalContent && outputKeys.length > 0) {
                          for (const key of outputKeys) {
                            const value = actualData.data.outputs[key];
                            if (value && typeof value === 'string' && value.trim().length > 0) {
                              finalContent = value;
                              log(`使用outputs对象中的第一个非空值[${key}]`, { length: finalContent.length });
                              break;
                            } else if (value && typeof value === 'object') {
                              // 3. 如果值是对象，尝试查找其中的文本内容
                              log(`检查outputs.${key}对象`, { type: typeof value, structure: JSON.stringify(value).substring(0, 100) });
                              
                              for (const innerField of ['result', 'content', 'text', 'value', 'message']) {
                                if (value[innerField] && typeof value[innerField] === 'string') {
                                  finalContent = value[innerField];
                                  log(`从outputs.${key}.${innerField}中找到内容`, { length: finalContent.length });
                                  break;
                                }
                              }
                              
                              // 如果嵌套对象没找到内容字段，但JSON字符串可能有意义，则使用它
                              if (!finalContent) {
                                const jsonStr = JSON.stringify(value);
                                if (jsonStr.length > 20 && jsonStr !== "{}") { // 不为空且不是空对象
                                  finalContent = jsonStr;
                                  log(`将outputs.${key}对象转为JSON字符串作为内容`, { length: finalContent.length });
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    
                    // 如果直接提取失败，使用通用提取方法
                    if (!finalContent) {
                      finalContent = extractContent(actualData);
                    }
                    
                    if (finalContent) {
                      log("从工作流完成事件中提取到内容", { length: finalContent.length });
                      resultContent = finalContent; // 替换为完整结果，而非追加
                      notify('工作流完成', { 
                        workflowRunId, 
                        content: resultContent,
                        result: resultContent,
                        done: true 
                      });
                      
                      // 工作流完成并有内容，直接结束
                      if (onComplete) {
                        log("工作流完成并有内容，调用完成回调");
                        onComplete(resultContent);
                      }
                      return { cancel: () => {} };
                    } else {
                      // 尝试从根级别检查是否有result字段 (可能是单独返回结果的情况)
                      if (parsedData && parsedData.result && typeof parsedData.result === 'string') {
                        log("在根级别找到result字段", { length: parsedData.result.length });
                        resultContent = parsedData.result;
                        notify('工作流完成', { 
                          workflowRunId, 
                          content: resultContent,
                          result: resultContent,
                          done: true 
                        });
                        
                        if (onComplete) {
                          onComplete(resultContent);
                        }
                        return { cancel: () => {} };
                      }
                      
                      // 工作流完成但无内容，可能最终结果会单独返回
                      log("工作流完成但没有提取到内容，当前结果长度:", resultContent.length);
                      
                      // 如果有累积的内容，则发送完成事件
                      if (resultContent.length > 0) {
                        notify('工作流完成', { 
                          workflowRunId, 
                          content: resultContent,
                          result: resultContent,
                          done: true 
                        });
                        
                        if (onComplete) {
                          log("工作流完成，使用累积内容回调");
                          onComplete(resultContent);
                        }
                        return { cancel: () => {} };
                      } else {
                        // 没有任何内容，使用空字符串完成
                        notify('工作流已完成', { workflowRunId, done: true });
                        if (onComplete) {
                          log("工作流完成但无内容，返回空字符串");
                          onComplete("");
                        }
                        return { cancel: () => {} };
                      }
                    }
                    break;
                    
                  case 'node_started':
                    const nodeId = actualData.node_id || 
                                  (actualData.data && actualData.data.node_id) || 
                                  '未知节点';
                    log("节点开始处理", { nodeId });
                    notify('节点开始处理', { nodeId });
                    break;
                    
                  case 'node_finished':
                    nodeCount++;
                    const finishedNodeId = actualData.node_id || 
                                        (actualData.data && actualData.data.node_id) || 
                                        '未知节点';
                    log("节点处理完成", { nodeId: finishedNodeId, count: nodeCount });
                    
                    // 检查节点是否有输出内容
                    const nodeOutput = extractContent(actualData);
                    if (nodeOutput) {
                      log("从节点完成事件中提取内容", { length: nodeOutput.length });
                      resultContent = nodeOutput; // 这里直接替换也可能更合适
                      notify('接收内容', { 
                        workflowRunId, 
                        content: resultContent,
                        result: resultContent
                      });
                    }
                    
                    notify(`节点处理完成 (${nodeCount})`, { nodeCount });
                    break;
                    
                  case 'text_chunk':
                    // 文本块事件特殊处理（常见于流式生成）
                    const chunkText = extractContent(actualData);
                    if (chunkText) {
                      resultContent += chunkText;
                      log("接收到文本块", { preview: chunkText.substring(0, 30) });
                      
                      // 将内容和结果同时传递给回调
                      notify('接收内容', { 
                        workflowRunId, 
                        nodeCount, 
                        content: resultContent,
                        result: resultContent,
                        chunk: chunkText 
                      });
                    }
                    break;
                    
                  case 'message':
                    // 特殊处理message事件
                    const messageText = actualData.answer || extractContent(actualData);
                    if (messageText) {
                      resultContent += messageText;
                      log("接收到消息", { preview: messageText.substring(0, 30) });
                      
                      notify('接收内容', { 
                        workflowRunId, 
                        content: resultContent,
                        result: resultContent
                      });
                    }
                    break;
                    
                  default:
                    // 检查其他任何事件是否包含内容
                    const eventContent = extractContent(actualData);
                    if (eventContent) {
                      resultContent += eventContent;
                      log(`从事件[${actualData.event}]中提取内容`, { length: eventContent.length });
                      notify('接收内容', { 
                        workflowRunId, 
                        content: resultContent,
                        result: resultContent
                      });
                    }
                }
              }
              // 处理非事件类型的数据（直接内容）
              else {
                const directContent = extractContent(actualData);
                if (directContent) {
                  resultContent += directContent;
                  log("接收到直接内容", { length: directContent.length });
                  notify('接收内容', { 
                    content: resultContent,
                    result: resultContent
                  });
                } else {
                  log("未能从数据中提取内容", { data: JSON.stringify(actualData).substring(0, 100) });
                }
              }
            } catch (parseError) {
              if (data.length > 0 && data !== "[DONE]") {
                log("解析流式数据失败", { error: parseError.message, data: data.substring(0, 100) });
              }
            }
          }
        }
      } catch (streamError) {
        log('处理响应流时出错', { error: streamError.message });
        
        // 如果已接收到足够内容，直接返回
        if (resultContent.length > 100) {
          log('已接收足够内容，返回现有结果', { length: resultContent.length });
          if (onComplete) onComplete(resultContent);
          return { cancel: () => {} };
        }
        
        // 否则尝试重试
        if (retryCount < maxRetries) {
          log(`流处理错误，准备第${retryCount + 1}次重试...`);
          notify(`连接中断，正在重试 (${retryCount + 1}/${maxRetries})...`);
          continue;
        } else {
          // 重试次数用尽，使用模拟数据
          log('所有重试失败，使用模拟数据');
          if (onError) onError(streamError);
          return createMockResponse(inputs, callbacks);
        }
      }
      
      // 流处理成功，返回取消函数
      return {
        cancel: () => {
          reader.cancel();
          notify('已取消请求', { workflowRunId, canceled: true });
          log('用户取消了请求');
        }
      };
    } catch (error) {
      log('调用Dify工作流出错', { error: error.message });
      
      // 尝试重试
      if (retryCount < maxRetries) {
        log(`一般错误，准备第${retryCount + 1}次重试...`);
        notify(`出错，正在重试 (${retryCount + 1}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      
      // 重试次数用尽
      if (onError) onError(error);
      return createMockResponse(inputs, callbacks);
    }
  }
  
  // 代码不应该运行到这里，但以防万一
  log('所有重试尝试均已失败，使用模拟数据');
  return createMockResponse(inputs, callbacks);
}

/**
 * 创建模拟响应，在API不可用或请求失败时使用
 * @param {Object} inputs - 输入参数
 * @param {Object} callbacks - 回调函数集合
 * @returns {Object} 带cancel方法的对象
 */
function createMockResponse(inputs, callbacks = {}) {
  const { onStart, onProgress, onComplete } = callbacks;
  const { prompt: title, style = '', context = '' } = inputs;
  
  console.log('使用模拟数据生成文章，标题:', title);
  
  // 生成模拟内容
  const mockContent = generateMockContent(title, style, context);
  
  // 模拟事件发送状态
  let isCancelled = false;
  
  // 首次回调
  if (onStart) onStart();
  
  // 定义模拟的事件序列
  const mockEvents = [
    { status: '正在初始化生成...', delay: 300 },
    { status: '工作流已开始', data: { workflowRunId: `mock-${Date.now()}` }, delay: 400 },
    { status: '节点开始处理', data: { nodeId: 'node-input-processing' }, delay: 500 },
    { status: '接收内容', data: { 
      content: mockContent.substring(0, mockContent.indexOf('\n\n') + 4),
      result: mockContent.substring(0, mockContent.indexOf('\n\n') + 4)
    }, delay: 700 },
    { status: '节点处理完成 (1)', data: { nodeCount: 1 }, delay: 300 },
    { status: '节点开始处理', data: { nodeId: 'node-content-generation' }, delay: 300 },
    { status: '接收内容', data: { 
      content: mockContent.substring(0, Math.floor(mockContent.length * 0.4)),
      result: mockContent.substring(0, Math.floor(mockContent.length * 0.4))
    }, delay: 1200 },
    { status: '接收内容', data: { 
      content: mockContent.substring(0, Math.floor(mockContent.length * 0.7)),
      result: mockContent.substring(0, Math.floor(mockContent.length * 0.7))
    }, delay: 1000 },
    { status: '节点处理完成 (2)', data: { nodeCount: 2 }, delay: 300 },
    { status: '节点开始处理', data: { nodeId: 'node-final-formatting' }, delay: 400 },
    { status: '接收内容', data: { 
      content: mockContent,
      result: mockContent
    }, delay: 800 },
    { status: '节点处理完成 (3)', data: { nodeCount: 3 }, delay: 300 },
    { status: '生成完成', data: { 
      content: mockContent, 
      result: mockContent,
      done: true 
    }, delay: 400 }
  ];
  
  // 发送模拟事件的函数
  const sendEvents = (index = 0) => {
    if (isCancelled || index >= mockEvents.length) return;
    
    const event = mockEvents[index];
    if (onProgress) onProgress(event.status, event.data || {});
    
    if (index === mockEvents.length - 1) {
      // 最后一个事件后完成生成
      setTimeout(() => {
        if (!isCancelled && onComplete) onComplete(mockContent);
      }, event.delay);
    } else {
      // 继续发送下一个事件
      setTimeout(() => sendEvents(index + 1), event.delay);
    }
  };
  
  // 开始发送模拟事件
  setTimeout(() => sendEvents(0), 200);
  
  // 返回取消函数
  return {
    cancel: () => {
      isCancelled = true;
      if (onProgress) onProgress('已取消', { canceled: true });
      console.log('用户取消了模拟生成');
    }
  };
}

/**
 * 根据标题、风格和上下文生成模拟文章内容
 * @param {string} title - 文章标题
 * @param {string} style - 文章风格
 * @param {string} context - 上下文/要求
 * @returns {string} 生成的Markdown内容
 */
function generateMockContent(title, style = '', context = '') {
  // 确保标题安全
  const safeTitle = title.replace(/[<>]/g, '');
  const styleText = style ? `以${style}的风格` : '';
  const contextDesc = context ? `根据"${context}"的要求` : '';
  
  // 基本模拟内容框架
  return `# ${safeTitle}

## 引言

这是关于${safeTitle}的内容${styleText}${contextDesc}。这是一个由本地模拟数据生成的内容，因为Dify API连接不可用。

## 主要内容

### 1. ${safeTitle}的重要性

在当今快速发展的世界中，${safeTitle}变得越来越重要。理解它的核心概念和应用场景可以帮助我们更好地应对挑战。

${context ? `根据您提供的上下文："${context}"，我们可以进一步探讨以下内容。\n\n` : ''}

### 2. 关键技术和方法

- 结构化思维应用
- 清晰表达的技巧
- 实用技术和工具
- 真实案例分析
${style === '专业' ? '- 数据驱动的决策方法\n- 领域特定的最佳实践' : ''}
${style === '活泼' ? '- 生动有趣的演示方式\n- 互动参与的技巧' : ''}
${style === '学术' ? '- 研究方法论\n- 文献综述技巧' : ''}

### 3. 应用场景

${safeTitle}可以应用于多个领域，包括但不限于：

1. 教育培训
2. 企业管理
3. 个人发展
4. 技术创新
${context ? '5. ' + context.split(' ')[0] : ''}

### 4. 未来展望

随着技术的不断发展，${safeTitle}将继续演化，并在更多领域发挥作用。我们可以预见：

- 更智能化的应用
- 更广泛的融合
- 更深入的专业化

## 总结

${safeTitle}是一个重要的话题，它将继续影响我们的工作和生活。通过深入理解和应用，我们能够从中获得更多价值和机会。

希望本文对您了解${safeTitle}有所帮助。`;
}