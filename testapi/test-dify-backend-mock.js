// difyIntegration 后端服务器响应测试
import { callDifyWorkflow } from '../src/difyIntegration.js';

// 模拟后端服务器响应
class MockServer {
  constructor() {
    this.routes = new Map();
    this.setupRoutes();
  }

  setupRoutes() {
    // 模拟 /api/dify/generate 路由
    this.routes.set('/api/dify/generate', async (request) => {
      const { url } = await request.json();
      const apiKey = request.headers.get('X-API-Key');

      if (!apiKey) {
        return new Response(JSON.stringify({
          error: 'Missing API key'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 测试不同的状态码场景
      if (url.includes('status-')) {
        const status = parseInt(url.split('status-')[1]);
        return new Response(JSON.stringify({
          error: `Test status ${status}`
        }), {
          status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        const result = await callDifyWorkflow(url, apiKey);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    });
  }

  async handleRequest(url, options) {
    const urlObj = new URL(url, 'http://localhost');
    const route = this.routes.get(urlObj.pathname);
    
    if (!route) {
      return new Response(JSON.stringify({
        error: 'Not Found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      return await route(new Request(url, options));
    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// 设置模拟服务器
const mockServer = new MockServer();

// 模拟全局 fetch
global.fetch = async (url, options = {}) => {
  if (url.startsWith('/api/')) {
    return mockServer.handleRequest(url, options);
  }
  
  // 模拟 Dify API 响应
  if (url.includes('api.dify.ai/v1/workflows/run')) {
    const { inputs } = JSON.parse(options.body || '{}');
    
    // 测试不同的响应场景
    if (inputs.url.includes('error-')) {
      const errorType = inputs.url.split('error-')[1];
      switch (errorType) {
        case 'network':
          throw new Error('Network error');
        case 'timeout':
          throw new Error('Request timeout');
        case 'invalid':
          return {
            ok: false,
            status: 400,
            text: async () => 'Invalid request'
          };
      }
    }
    
    const response = {
      ok: true,
      json: async () => ({
        answer: '# 测试响应\n\n这是一个模拟的 Dify API 响应'
      })
    };
    return response;
  }
  
  throw new Error('未知的请求URL');
};

// 测试用例
async function testBackendMock() {
  console.log('开始后端服务器响应测试...\n');

  const testCases = [
    {
      name: '正常的API调用',
      url: '/api/dify/generate',
      headers: { 'X-API-Key': 'test-api-key' },
      body: { url: 'https://example.com' },
      expectedStatus: 200
    },
    {
      name: '缺少 API Key',
      url: '/api/dify/generate',
      headers: {},
      body: { url: 'https://example.com' },
      expectedStatus: 401
    },
    {
      name: '无效的路由',
      url: '/api/invalid/route',
      headers: { 'X-API-Key': 'test-api-key' },
      body: {},
      expectedStatus: 404
    },
    {
      name: '服务器错误 (500)',
      url: '/api/dify/generate',
      headers: { 'X-API-Key': 'test-api-key' },
      body: { url: 'https://test.com/status-500' },
      expectedStatus: 500
    },
    {
      name: '请求无效 (400)',
      url: '/api/dify/generate',
      headers: { 'X-API-Key': 'test-api-key' },
      body: { url: 'https://test.com/status-400' },
      expectedStatus: 400
    },
    {
      name: '未授权 (403)',
      url: '/api/dify/generate',
      headers: { 'X-API-Key': 'test-api-key' },
      body: { url: 'https://test.com/status-403' },
      expectedStatus: 403
    }
  ];

  for (const testCase of testCases) {
    console.log(`测试: ${testCase.name}`);
    try {
      const response = await fetch(testCase.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...testCase.headers
        },
        body: JSON.stringify(testCase.body)
      });

      console.log('响应状态:', response.status);
      const data = await response.json();
      console.log('响应数据:', data);

      if (response.status === testCase.expectedStatus) {
        console.log('✅ 状态码符合预期\n');
      } else {
        console.log('❌ 状态码不符合预期\n');
      }
    } catch (error) {
      console.error(`❌ 测试失败: ${error.message}\n`);
    }
  }

  // 测试错误处理
  console.log('测试错误处理场景:');
  
  const errorTests = [
    {
      name: '网络错误',
      url: 'https://test.com/error-network'
    },
    {
      name: '请求超时',
      url: 'https://test.com/error-timeout'
    },
    {
      name: '无效请求',
      url: 'https://test.com/error-invalid'
    }
  ];

  for (const errorTest of errorTests) {
    console.log(`\n测试: ${errorTest.name}`);
    try {
      await fetch('/api/dify/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        body: JSON.stringify({ url: errorTest.url })
      });
    } catch (error) {
      console.log('✅ 正确捕获错误:', error.message);
    }
  }
}

// 运行测试
console.log('='.repeat(50));
testBackendMock().catch(error => {
  console.error('测试执行出错:', error);
  process.exit(1);
}).finally(() => {
  console.log('='.repeat(50));
  console.log('测试完成');
});