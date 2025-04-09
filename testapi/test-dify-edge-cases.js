// difyIntegration 边界情况测试
import { callDifyWorkflow } from '../src/difyIntegration.js';

// 模拟 fetch 响应
const mockResponses = new Map([
  ['empty', { answer: '' }],
  ['null', { answer: null }],
  ['undefined', {}],
  ['large', { answer: 'x'.repeat(1000000) }],
  ['malformed', 'not-json'],
  ['timeout', new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))],
  ['rate-limit', { status: 429, error: 'Too Many Requests' }],
  ['nested', { data: { outputs: { text: 'Nested response' } } }],
  ['html', { answer: '<div>HTML content</div>' }],
  ['markdown', { answer: '# Markdown\n## Content' }],
  ['special-chars', { answer: '特殊字符：¥€$' }],
  ['emoji', { answer: '表情测试：😀🎉👍' }]
]);

// 重试配置
const retryConfig = {
  maxRetries: 3,
  initialDelay: 100,
  maxDelay: 1000,
  backoffFactor: 2
};

// 实现重试逻辑的包装函数
async function withRetry(fn, config = retryConfig) {
  let lastError;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // 检查是否应该重试
      if (error.message.includes('rate limit') || 
          error.message.includes('timeout') ||
          error.message.includes('network')) {
        console.log(`尝试第 ${attempt} 次失败，等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * config.backoffFactor, config.maxDelay);
        continue;
      }
      
      // 其他错误直接抛出
      throw error;
    }
  }
  
  throw lastError;
}

// 模拟 fetch
global.fetch = async (url, options) => {
  const { inputs } = JSON.parse(options.body);
  const testCase = inputs.url.split('/').pop();
  
  // 模拟请求取消
  if (testCase === 'cancel') {
    await new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request aborted'));
      }, 100);
    });
  }
  
  if (mockResponses.has(testCase)) {
    const response = mockResponses.get(testCase);
    
    if (response instanceof Promise) {
      return response;
    }
    
    if (response.status === 429) {
      return {
        ok: false,
        status: 429,
        text: async () => JSON.stringify(response)
      };
    }
    
    if (testCase === 'malformed') {
      return {
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); }
      };
    }
    
    return {
      ok: true,
      json: async () => response
    };
  }
  
  throw new Error('Unknown test case');
};

// 测试用例
async function testEdgeCases() {
  console.log('开始边界情况测试...\n');
  
  const testCases = [
    {
      name: '空响应',
      url: 'https://test.com/empty',
      expectError: false
    },
    {
      name: 'null响应',
      url: 'https://test.com/null',
      expectError: false
    },
    {
      name: 'undefined响应',
      url: 'https://test.com/undefined',
      expectError: false
    },
    {
      name: '超大响应',
      url: 'https://test.com/large',
      expectError: false
    },
    {
      name: '格式错误的响应',
      url: 'https://test.com/malformed',
      expectError: true
    },
    {
      name: '请求超时',
      url: 'https://test.com/timeout',
      expectError: true
    },
    {
      name: '速率限制',
      url: 'https://test.com/rate-limit',
      expectError: true
    },
    {
      name: '嵌套响应',
      url: 'https://test.com/nested',
      expectError: false
    },
    {
      name: 'HTML内容',
      url: 'https://test.com/html',
      expectError: false
    },
    {
      name: 'Markdown内容',
      url: 'https://test.com/markdown',
      expectError: false
    },
    {
      name: '特殊字符',
      url: 'https://test.com/special-chars',
      expectError: false
    },
    {
      name: '表情符号',
      url: 'https://test.com/emoji',
      expectError: false
    }
  ];

  const apiKey = 'test-api-key';
  
  for (const testCase of testCases) {
    console.log(`测试: ${testCase.name}`);
    try {
      const result = await withRetry(() => callDifyWorkflow(testCase.url, apiKey));
      if (testCase.expectError) {
        console.error('❌ 预期应该抛出错误，但没有\n');
      } else {
        console.log('✅ 成功处理边界情况');
        console.log('返回结果:', result, '\n');
      }
    } catch (error) {
      if (testCase.expectError) {
        console.log('✅ 正确捕获到预期错误:', error.message, '\n');
      } else {
        console.error('❌ 意外错误:', error.message, '\n');
      }
    }
  }

  // 测试请求取消
  console.log('测试: 请求取消');
  try {
    const controller = new AbortController();
    const signal = controller.signal;
    
    setTimeout(() => controller.abort(), 50);
    
    await callDifyWorkflow('https://test.com/cancel', apiKey, { signal });
    console.error('❌ 预期应该被取消，但没有\n');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('✅ 成功取消请求\n');
    } else {
      console.error('❌ 取消请求失败:', error.message, '\n');
    }
  }

  // 测试并发请求
  console.log('测试: 并发请求');
  try {
    const urls = [
      'https://test.com/nested',
      'https://test.com/html',
      'https://test.com/markdown',
      'https://test.com/special-chars',
      'https://test.com/emoji'
    ];
    
    const results = await Promise.all(
      urls.map(url => withRetry(() => callDifyWorkflow(url, apiKey)))
    );
    
    console.log('✅ 成功处理并发请求');
    console.log('返回结果数量:', results.length);
    console.log('所有请求都成功完成\n');
  } catch (error) {
    console.error('❌ 并发请求失败:', error.message, '\n');
  }

  // 测试重试逻辑
  console.log('测试: 重试逻辑');
  let retryCount = 0;
  const originalFetch = global.fetch;
  global.fetch = async (...args) => {
    retryCount++;
    if (retryCount < 3) {
      throw new Error('rate limit exceeded');
    }
    return originalFetch(...args);
  };

  try {
    const result = await withRetry(() => 
      callDifyWorkflow('https://test.com/nested', apiKey)
    );
    console.log('✅ 重试成功');
    console.log('重试次数:', retryCount);
    console.log('最终结果:', result, '\n');
  } catch (error) {
    console.error('❌ 重试失败:', error.message, '\n');
  } finally {
    global.fetch = originalFetch;
  }
}

// 运行测试
console.log('='.repeat(50));
testEdgeCases().catch(error => {
  console.error('测试执行出错:', error);
  process.exit(1);
}).finally(() => {
  console.log('='.repeat(50));
  console.log('测试完成');
});