// difyIntegration 前端集成测试
import { callDifyWorkflow } from '../src/difyIntegration.js';

// 模拟前端环境
global.fetch = async (url, options) => {
  // 记录请求信息，用于测试验证
  console.log('请求URL:', url);
  console.log('请求方法:', options.method);
  console.log('请求头:', options.headers);
  console.log('请求体:', options.body);
  
  // 模拟 Dify API 响应
  if (url.includes('api.dify.ai/v1/workflows/run')) {
    const { inputs } = JSON.parse(options.body);
    
    // 测试不同的URL场景
    if (inputs.url === 'https://ai-bot.cn/deepcoder-14b-preview/') {
      return {
        ok: true,
        json: async () => ({
          answer: '# DeepCoder-14B\n\n这是一个强大的代码生成模型...'
        })
      };
    } else if (inputs.url === 'https://invalid-url-test.com') {
      return {
        ok: false,
        text: async () => 'Invalid URL'
      };
    }
  }
  
  throw new Error('未知的请求URL');
};

// 测试用例
async function runIntegrationTests() {
  console.log('开始 difyIntegration 前端集成测试...\n');
  
  // 测试场景1: 有效的URL和API密钥
  try {
    console.log('测试场景1: 有效的URL和API密钥');
    const validUrl = 'https://ai-bot.cn/deepcoder-14b-preview/';
    const validApiKey = 'test-api-key';
    
    console.log(`测试URL: ${validUrl}`);
    console.log(`使用API密钥: ${validApiKey.substring(0, 4)}...${validApiKey.substring(validApiKey.length - 4)}\n`);
    
    const result = await callDifyWorkflow(validUrl, validApiKey);
    console.log('调用成功！');
    console.log('返回内容类型:', typeof result.answer);
    console.log('内容长度:', result.answer.length);
    console.log('内容预览:\n', result.answer.substring(0, 100), '\n');
  } catch (error) {
    console.error('测试场景1失败:', error.message);
  }
  
  // 测试场景2: 无效的URL
  try {
    console.log('测试场景2: 无效的URL');
    const invalidUrl = 'https://invalid-url-test.com';
    const validApiKey = 'test-api-key';
    
    console.log(`测试URL: ${invalidUrl}`);
    await callDifyWorkflow(invalidUrl, validApiKey);
  } catch (error) {
    console.log('预期的错误:', error.message, '\n');
  }
  
  // 测试场景3: 无效的API密钥
  try {
    console.log('测试场景3: 无效的API密钥');
    const validUrl = 'https://ai-bot.cn/deepcoder-14b-preview/';
    const invalidApiKey = 'invalid-key';
    
    console.log(`测试URL: ${validUrl}`);
    await callDifyWorkflow(validUrl, invalidApiKey);
  } catch (error) {
    console.log('预期的错误:', error.message, '\n');
  }
  
  // 测试场景4: 模拟前端集成
  try {
    console.log('测试场景4: 模拟前端集成');
    const mockResponse = await fetch('/api/dify/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: 'https://ai-bot.cn/deepcoder-14b-preview/'
      })
    });
    
    if (mockResponse.ok) {
      const data = await mockResponse.json();
      console.log('前端集成测试成功');
      console.log('返回数据:', data, '\n');
    } else {
      throw new Error('API请求失败');
    }
  } catch (error) {
    console.error('前端集成测试失败:', error.message);
  }
}

// 运行测试
console.log('='.repeat(50));
runIntegrationTests().catch(error => {
  console.error('测试执行出错:', error);
  process.exit(1);
}).finally(() => {
  console.log('='.repeat(50));
  console.log('测试完成');
});