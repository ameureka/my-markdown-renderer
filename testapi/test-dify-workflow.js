// Dify.ai 工作流调用测试脚本
const axios = require('axios');
const { TextDecoder } = require('util');

// Dify.ai API配置
const DIFY_API_URL = 'https://api.dify.ai/v1';
const API_KEY = process.env.DIFY_API_KEY_001_workflow || 'app-psBss3DfbuPfQWGjJ6gN5gPA';

// 解析命令行参数
const args = process.argv.slice(2);
const commandLineInputs = {};
let apiKeyType = 'workflow'; // 默认使用工作流密钥

// 参数格式: url=<url>
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

// 默认测试用例 - 使用url作为输入
const testCases = [
  {
    url: "https://ai-bot.cn/deepcoder-14b-preview/"
  },
  {
    url: "https://example.com/icecream-karaoke-microphone"
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
    // 调用 Dify API
    console.log('\n开始调用Dify工作流...');
    const result = await callDifyWorkflow(testInput);
    
    console.log('\n====== 调用成功 ======');
    console.log(result.answer);
    
    // 如果需要，可以将结果保存到文件
    // require('fs').writeFileSync('result.txt', result.answer, 'utf8');
    
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
  } else if (data.data?.outputs?.text) {
    answer = data.data.outputs.text;
  } else if (data.data?.outputs?.output) {
    answer = data.data.outputs.output;
  } else if (data.outputs?.output) {
    answer = data.outputs.output;
  } else if (data.outputs?.text) {
    answer = data.outputs.text;
  } else if (typeof data.output === 'string') {
    answer = data.output;
  } else if (typeof data.text === 'string') {
    answer = data.text;
  }
  
  // 如果无法提取，则返回原始数据
  return answer ? { answer } : data;
}

// 流式API调用函数（未使用）
async function callDifyWorkflowStreaming(inputs) {
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
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API responded with status ${response.status}: ${errorText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const data = line.slice(5).trim();
        if (data === "[DONE]") {
          console.log("流式响应结束");
        } else {
          try {
            const parsedData = JSON.parse(data);
            if (parsedData.answer) {
              result += parsedData.answer;
              process.stdout.write(parsedData.answer);
            }
          } catch (e) {
            console.error("解析流式响应失败:", e);
          }
        }
      }
    }
  }

  return { answer: result };
}

// 执行脚本
run().catch(error => {
  console.error('脚本执行出错:', error);
  process.exit(1);
}); 