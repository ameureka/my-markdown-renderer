document.addEventListener('DOMContentLoaded', () => {
  // 应用主逻辑
  const apiKeyInput = document.getElementById('api-key');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const rememberKeyCheckbox = document.getElementById('remember-key');
  const templateCards = document.querySelectorAll('.template-card');
  const pageTitleInput = document.getElementById('page-title');
  const markdownEditor = document.getElementById('markdown-editor');
  const generateBtn = document.getElementById('generate-btn');
  const previewBtn = document.getElementById('preview-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const resetBtn = document.getElementById('reset-btn');
  const pasteBtn = document.getElementById('paste-btn');
  const exampleBtn = document.getElementById('example-btn');
  const clearEditorBtn = document.getElementById('clear-editor-btn');
  const resultPanel = document.getElementById('result-panel');
  const closeResultBtn = document.getElementById('close-result-btn');
  const resultUrl = document.getElementById('result-url');
  const copyUrlBtn = document.getElementById('copy-url-btn');
  const openLinkBtn = document.getElementById('open-link-btn');
  const createNewBtn = document.getElementById('create-new-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const aboutLink = document.getElementById('about-link');
  const aboutModal = document.getElementById('about-modal');
  const closeAboutBtn = document.getElementById('close-about-btn');
  const viewSourceBtn = document.getElementById('view-source-btn');
  const sourceModal = document.getElementById('source-modal');
  const closeSourceBtn = document.getElementById('close-source-btn');
  const copySourceBtn = document.getElementById('copy-source-btn');
  const sourceCodeDisplay = document.getElementById('source-code-display');

  // URL生成功能
  const targetUrlInput = document.getElementById('target-url');
  const generateFromUrlBtn = document.getElementById('generate-from-url');

  // 文章生成功能 - 添加新元素
  const workflowTitleInput = document.getElementById('workflow-title');
  const workflowStyleInput = document.getElementById('workflow-style');
  const workflowContextInput = document.getElementById('workflow-context');
  const generateArticleBtn = document.getElementById('generate-article-btn');
  const workflowStatusIndicator = document.getElementById('workflow-status');

  // 状态变量
  let selectedTemplate = 'general'; // 默认模板
  let generatedUrl = null;
  let isDarkTheme = localStorage.getItem('darkTheme') !== null ? localStorage.getItem('darkTheme') === 'true' : true; // 默认使用深色模式
  let isGeneratingArticle = false; // 用于跟踪文章生成状态

  // 初始化应用
  function initializeApp() {
    // 加载保存的API密钥
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      apiKeyInput.value = savedApiKey;
      rememberKeyCheckbox.checked = true;
    }

    // 设置默认选中的模板
    templateCards.forEach(card => {
      if (card.dataset.template === selectedTemplate) {
        card.classList.add('selected');
      }
    });

    // 应用主题
    applyTheme();

    // 确保模态框和加载动画初始化为隐藏状态
    aboutModal.classList.add('hidden');
    loadingOverlay.classList.add('hidden');
    
    // 隐藏源码模态框
    sourceModal.classList.add('hidden');
    
    // 检查workflow-section是否正确显示
    const workflowSection = document.querySelector('.workflow-section');
    if (workflowSection) {
      console.log('文章生成功能区域存在于DOM中');
      // 确保不被隐藏
      workflowSection.style.display = 'flex';
    } else {
      console.error('文章生成功能区域不存在于DOM中');
    }
  }

  // 应用主题
  function applyTheme() {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      themeToggleBtn.innerHTML = '<i class="icon ion-md-sunny"></i>';
    } else {
      document.body.classList.remove('dark-theme');
      themeToggleBtn.innerHTML = '<i class="icon ion-md-moon"></i>';
    }
  }

  // 显示通知
  function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notification-icon');
    const notificationMessage = document.getElementById('notification-message');

    // 设置图标和类
    notificationIcon.className = 'icon';
    switch (type) {
      case 'success':
        notificationIcon.classList.add('ion-md-checkmark-circle');
        notificationIcon.classList.add('success');
        break;
      case 'error':
        notificationIcon.classList.add('ion-md-close-circle');
        notificationIcon.classList.add('error');
        break;
      case 'warning':
        notificationIcon.classList.add('ion-md-warning');
        notificationIcon.classList.add('warning');
        break;
      default:
        notificationIcon.classList.add('ion-md-information-circle');
        notificationIcon.classList.add('info');
    }

    // 设置消息并显示
    notificationMessage.textContent = message;
    notification.classList.remove('hidden');

    // 3秒后自动隐藏
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }

  // 生成排版
  async function generateFormatting() {
    const apiKey = apiKeyInput.value.trim();
    const content = markdownEditor.value.trim();
    const title = pageTitleInput.value.trim();

    // 验证输入
    if (!apiKey) {
      showNotification('请输入API密钥', 'error');
      apiKeyInput.focus();
      return;
    }

    if (!content) {
      showNotification('请输入Markdown内容', 'error');
      markdownEditor.focus();
      return;
    }

    try {
      // 显示加载动画
      loadingOverlay.classList.remove('hidden');

      // 准备请求数据
      const requestData = {
        content: content,
        template: selectedTemplate
      };

      // 如果有标题，添加到请求数据
      if (title) {
        requestData.title = title;
      }

      // 发送API请求
      // const apiUrl = 'https://my-markdown-renderer.lynnwongchina.workers.dev/upload';
      const apiUrl = `${window.location.protocol}//${window.location.host}/upload`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      // 确保无论如何都隐藏加载动画
      loadingOverlay.classList.add('hidden');

      if (!response.ok) {
        throw new Error(data.message || '上传失败');
      }

      if (data.success) {
        // 保存API密钥（如果选择了记住）
        if (rememberKeyCheckbox.checked) {
          localStorage.setItem('apiKey', apiKey);
        } else {
          localStorage.removeItem('apiKey');
        }

        // 保存生成的URL并显示结果
        generatedUrl = data.url;
        resultUrl.textContent = generatedUrl;
        resultUrl.href = generatedUrl;
        resultPanel.classList.remove('hidden');
        previewBtn.disabled = false;
        copyLinkBtn.disabled = false;
      } else {
        throw new Error(data.message || '未知错误');
      }
    } catch (error) {
      // 确保隐藏加载动画
      loadingOverlay.classList.add('hidden');
      showNotification(`错误: ${error.message}`, 'error');
    }
  }

  // 重置应用
  function resetApp() {
    // 清空输入
    markdownEditor.value = '';
    pageTitleInput.value = '';
    generatedUrl = null;

    // 重置模板选择
    templateCards.forEach(card => {
      card.classList.remove('selected');
      if (card.dataset.template === 'general') {
        card.classList.add('selected');
        selectedTemplate = 'general';
      }
    });

    // 禁用相关按钮
    previewBtn.disabled = true;
    copyLinkBtn.disabled = true;

    showNotification('已重置', 'info');
  }

  // 提供Markdown示例
  function insertExample() {
    const examples = {
      general: `# 通用示例标题

这是一个**通用示例**文档。你可以在这里添加*各种样式*的内容。

## 二级标题

- 列表项1
- 列表项2
- 列表项3

> 这是一段引用文本

### 代码示例

\`\`\`javascript
// 这是一段代码
function greet() {
  console.log("Hello, world!");
}
\`\`\`

更多[链接文本](https://example.com)。`,

      tech_intro: `# 产品技术介绍

**MyApp** 是一款帮助开发者提高效率的工具。

## 主要功能

1. 代码自动补全
2. 语法检查
3. 版本控制集成

## 技术栈

我们使用了以下技术:

\`\`\`javascript
// 前端框架
import React from 'react';
import { useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  // ...
}
\`\`\`

## 系统要求

| 操作系统 | 最低内存 | 推荐配置 |
|---------|--------|---------|
| Windows | 4GB    | 8GB     |
| macOS   | 4GB    | 8GB     |`,

      news_broad: `# 重要公告：系统升级通知

我们将于**2023年5月15日**进行系统升级，届时服务将暂停约*2小时*。

## 升级内容

1. 性能优化
2. 新功能上线
3. 安全漏洞修复

> 感谢您的理解与支持！

如有疑问，请[联系我们](mailto:support@example.com)。`,

      tech_interpre: `# 深度解析：React Hooks原理

**React Hooks** 是React 16.8引入的重要特性，它让函数组件也能拥有状态和生命周期功能。

## 核心概念

Hooks的设计基于以下原则：

1. 完全可选
2. 100%向后兼容
3. 随时可用

> 重要：Hooks必须在函数组件顶层调用，不能在循环、条件或嵌套函数中调用。

## 实现原理

\`\`\`javascript
// useState的简化实现
function useState(initialValue) {
  const hook = getCurrentHook();
  
  if (!hook.state) {
    hook.state = initialValue;
  }
  
  const setState = newValue => {
    hook.state = newValue;
    rerender();
  }
  
  return [hook.state, setState];
}
\`\`\`

## 性能考量

Hooks通过链表实现状态追踪，每个组件实例维护一个当前hook索引。`,

      video_interpre: `# 视频教程：CSS Grid布局详解

@[00:00:10] 视频介绍

本教程将讲解CSS Grid布局的基础用法和高级技巧。

@[00:01:25] 基础概念

CSS Grid是一种二维布局系统，它可以同时处理行和列。

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto;
  gap: 10px;
}
\`\`\`

@[00:05:30] 实际案例

下面是一个响应式网站布局的例子：

\`\`\`html
<div class="grid-container">
  <header>页头</header>
  <nav>导航</nav>
  <main>主内容</main>
  <aside>侧边栏</aside>
  <footer>页脚</footer>
</div>
\`\`\`

@[00:12:45] 高级技巧

使用grid-area命名区域，创建更复杂的布局。`
    };

    // 根据选中的模板插入示例
    markdownEditor.value = examples[selectedTemplate] || examples.general;
    pageTitleInput.value = '示例文档';
    showNotification('已插入示例内容', 'success');
  }

  // 查看源码功能
  async function viewSourceCode() {
    if (!generatedUrl) return;
    
    try {
      // 显示加载动画
      loadingOverlay.classList.remove('hidden');
      
      // 使用fetch获取页面HTML源码
      const response = await fetch(generatedUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`获取源码失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // 将HTML源码显示在模态框中
        // 转义HTML以防止浏览器解析
        const escapedHtml = data.html
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        
        sourceCodeDisplay.innerHTML = escapedHtml;
        sourceModal.classList.remove('hidden');
      } else {
        throw new Error(data.message || '未知错误');
      }
    } catch (error) {
      showNotification(`错误: ${error.message}`, 'error');
    } finally {
      // 隐藏加载动画
      loadingOverlay.classList.add('hidden');
    }
  }

  // 从URL生成内容
  async function generateFromUrl() {
    const apiKey = apiKeyInput.value.trim();
    const url = targetUrlInput.value.trim();

    // 验证输入
    if (!apiKey) {
      showNotification('请输入API密钥', 'error');
      apiKeyInput.focus();
      return;
    }

    if (!url) {
      showNotification('请输入目标URL', 'error');
      targetUrlInput.focus();
      return;
    }

    try {
      // 显示加载动画
      loadingOverlay.classList.remove('hidden');

      // 发送API请求
      const response = await fetch('/api/dify/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      // 确保无论如何都隐藏加载动画
      loadingOverlay.classList.add('hidden');

      if (!response.ok) {
        throw new Error(data.message || '生成失败');
      }

      if (data.success) {
        // 保存API密钥（如果选择了记住）
        if (rememberKeyCheckbox.checked) {
          localStorage.setItem('apiKey', apiKey);
        } else {
          localStorage.removeItem('apiKey');
        }

        // 将生成的内容填入编辑器
        markdownEditor.value = data.content;
        showNotification('内容已生成', 'success');
      } else {
        throw new Error(data.message || '未知错误');
      }
    } catch (error) {
      // 确保隐藏加载动画
      loadingOverlay.classList.add('hidden');
      showNotification(`错误: ${error.message}`, 'error');
    }
  }

  // 生成文章内容
  async function generateArticleContent() {
    const apiKey = apiKeyInput.value.trim();
    const title = workflowTitleInput.value.trim();
    const style = workflowStyleInput.value.trim();
    const context = workflowContextInput.value.trim();

    // 验证输入
    if (!apiKey) {
      showNotification('请输入API密钥', 'error');
      apiKeyInput.focus();
      return;
    }

    if (!title) {
      showNotification('请输入标题', 'error');
      workflowTitleInput.focus();
      return;
    }

    try {
      // 更新状态
      isGeneratingArticle = true;
      generateArticleBtn.disabled = true;
      generateArticleBtn.innerHTML = '<i class="icon ion-md-sync animated-spin"></i> 生成中...';
      workflowStatusIndicator.innerHTML = '<span class="status-dot active"></span> 准备中...';
      workflowStatusIndicator.classList.remove('hidden');

      // 保存API密钥（如果选择了记住）
      if (rememberKeyCheckbox.checked) {
        localStorage.setItem('apiKey', apiKey);
      } else {
        localStorage.removeItem('apiKey');
      }

      // 构建API URL
      const apiUrl = `${window.location.protocol}//${window.location.host}/api/dify/generateArticle`;
      const params = new URLSearchParams({
        apiKey: apiKey,
        title: title
      });
      
      if (style) params.append('style', style);
      if (context) params.append('context', context);
      
      const fullUrl = `${apiUrl}?${params.toString()}`;
      console.log(`请求URL: ${fullUrl.replace(apiKey, '***')}`);
      
      // 开始API调用，使用适当的重试逻辑
      await fetchWithRetry(fullUrl);
      
    } catch (error) {
      console.error('文章生成错误:', error);
      showNotification(`错误: ${error.message}`, 'error');
      completeArticleGeneration();
    }
  }
  
  // 带重试机制的EventSource请求
  async function fetchWithRetry(url, maxRetries = 2) {
    let currentRetry = 0;
    let currentEventSource = null;
    
    // 创建一个Promise包装EventSource
    return new Promise((resolve, reject) => {
      function setupEventSource() {
        // 关闭前一个连接（如果存在）
        if (currentEventSource && currentEventSource.readyState !== 2) {
          currentEventSource.close();
        }
        
        // 创建新连接
        currentEventSource = new EventSource(url);
        console.log(`建立EventSource连接 (尝试 ${currentRetry + 1}/${maxRetries + 1})`);
        
        // 配置消息处理
        currentEventSource.onmessage = (event) => {
          try {
            if (event.data === '[DONE]') {
              console.log('接收到完成信号');
              currentEventSource.close();
              completeArticleGeneration();
              resolve();
              return;
            }
            
            const data = JSON.parse(event.data);
            
            // 处理各类事件
            if (data.status) {
              console.log(`状态更新: ${data.status}`);
              workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> ${data.status}`;
              
              // 如果有内容更新，填充到编辑器
              if (data.content) {
                console.log(`内容更新: 收到 ${data.content.length} 字符`);
                markdownEditor.value = data.content;
                // 触发input事件以便可能的双向绑定能够更新
                markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
              }
              // 新增: 处理data.result字段
              else if (data.result) {
                console.log(`内容更新 (result): 收到 ${data.result.length} 字符`);
                markdownEditor.value = data.result;
                // 触发input事件以便可能的双向绑定能够更新
                markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
              }
              
              // 如果生成完成
              if (data.done) {
                console.log('生成完成');
                currentEventSource.close();
                completeArticleGeneration();
                resolve();
              }
            } else if (data.error) {
              const errorMsg = data.error || '未知错误';
              console.error(`服务器返回错误: ${errorMsg}`);
              currentEventSource.close();
              reject(new Error(errorMsg));
            }
          } catch (error) {
            console.error('解析事件数据失败:', error, event.data);
          }
        };
        
        // 配置错误处理
        currentEventSource.onerror = (error) => {
          console.error('EventSource错误:', error);
          currentEventSource.close();
          
          if (currentRetry < maxRetries) {
            // 准备重试
            currentRetry++;
            const retryDelay = 1000 * currentRetry; // 逐渐增加延迟
            
            workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 连接中断，${retryDelay/1000}秒后重试 (${currentRetry}/${maxRetries})...`;
            console.log(`连接中断，${retryDelay/1000}秒后进行第${currentRetry}次重试`);
            
            // 延迟后重试
            setTimeout(setupEventSource, retryDelay);
          } else {
            // 所有重试失败，切换到模拟数据
            console.log('所有重试均失败，使用模拟数据');
            workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 切换到本地数据生成...`;
            showNotification('无法连接到服务器，将使用本地数据生成内容', 'warning');
            
            // 获取表单数据
            const title = workflowTitleInput.value.trim();
            const style = workflowStyleInput.value.trim();
            const context = workflowContextInput.value.trim();
            
            // 使用模拟数据并解析Promise
            useMockData(title, style, context);
            resolve();
          }
        };
        
        // 配置打开处理
        currentEventSource.onopen = () => {
          console.log('EventSource连接已打开');
          workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> 连接已建立，等待响应...`;
        };
      }
      
      // 开始第一次连接
      setupEventSource();
    });
  }
  
  // 使用模拟数据生成内容
  function useMockData(title, style, context) {
    const styleText = style ? `以${style}的风格` : '';
    const mockContent = `# ${title}

## 引言

这是关于${title}的内容${styleText}。这是一个由本地模拟数据生成的内容，因为服务器连接暂时不可用。

## 主要内容

### 1. ${title}的重要性

在当今快速发展的世界中，${title}变得越来越重要。理解它的核心概念和应用场景可以帮助我们更好地应对挑战。

### 2. 关键技术和方法

- 结构化思维
- 清晰表达
- 技术应用
- 实践案例

### 3. 未来展望

随着技术的不断发展，${title}将继续演化，并在更多领域发挥作用。

## 总结

${title}是一个重要的话题，它将继续影响我们的工作和生活。通过深入理解和应用，我们能够从中获得更多价值。`;

    // 模拟进度更新
    const steps = [
      { status: '准备模拟数据...', delay: 500 },
      { status: '生成标题...', content: `# ${title}\n\n`, delay: 800 },
      { status: '生成引言...', content: `# ${title}\n\n## 引言\n\n这是关于${title}的内容${styleText}。`, delay: 1200 },
      { status: '生成主要内容...', content: mockContent.substring(0, Math.floor(mockContent.length * 0.6)), delay: 1500 },
      { status: '完善详细内容...', content: mockContent, delay: 1000 },
      { status: '生成完成', content: mockContent, done: true, delay: 800 }
    ];
    
    // 更新编辑器内容
    let stepIndex = 0;
    
    function processNextStep() {
      if (stepIndex >= steps.length) {
        completeArticleGeneration();
        return;
      }
      
      const step = steps[stepIndex++];
      workflowStatusIndicator.innerHTML = `<span class="status-dot active"></span> ${step.status}`;
      
      if (step.content) {
        markdownEditor.value = step.content;
        markdownEditor.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      if (step.done) {
        setTimeout(() => {
          completeArticleGeneration();
        }, step.delay);
      } else {
        setTimeout(processNextStep, step.delay);
      }
    }
    
    // 开始模拟数据生成
    processNextStep();
  }

  // 完成文章生成
  function completeArticleGeneration() {
    isGeneratingArticle = false;
    generateArticleBtn.disabled = false;
    generateArticleBtn.innerHTML = '<i class="icon ion-md-create"></i> AI生成';
    workflowStatusIndicator.innerHTML = '<span class="status-dot completed"></span> 生成完成';
    
    // 5秒后隐藏状态指示器
    setTimeout(() => {
      if (!isGeneratingArticle) {
        workflowStatusIndicator.classList.add('hidden');
      }
    }, 5000);
  }

  // ======= 事件监听器 =======

  // 处理模板选择
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      // 移除所有卡片的选中状态
      templateCards.forEach(c => c.classList.remove('selected'));
      // 添加当前卡片的选中状态
      card.classList.add('selected');
      // 更新选中的模板
      selectedTemplate = card.dataset.template;
    });
  });

  // 密码显示/隐藏切换
  togglePasswordBtn.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      togglePasswordBtn.innerHTML = '<i class="icon ion-md-eye-off"></i>';
    } else {
      apiKeyInput.type = 'password';
      togglePasswordBtn.innerHTML = '<i class="icon ion-md-eye"></i>';
    }
  });

  // 生成按钮点击
  generateBtn.addEventListener('click', generateFormatting);

  // 预览按钮点击
  previewBtn.addEventListener('click', () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank');
    }
  });

  // 复制链接按钮点击
  copyLinkBtn.addEventListener('click', () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl)
        .then(() => {
          showNotification('链接已复制到剪贴板', 'success');
        })
        .catch(err => {
          showNotification('复制失败: ' + err, 'error');
        });
    }
  });

  // 重置按钮点击
  resetBtn.addEventListener('click', () => {
    resetApp();
    // 确保加载动画被隐藏
    loadingOverlay.classList.add('hidden');
  });

  // 粘贴按钮点击
  pasteBtn.addEventListener('click', () => {
    navigator.clipboard.readText()
      .then(text => {
        if (text) {
          markdownEditor.value = text;
          showNotification('内容已从剪贴板粘贴', 'success');
        } else {
          showNotification('剪贴板为空', 'warning');
        }
      })
      .catch(err => {
        showNotification('无法访问剪贴板: ' + err, 'error');
      });
  });

  // 示例按钮点击
  exampleBtn.addEventListener('click', insertExample);

  // 清空编辑器按钮点击
  clearEditorBtn.addEventListener('click', () => {
    markdownEditor.value = '';
    showNotification('编辑器已清空', 'info');
  });

  // 结果面板关闭按钮
  closeResultBtn.addEventListener('click', () => {
    resultPanel.classList.add('hidden');
  });

  // 复制URL按钮
  copyUrlBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedUrl)
      .then(() => {
        showNotification('链接已复制到剪贴板', 'success');
      })
      .catch(err => {
        showNotification('复制失败: ' + err, 'error');
      });
  });

  // 打开链接按钮
  openLinkBtn.addEventListener('click', () => {
    if (generatedUrl) {
      window.open(generatedUrl, '_blank');
    }
  });

  // 创建新排版按钮
  createNewBtn.addEventListener('click', () => {
    resultPanel.classList.add('hidden');
    resetApp();
  });

  // 主题切换按钮
  themeToggleBtn.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('darkTheme', isDarkTheme);
    applyTheme();
  });

  // 关于链接
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.classList.remove('hidden');
  });

  // 关闭关于模态框
  closeAboutBtn.addEventListener('click', () => {
    aboutModal.classList.add('hidden');
  });

  // 点击模态框背景关闭
  aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
      aboutModal.classList.add('hidden');
    }
  });

  // 查看源码按钮
  viewSourceBtn.addEventListener('click', async () => {
    if (generatedUrl) {
      try {
        // 显示加载状态
        loadingOverlay.classList.remove('hidden');
        
        // 使用fetch获取HTML内容
        const response = await fetch(generatedUrl, {
          headers: {
            'Accept': 'text/html'
          }
        });
        
        if (!response.ok) {
          throw new Error('获取源代码失败');
        }
        
        // 获取HTML源码
        const htmlSource = await response.text();
        
        // 在模态框中显示源码，转义HTML以正确显示
        sourceCodeDisplay.textContent = htmlSource;
        
        // 显示模态框
        sourceModal.classList.remove('hidden');
      } catch (error) {
        showNotification(`错误: ${error.message}`, 'error');
      } finally {
        // 隐藏加载状态
        loadingOverlay.classList.add('hidden');
      }
    }
  });
  
  // 关闭源码模态框
  closeSourceBtn.addEventListener('click', () => {
    sourceModal.classList.add('hidden');
  });
  
  // 点击源码模态框背景关闭
  sourceModal.addEventListener('click', (e) => {
    if (e.target === sourceModal) {
      sourceModal.classList.add('hidden');
    }
  });
  
  // 复制源代码按钮
  copySourceBtn.addEventListener('click', () => {
    const sourceToCopy = sourceCodeDisplay.textContent;
    if (sourceToCopy) {
      navigator.clipboard.writeText(sourceToCopy)
        .then(() => {
          showNotification('源代码已复制到剪贴板', 'success');
        })
        .catch(err => {
          showNotification('复制失败: ' + err, 'error');
        });
    }
  });

  // 按ESC键关闭模态框和结果面板
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resultPanel.classList.add('hidden');
      aboutModal.classList.add('hidden');
      sourceModal.classList.add('hidden');
      // 确保加载动画被隐藏
      loadingOverlay.classList.add('hidden');
    }
  });

  // 页面加载完成时强制隐藏加载动画
  window.addEventListener('load', function() {
    setTimeout(() => {
      // 确保加载动画被隐藏（额外的安全措施）
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
      }
    }, 500);
  });

  // 绑定事件
  generateFromUrlBtn.addEventListener('click', generateFromUrl);

  // URL输入框回车事件
  targetUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      generateFromUrl();
    }
  });

  // 更新按钮状态的函数
  function updateGenerateFromUrlButton() {
    const url = targetUrlInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    generateFromUrlBtn.disabled = !url || !apiKey;
  }

  // 添加输入监听
  targetUrlInput.addEventListener('input', updateGenerateFromUrlButton);
  apiKeyInput.addEventListener('input', updateGenerateFromUrlButton);

  // 初始化按钮状态
  updateGenerateFromUrlButton();

  // 添加文章生成按钮点击事件
  if (generateArticleBtn) {
    generateArticleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateArticleContent();
    });
  }

  // 初始化应用
  initializeApp();
});