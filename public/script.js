// 应用主逻辑
document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
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

  // 状态变量
  let selectedTemplate = 'general'; // 默认模板
  let generatedUrl = null;
  let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

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

  // 初始化应用
  initializeApp();
});