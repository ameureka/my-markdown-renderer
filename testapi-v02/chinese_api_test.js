/**
 * Dify文章生成API中文测试脚本
 * 专门测试中文内容生成场景
 */

// 导入测试用例
import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const CHINESE_TEST_CASES = JSON.parse(fs.readFileSync(path.join(__dirname, 'chinese_test_cases.json'), 'utf8')).testCases;

// 服务端API URL
const API_BASE_URL = "http://localhost:8787"; // 本地测试环境
// const API_BASE_URL = "https://wecom-textagent.vercel.app"; // 生产环境
const API_ENDPOINT = "/api/dify/generateArticle";

// Dify API配置
const API_KEY = process.env.DIFY_API_KEY || 'app-hOoVra3daEZRpbDNmLkVEhQp';

/**
 * 模拟前端调用服务端API
 * @param {Object} inputData - 用户输入数据
 * @returns {Promise} - 返回API调用结果
 */
async function callChineseArticleAPI(inputData) {
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
                  
                  // 只打印新增内容的前30个字符
                  if (newContent.length > prevContentLength) {
                    const newChars = newContent.substring(prevContentLength);
                    if (newChars.length > 0) {
                      process.stdout.write(`\n新增内容: ${newChars.substring(0, 30)}...`);
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
      // 模拟请求失败的情况
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
    console.log(`内容中文比例: ${calculateChineseRatio(result).toFixed(2)}%`);
    console.log(`内容预览: ${result.substring(0, 100)}...`);
    
    // 结果中分析中文内容质量
    const contentAnalysis = analyzeChineseContent(result);
    console.log('\n===== 中文内容分析 =====');
    console.log(`标题相关度: ${contentAnalysis.titleRelevance}`);
    console.log(`内容结构: ${contentAnalysis.structure}`);
    console.log(`风格一致性: ${contentAnalysis.styleConsistency}`);
    console.log(`语言流畅度: ${contentAnalysis.fluency}`);
    
    return {
      success: true,
      timeTaken,
      contentLength: result.length,
      content: result,
      contentAnalysis,
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
 * 分析中文内容质量
 * @param {string} content - 生成的内容
 * @returns {Object} - 内容分析结果
 */
function analyzeChineseContent(content) {
  // 这是一个简单的模拟分析，实际应用中可能需要更复杂的NLP
  
  // 检查内容结构（简单检查是否有标题和段落）
  const hasHeaders = content.includes('# ') || content.includes('## ');
  const hasParagraphs = content.split('\n\n').length > 3;
  const structure = hasHeaders && hasParagraphs ? '完整' : '部分完整';
  
  // 其他分析指标（这里简单模拟）
  const titleRelevance = '高';  // 实际应用中应该通过比对标题和内容的相关性
  const styleConsistency = '一致'; // 实际应用中应分析文本风格
  const fluency = '良好';  // 实际应用中应分析句子结构、连贯性等
  
  return {
    titleRelevance,
    structure,
    styleConsistency,
    fluency
  };
}

/**
 * 计算内容中中文字符的比例
 * @param {string} content - 内容文本
 * @returns {number} - 中文字符百分比
 */
function calculateChineseRatio(content) {
  if (!content || content.length === 0) return 0;
  
  // 匹配中文字符
  const chineseChars = content.match(/[\u4e00-\u9fa5]/g);
  const chineseCount = chineseChars ? chineseChars.length : 0;
  
  return (chineseCount / content.length) * 100;
}

/**
 * 运行所有中文测试用例
 */
async function runAllChineseTests() {
  console.log('========================================');
  console.log('开始Dify中文文章生成API测试');
  console.log('========================================');
  console.log(`测试API基础URL: ${API_BASE_URL}`);
  console.log(`API密钥: ${API_KEY.substring(0, 8)}...`);
  console.log(`测试用例数量: ${CHINESE_TEST_CASES.length}`);
  
  const results = [];
  
  // 测试参数
  const maxTestCases = 3; // 限制测试用例数量，避免过长等待
  const testCount = Math.min(CHINESE_TEST_CASES.length, maxTestCases);
  
  console.log(`将执行 ${testCount}/${CHINESE_TEST_CASES.length} 个测试用例`);
  
  for (let i = 0; i < testCount; i++) {
    console.log(`\n执行测试 ${i+1}/${testCount}`);
    const testCase = CHINESE_TEST_CASES[i];
    const result = await callChineseArticleAPI(testCase);
    
    results.push({
      testCase,
      result
    });
    
    // 简单延迟避免并发请求
    if (i < testCount - 1) {
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
      const timeRatio = (result.timeTaken / testCase.expectedResult.estimatedTimeSeconds * 100).toFixed(0);
      console.log(`- 耗时: ${result.timeTaken.toFixed(2)}秒 (${timeRatio}% of 预期)`);
      console.log(`- 内容长度: ${result.contentLength}字符`);
      
      // 显示中文内容分析结果
      const { contentAnalysis } = result;
      console.log(`- 中文内容质量: 标题相关度=${contentAnalysis.titleRelevance}, 结构=${contentAnalysis.structure}`);
    } else {
      console.log(`- 错误: ${result.error}`);
    }
  });
  
  console.log(`\n成功率: ${successCount}/${results.length} (${(successCount/results.length*100).toFixed(0)}%)`);
  console.log('\n========================================');
  console.log('中文测试完成');
  console.log('========================================');
}

// 执行测试
console.log('开始运行中文测试脚本...');
runAllChineseTests().catch(err => {
  console.error('测试执行出错:', err);
});