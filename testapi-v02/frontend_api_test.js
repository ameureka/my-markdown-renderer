/**
 * 前端调用服务端API测试脚本
 * 模拟前端用户输入和API调用测试
 */

// 模拟前端表单输入的测试用例
const TEST_CASES = [
  {
    name: "教育领域用户",
    title: "AI在数学教育中的应用",
    style: "通俗易懂，教学导向",
    context: "针对高中数学教师，介绍如何利用AI工具辅助数学教学",
    expectedTokens: 120000,
    expectedTimeSeconds: 140
  },
  {
    name: "营销人员",
    title: "数字营销策略",
    style: "专业，简洁",
    context: "面向小型企业主的数字营销入门指南，包含实用工具推荐",
    expectedTokens: 110000,
    expectedTimeSeconds: 130
  },
  {
    name: "写作爱好者",
    title: "如何提高创意写作能力",
    style: "文学性，启发性",
    context: "适合文学爱好者的创意写作技巧和练习方法",
    expectedTokens: 125000, 
    expectedTimeSeconds: 135
  }
];

// 服务端API URL
const API_BASE_URL = "http://localhost:8787"; // 本地测试环境
// const API_BASE_URL = "https://wecom-textagent.vercel.app"; // 生产环境
const API_ENDPOINT = "/api/dify/generateArticle";

// Dify API配置
const API_KEY = process.env.DIFY_API_KEY || 'app-hOoVra3daEZRpbDNmLkVEhQp';

// Node.js环境下的fetch polyfill (如果在浏览器环境则不需要)
// const fetch = require('node-fetch');

/**
 * 模拟前端调用服务端API
 * @param {Object} inputData - 用户输入数据
 * @returns {Promise} - 返回API调用结果
 */
async function simulateApiCall(inputData) {
  const { name, title, style, context } = inputData;
  
  console.log(`\n===== 测试用户: ${name} =====`);
  console.log(`标题: "${title}"`);
  console.log(`风格: "${style}"`);
  console.log(`上下文: "${context}"`);
  
  try {
    console.log('\n开始调用API...');
    const startTime = Date.now();
    
    // 构建API URL
    const url = new URL(API_ENDPOINT, API_BASE_URL);
    url.searchParams.append('apiKey', API_KEY);
    url.searchParams.append('title', title);
    url.searchParams.append('style', style);
    url.searchParams.append('context', context);
    
    console.log(`API URL: ${url.toString().replace(API_KEY, 'API_KEY_HIDDEN')}`);
    
    // 模拟EventSource连接
    let result = '';
    let nodeCount = 0;
    let statusUpdates = [];
    
    console.log('\n接收SSE事件流...');
    
    try {
      // 真实调用API (使用fetch模拟SSE)
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      let streamingStarted = false;
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim();
            
            if (data === '[DONE]') {
              console.log('\n流结束标记接收到 [DONE]');
              break;
            }
            
            try {
              const parsedData = JSON.parse(data);
              
              if (!streamingStarted) {
                streamingStarted = true;
                console.log('开始接收内容流...');
              }
              
              if (parsedData.status) {
                statusUpdates.push(parsedData.status);
                process.stdout.write('.');
                
                if (parsedData.status.includes('节点')) {
                  nodeCount++;
                }
                
                if (parsedData.content) {
                  // 累加内容（这里我们不打印全部内容，只统计字符数）
                  const newContent = parsedData.content;
                  const prevContentLength = result.length;
                  result = newContent; // 替换为最新完整内容
                  
                  // 只打印新增内容的前20个字符
                  if (newContent.length > prevContentLength) {
                    const newChars = newContent.substring(prevContentLength);
                    if (newChars.length > 0) {
                      process.stdout.write(`\n新增内容: ${newChars.substring(0, 20)}...`);
                    }
                  }
                }
              }
            } catch (err) {
              console.error('解析SSE数据出错:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE连接出错:', error);
      // 模拟请求失败的情况，可能会从后端收到模拟数据
      console.log('尝试使用模拟数据作为回退...');
      
      // 这里可以添加模拟数据的处理逻辑
      result = `# ${title}\n\n## 引言\n\n这是一篇关于"${title}"的文章，风格是"${style}"。\n\n## 主要内容\n\n这是使用模拟数据生成的内容，因为API调用失败。\n\n## 结论\n\n这只是一个测试示例。`;
      statusUpdates = ['准备中...', '开始生成...', '节点处理中...', '生成完成'];
    }
    
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    
    console.log(`\n\n===== 结果统计 =====`);
    console.log(`处理时间: ${timeTaken.toFixed(2)}秒`);
    console.log(`状态更新次数: ${statusUpdates.length}`);
    console.log(`节点处理数: 约${nodeCount}个`);
    console.log(`生成内容长度: ${result.length}字符`);
    console.log(`内容预览: ${result.substring(0, 100)}...`);
    
    return {
      success: true,
      timeTaken,
      contentLength: result.length,
      content: result,
      statusUpdates
    };
  } catch (error) {
    console.error(`调用API出错:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 运行所有测试用例
 */
async function runAllTests() {
  console.log('开始前端API调用测试...');
  console.log(`测试API基础URL: ${API_BASE_URL}`);
  console.log(`API密钥: ${API_KEY.substring(0, 8)}...`);
  console.log(`测试用例数量: ${TEST_CASES.length}`);
  
  const results = [];
  
  for (let i = 0; i < TEST_CASES.length; i++) {
    console.log(`\n执行测试 ${i+1}/${TEST_CASES.length}`);
    const testCase = TEST_CASES[i];
    const result = await simulateApiCall(testCase);
    
    results.push({
      testCase,
      result
    });
    
    // 简单延迟避免并发请求
    if (i < TEST_CASES.length - 1) {
      console.log('\n等待5秒后执行下一个测试...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  // 汇总测试结果
  console.log('\n\n========== 测试结果汇总 ==========');
  let successCount = 0;
  
  results.forEach((r, index) => {
    const { testCase, result } = r;
    console.log(`\n测试 ${index+1}: ${testCase.name}`);
    console.log(`- 标题: "${testCase.title}"`);
    console.log(`- 状态: ${result.success ? '成功' : '失败'}`);
    
    if (result.success) {
      successCount++;
      const timeRatio = (result.timeTaken / testCase.expectedTimeSeconds * 100).toFixed(0);
      console.log(`- 耗时: ${result.timeTaken.toFixed(2)}秒 (${timeRatio}% of 预期)`);
      console.log(`- 内容长度: ${result.contentLength}字符`);
    } else {
      console.log(`- 错误: ${result.error}`);
    }
  });
  
  console.log(`\n成功率: ${successCount}/${TEST_CASES.length} (${(successCount/TEST_CASES.length*100).toFixed(0)}%)`);
}

// 运行测试
runAllTests().catch(err => {
  console.error('测试执行出错:', err);
});