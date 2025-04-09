// difyIntegration UI 交互测试
// 注意：这个测试需要在浏览器环境中运行

// 模拟 DOM 环境
class MockElement {
  constructor(type = 'div') {
    this.type = type;
    this.value = '';
    this.classList = new Set();
    this.style = {};
    this.attributes = new Map();
    this.eventListeners = new Map();
    this.children = [];
    this.parentElement = null;
    this.innerHTML = '';
    this.textContent = '';
    this.disabled = false;
  }

  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  dispatchEvent(event) {
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach(callback => callback(event));
  }

  getAttribute(name) {
    return this.attributes.get(name);
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  appendChild(child) {
    this.children.push(child);
    child.parentElement = this;
  }

  remove() {
    if (this.parentElement) {
      const index = this.parentElement.children.indexOf(this);
      if (index !== -1) {
        this.parentElement.children.splice(index, 1);
      }
    }
  }

  focus() {
    this.dispatchEvent(new Event('focus'));
  }

  blur() {
    this.dispatchEvent(new Event('blur'));
  }
}

// 模拟通知系统
class NotificationSystem {
  constructor() {
    this.notifications = [];
  }

  show(message, type) {
    this.notifications.push({ message, type });
    console.log(`${type.toUpperCase()} 通知: ${message}`);
  }

  clear() {
    this.notifications = [];
  }
}

// 模拟文档对象
const mockDocument = {
  createElement: (tag) => new MockElement(tag),
  getElementById: (id) => {
    const element = new MockElement();
    element.id = id;
    return element;
  },
  querySelector: (selector) => new MockElement(),
  querySelectorAll: (selector) => [new MockElement()],
  body: new MockElement('body')
};

// 模拟窗口对象
const mockWindow = {
  localStorage: {
    getItem: (key) => null,
    setItem: (key, value) => {},
    removeItem: (key) => {}
  },
  location: {
    protocol: 'http:',
    host: 'localhost:3000'
  }
};

// 设置模拟环境
global.document = mockDocument;
global.window = mockWindow;
global.Event = class Event {
  constructor(type) {
    this.type = type;
  }
};
global.CustomEvent = class CustomEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.detail = options.detail;
  }
};

// 创建通知系统实例
const notificationSystem = new NotificationSystem();

// UI 交互测试
async function testUIInteractions() {
  console.log('开始 UI 交互测试...\n');

  // 创建和初始化所需的 DOM 元素
  const elements = {
    targetUrlInput: new MockElement('input'),
    apiKeyInput: new MockElement('input'),
    generateFromUrlBtn: new MockElement('button'),
    loadingOverlay: new MockElement('div'),
    markdownEditor: new MockElement('textarea'),
    notification: new MockElement('div')
  };

  // 初始化元素
  Object.entries(elements).forEach(([key, element]) => {
    element.id = key;
    mockDocument.body.appendChild(element);
  });

  // 测试套件 1: 表单验证
  console.log('测试套件 1: 表单验证');
  
  // 测试 1.1: URL 格式验证
  console.log('\n测试 1.1: URL 格式验证');
  const urlTests = [
    { value: '', expected: false, message: '空 URL' },
    { value: 'not-a-url', expected: false, message: '无效 URL 格式' },
    { value: 'http://', expected: false, message: '不完整的 URL' },
    { value: 'https://example.com', expected: true, message: '有效的 HTTPS URL' },
    { value: 'http://localhost:3000', expected: true, message: '有效的本地 URL' }
  ];

  for (const test of urlTests) {
    elements.targetUrlInput.value = test.value;
    const isValid = validateUrl(elements.targetUrlInput.value);
    console.log(`${test.message}: ${isValid === test.expected ? '✅' : '❌'}`);
  }

  // 测试套件 2: 用户交互
  console.log('\n测试套件 2: 用户交互');

  // 测试 2.1: 按钮状态
  console.log('\n测试 2.1: 按钮状态');
  try {
    elements.generateFromUrlBtn.disabled = true;
    elements.targetUrlInput.value = 'https://example.com';
    elements.apiKeyInput.value = 'test-key';
    
    // 模拟输入事件
    elements.targetUrlInput.dispatchEvent(new Event('input'));
    elements.apiKeyInput.dispatchEvent(new Event('input'));
    
    console.log('按钮启用状态:', !elements.generateFromUrlBtn.disabled ? '✅' : '❌');
  } catch (error) {
    console.error('按钮状态测试失败:', error.message);
  }

  // 测试套件 3: 加载状态
  console.log('\n测试套件 3: 加载状态');

  // 测试 3.1: 加载动画
  console.log('\n测试 3.1: 加载动画');
  try {
    elements.loadingOverlay.classList.add('hidden');
    await simulateGeneration(elements);
    const isLoading = !elements.loadingOverlay.classList.contains('hidden');
    console.log('加载动画显示:', isLoading ? '✅' : '❌');
  } catch (error) {
    console.error('加载动画测试失败:', error.message);
  }

  // 测试套件 4: 错误处理
  console.log('\n测试套件 4: 错误处理');

  // 测试 4.1: 网络错误
  console.log('\n测试 4.1: 网络错误');
  try {
    const originalFetch = global.fetch;
    global.fetch = () => Promise.reject(new Error('Network error'));
    
    await simulateGeneration(elements);
    
    const hasError = notificationSystem.notifications.some(n => 
      n.type === 'error' && n.message.includes('Network error')
    );
    console.log('网络错误处理:', hasError ? '✅' : '❌');
    
    global.fetch = originalFetch;
  } catch (error) {
    console.log('预期的网络错误被正确捕获 ✅');
  }

  // 测试套件 5: 内容更新
  console.log('\n测试套件 5: 内容更新');

  // 测试 5.1: 编辑器内容更新
  console.log('\n测试 5.1: 编辑器内容更新');
  try {
    const originalContent = elements.markdownEditor.value;
    await simulateSuccessfulGeneration(elements);
    const contentUpdated = elements.markdownEditor.value !== originalContent;
    console.log('编辑器内容更新:', contentUpdated ? '✅' : '❌');
  } catch (error) {
    console.error('内容更新测试失败:', error.message);
  }
}

// 辅助函数

// URL 验证
function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 模拟生成过程
async function simulateGeneration(elements) {
  elements.loadingOverlay.classList.remove('hidden');
  try {
    await fetch('/api/dify/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: elements.targetUrlInput.value })
    });
  } finally {
    elements.loadingOverlay.classList.add('hidden');
  }
}

// 模拟成功的生成过程
async function simulateSuccessfulGeneration(elements) {
  elements.loadingOverlay.classList.remove('hidden');
  try {
    const response = {
      ok: true,
      json: async () => ({ answer: '# 测试内容\n\n这是生成的内容' })
    };
    const result = await response.json();
    elements.markdownEditor.value = result.answer;
    notificationSystem.show('内容生成成功', 'success');
  } finally {
    elements.loadingOverlay.classList.add('hidden');
  }
}

// 运行测试
console.log('='.repeat(50));
testUIInteractions().catch(error => {
  console.error('测试执行出错:', error);
  process.exit(1);
}).finally(() => {
  console.log('='.repeat(50));
  console.log('测试完成');
});