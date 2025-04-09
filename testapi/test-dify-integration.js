// 测试 difyIntegration 模块-非集成部分
import { callDifyWorkflow } from '../src/difyIntegration.js';

// 测试用例
const TEST_URL = 'https://ai-bot.cn/deepcoder-14b-preview/';
const TEST_API_KEY = process.env.DIFY_API_KEY || 'app-psBss3DfbuPfQWGjJ6gN5gPA';

async function testDifyIntegration() {
  console.log('开始测试 difyIntegration 模块...\n');
  
  console.log(`测试URL: ${TEST_URL}`);
  console.log(`使用API密钥: ${TEST_API_KEY.substring(0, 4)}...${TEST_API_KEY.substring(TEST_API_KEY.length - 4)}\n`);

  try {
    console.log('调用 callDifyWorkflow...');
    const result = await callDifyWorkflow(TEST_URL, TEST_API_KEY);
    
    console.log('\n调用成功！');
    console.log('返回内容类型:', typeof result.answer);
    console.log('内容长度:', result.answer.length);
    console.log('\n内容预览 (前500字符):');
    console.log(result.answer.substring(0, 500));
    
  } catch (error) {
    console.error('\n测试失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
  }
}

// 运行测试
testDifyIntegration().catch(error => {
  console.error('测试执行出错:', error);
  process.exit(1);
});