// Dify.ai 工作流调用测试脚本
import { TextDecoder } from 'util';

// Dify.ai API配置
const DIFY_API_URL = 'https://api.dify.ai/v1';
const API_KEY = process.env.DIFY_API_KEY_002_workflow || 'app-hOoVra3daEZRpbDNmLkVEhQp';

// 解析命令行参数
const args = process.argv.slice(2);
const commandLineInputs = {};
let apiKeyType = 'workflow'; // 默认使用工作流密钥

// 参数格式: key=value
args.forEach(arg => {
  // 特殊处理keyType参数
  if (arg.startsWith('keyType=')) {
    apiKeyType = arg.split('=')[1];
    return;
  }
  
  const [key, value] = arg.split('=');
  if (key && value) {
    commandLineInputs[key] = value;
  }
});

console.log(`使用API密钥类型: ${apiKeyType}`);

// 默认测试用例
const testCases = [
  {
    prompt: "ai PPT",
    style: "",
    context: "如何更好设计 PPT 方便教学"
  },
  {
    prompt: "一个人公司 副业",
    style: "",
    context: "ai 时代如何做一个人公司，创造收入"
  }
];

// 根据命令行参数选择测试用例或使用自定义输入
async function run() {
  let testInput;
  
  // 如果有命令行参数
  if (Object.keys(commandLineInputs).length > 0) {
    console.log('使用命令行参数:');
    console.log(commandLineInputs);
    testInput = commandLineInputs;
  } else {
    // 否则使用默认测试用例
    const caseIndex = args[0] === '2' ? 1 : 0;
    testInput = testCases[caseIndex];
    console.log(`使用测试用例 ${caseIndex + 1}:`);
    console.log(testInput);
  }

  try {
    // 调用 Dify API (使用流式响应)
    console.log('\n开始调用Dify工作流(流式响应模式)...');
    console.log('注意: 响应将随着生成实时显示，这可能需要2-3分钟完成...');
    const result = await callDifyWorkflowStreaming(testInput);
    
    console.log('\n====== 调用成功 ======');
    console.log('最终完整结果:');
    console.log(result.answer);
    
    // 如果需要，可以将结果保存到文件
    // import fs from 'fs';
    // fs.writeFileSync('result.txt', result.answer, 'utf8');
    
  } catch (error) {
    console.error('\n调用失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
  }
}

// Dify工作流API调用函数
async function callDifyWorkflow(inputs) {
  console.log(`使用API密钥: ${API_KEY.substring(0, 4)}...${API_KEY.substring(API_KEY.length - 4)}`);
  
  const response = await fetch("https://api.dify.ai/v1/workflows/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      inputs,
      response_mode: "blocking",
      user: "test-script"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API responded with status ${response.status}`;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage += `: ${errorData.message || errorText}`;
    } catch (e) {
      errorMessage += `: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // 打印完整的响应数据以调试
  console.log('Dify API响应数据:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
  
  // 尝试提取内容，处理可能的嵌套结构
  let answer = null;
  
  // 检查常见的数据结构
  if (data.answer) {
    answer = data.answer;
  } else if (data.data?.outputs?.output) {
    answer = data.data.outputs.output;
  } else if (data.outputs?.output) {
    answer = data.outputs.output;
  } else if (typeof data.output === 'string') {
    answer = data.output;
  }
  
  // 如果无法提取，则返回原始数据
  return answer ? { answer } : data;
}

// 流式API调用函数 - 带有重试逻辑和改进的解析
async function callDifyWorkflowStreaming(inputs, maxRetries = 3) {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      if (retryCount > 0) {
        console.log(`尝试重新连接 (${retryCount}/${maxRetries})...`);
      }
      
      const response = await fetch("https://api.dify.ai/v1/workflows/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          inputs,
          response_mode: "streaming",
          user: "test-script"
        }),
        // 避免浏览器/系统级别超时
        signal: AbortSignal.timeout(300000) // 5分钟超时
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 504 || response.status === 502) {
          // 网关错误，可能是因为需要更长的处理时间
          retryCount++;
          await new Promise(r => setTimeout(r, 3000)); // 等待3秒后重试
          continue;
        }
        throw new Error(`API responded with status ${response.status}: ${errorText}`);
      }

      console.log("连接成功，开始接收流式响应...");
      console.log("----------------------------------------");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let result = "";
      let dotTimer = setInterval(() => process.stdout.write('.'), 5000); // 每5秒打印一个点表示仍在等待

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          if (dotTimer) clearInterval(dotTimer);

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const data = line.slice(5).trim();
              if (data === "[DONE]") {
                console.log("\n流式响应结束");
              } else {
                try {
                  console.log("\n收到原始数据:", data.substring(0, 100) + (data.length > 100 ? "..." : ""));
                  const parsedData = JSON.parse(data);
                  console.log("\n解析后数据结构:", JSON.stringify(parsedData).substring(0, 200));
                  // 处理事件类型的数据
                  if (parsedData.event) {
                    // 如果是事件数据，根据事件类型进行处理
                    if (parsedData.event === 'workflow_started') {
                      console.log("\n工作流已开始 ID:", parsedData.workflow_run_id);
                    } else if (parsedData.event === 'workflow_finished') {
                      console.log("\n工作流已完成 ID:", parsedData.workflow_run_id);
                    } else if (parsedData.event === 'node_started') {
                      console.log("\n节点开始处理:", parsedData.node_id || '未知节点');
                    } else if (parsedData.event === 'node_finished') {
                      console.log("\n节点处理完成:", parsedData.node_id || '未知节点');
                    } else if (parsedData.event === 'message') {
                      // 处理消息事件中的实际内容
                      console.log("\n收到message事件，完整message对象:", JSON.stringify(parsedData.message));
                      if (parsedData.message?.content) {
                        result += parsedData.message.content;
                        process.stdout.write(parsedData.message.content);
                      }
                    }
                  } else if (parsedData.answer) {
                    result += parsedData.answer;
                    process.stdout.write(parsedData.answer);
                  } else if (parsedData.text) {
                    result += parsedData.text;
                    process.stdout.write(parsedData.text);
                  } else if (parsedData.output) {
                    result += parsedData.output;
                    process.stdout.write(parsedData.output);
                  } else if (parsedData.content) {
                    result += parsedData.content;
                    process.stdout.write(parsedData.content);
                  } else if (parsedData.outputs && typeof parsedData.outputs === 'object') {
                    // 处理outputs对象
                    const content = parsedData.outputs.text || parsedData.outputs.output || parsedData.outputs.content;
                    if (content) {
                      result += content;
                      process.stdout.write(content);
                    }
                  } else {
                    // 调试未知结构
                    console.log("\n未知数据结构:", JSON.stringify(parsedData).substring(0, 200));
                  }
                } catch (e) {
                  if (data.length > 0 && data !== "[DONE]") {
                    console.error("\n解析流式响应失败:", e.message);
                    console.error("原始数据:", data.substring(0, 100));
                  }
                }
              }
            }
          }
        }
      } finally {
        if (dotTimer) clearInterval(dotTimer);
      }
      
      console.log("\n----------------------------------------");
      return { answer: result };
      
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        console.log("\n请求超时，尝试重新连接...");
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise(r => setTimeout(r, 3000)); // 等待3秒后重试
          continue;
        }
      }
      
      throw error;
    }
  }

  throw new Error(`经过${maxRetries}次尝试后调用失败`);
}

// 执行脚本
run().catch(error => {
  console.error('脚本执行出错:', error);
  process.exit(1);
});