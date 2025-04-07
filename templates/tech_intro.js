// 技术介绍模板
export default {
  name: 'tech_intro',
  displayName: '技术介绍',
  description: '用于技术产品、工具或框架的介绍，适合微信公众号的现代技术风格',
  styles: `
    :root {
      --primary-color: #3b82f6;
      --primary-dark: #2563eb;
      --secondary-color: #0ea5e9;
      --text-color: #1e293b;
      --text-light: #64748b;
      --bg-color: #f8fafc;
      --bg-code: #0f172a;
      --bg-sidebar: #0f172a;
      --code-text: #e2e8f0;
      --max-content-width: 750px; /* 微信推荐的最大内容宽度 */
    }

    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', 'Noto Sans SC', Arial, sans-serif;
      line-height: 1.7;
      margin: 0;
      padding: 0;
      background-color: var(--bg-color);
      color: var(--text-color);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-size: 15px; /* 适合微信阅读的字体大小 */
    }
    
    .layout {
      display: flex;
      flex: 1;
    }
    
    header {
      background-color: var(--primary-color);
      color: white;
      padding: 16px 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .header-content {
      max-width: var(--max-content-width);
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .header-title {
      font-size: 22px;
      font-weight: 600;
      margin: 0;
    }
    
    .header-meta {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    
    .content-wrapper {
      max-width: var(--max-content-width);
      margin: 0 auto;
      display: flex;
      flex: 1;
      width: 100%;
    }
    
    .sidebar {
      width: 260px;
      background-color: white;
      border-right: 1px solid #e2e8f0;
      padding: 25px 0;
      position: sticky;
      top: 76px;
      height: calc(100vh - 76px);
      overflow-y: auto;
    }
    
    .toc-title {
      padding: 0 20px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: var(--text-light);
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .toc-list li {
      margin-bottom: 2px;
    }
    
    .toc-list li a {
      display: block;
      padding: 8px 20px;
      color: var(--text-color);
      text-decoration: none;
      font-size: 14px;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }
    
    .toc-list li a:hover, .toc-list li a.active {
      background-color: #f1f5f9;
      border-left-color: var(--primary-color);
      color: var(--primary-color);
    }
    
    .toc-list li.h3 a {
      padding-left: 35px;
      font-size: 13px;
      color: var(--text-light);
    }
    
    main { 
      flex: 1;
      max-width: var(--max-content-width);
      padding: 30px 20px;
      background-color: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.03);
    }
    
    /* 通用标题样式 */
    h1 { 
      font-size: 28px; /* 适合微信的标题大小 */
      font-weight: 700;
      color: var(--primary-dark);
      margin-top: 0;
      margin-bottom: 20px;
      line-height: 1.4;
    }
    
    h2 {
      font-size: 22px;
      color: var(--text-color);
      margin-top: 40px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 600;
    }
    
    h3 {
      font-size: 18px;
      color: var(--text-color);
      margin-top: 25px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    /* 段落样式 */
    p {
      margin-bottom: 16px; /* 适合微信的段落间距 */
      font-size: 15px;
      line-height: 1.8;
    }
    
    /* 代码样式 */
    code { 
      background-color: #f1f5f9;
      padding: 3px 6px;
      border-radius: 4px;
      font-family: 'Menlo', 'Courier New', monospace; /* 微信支持的等宽字体 */
      font-size: 14px;
      color: var(--primary-dark);
    }
    
    pre { 
      background-color: var(--bg-code);
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 20px 0;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      color: var(--code-text);
      font-size: 14px;
      line-height: 1.6;
    }
    
    /* 引用样式 */
    blockquote { 
      background-color: #f0f9ff;
      border-left: 5px solid var(--secondary-color);
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
      font-size: 15px;
    }
    
    blockquote p:last-child {
      margin-bottom: 0;
    }
    
    /* 强调内容框 - 微信公众号友好版本 */
    .note, .tip, .warning, .danger {
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 6px;
      position: relative;
      padding-left: 50px;
      font-size: 14px;
    }
    
    .note::before, .tip::before, .warning::before, .danger::before {
      position: absolute;
      left: 16px;
      top: 16px;
      font-size: 18px;
      font-weight: bold;
    }
    
    .note {
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
    }
    
    .note::before {
      content: "ⓘ";
      color: #0ea5e9;
    }
    
    .tip {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
    }
    
    .tip::before {
      content: "✓";
      color: #22c55e;
    }
    
    .warning {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
    }
    
    .warning::before {
      content: "⚠";
      color: #f59e0b;
    }
    
    .danger {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
    }
    
    .danger::before {
      content: "✗";
      color: #ef4444;
    }
    
    /* 链接样式 */
    a { 
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    a:hover { 
      color: var(--primary-dark);
      text-decoration: underline;
    }
    
    /* 列表样式 */
    ul, ol {
      padding-left: 22px;
      margin: 16px 0;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    /* 表格样式 - 微信友好版本 */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
      border-radius: 6px;
      overflow: hidden;
    }
    
    th {
      background-color: var(--primary-color);
      color: white;
      text-align: left;
      padding: 12px;
      font-weight: 500;
    }
    
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    /* 图片样式 - 微信优化 */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      display: block;
      margin: 20px auto;
      box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    }
    
    /* 标签样式 */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    
    .tag {
      display: inline-block;
      background: #e5f7ff;
      color: var(--primary-color);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
    }
    
    /* 页脚样式 */
    footer {
      text-align: center;
      padding: 30px 20px;
      background-color: var(--bg-sidebar);
      color: white;
      margin-top: 30px;
    }
    
    .footer-logo {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
      color: white;
    }
    
    footer p {
      margin: 5px 0;
      font-size: 14px;
      opacity: 0.8;
    }
    
    /* 响应式设计 - 微信公众号优化 */
    @media (max-width: 900px) {
      .layout {
        flex-direction: column;
      }
      
      .content-wrapper {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
        height: auto;
        position: relative;
        top: 0;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
        padding: 20px 0;
      }
      
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .header-meta {
        margin-top: 8px;
      }
    }
    
    @media (max-width: 480px) {
      header {
        padding: 12px 16px;
      }
      
      main {
        padding: 20px 16px;
      }
      
      .header-title {
        font-size: 20px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      h2 {
        font-size: 20px;
      }
      
      h3 {
        font-size: 17px;
      }
    }
  `,
  
  template: function(title, content, metadata = {}) {
    // 处理元数据
    const date = metadata.date || new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date instanceof Date 
      ? date.toLocaleDateString('zh-CN', dateOptions)
      : new Date().toLocaleDateString('zh-CN', dateOptions);
    
    // 处理标签
    const tags = metadata.tags || [];
    let tagsHtml = '';
    if (tags.length > 0) {
      tagsHtml = '<div class="tags">' + 
        tags.map(tag => `<span class="tag">${tag}</span>`).join('') + 
        '</div>';
    }
    
    // 提取标题和添加ID以创建目录
    const generateTOC = (content) => {
      const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/g;
      let match;
      let toc = '';
      const headings = [];
      
      // 克隆内容用于匹配
      let tempContent = content;
      
      // 匹配所有标题并添加ID
      while ((match = regex.exec(tempContent)) !== null) {
        const level = match[1];
        const text = match[2].replace(/<[^>]*>/g, '');
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        
        headings.push({ level, text, id });
        
        // 替换原始标题，添加id属性
        const originalHeading = match[0];
        const newHeading = originalHeading.replace(`<h${level}`, `<h${level} id="${id}"`);
        content = content.replace(originalHeading, newHeading);
      }
      
      // 生成目录
      if (headings.length > 0) {
        headings.forEach(heading => {
          const className = heading.level === '2' ? '' : 'h3';
          toc += `<li class="${className}"><a href="#${heading.id}">${heading.text}</a></li>`;
        });
      }
      
      return { toc, processedContent: content };
    };
    
    // 处理特殊格式标签
    const processSpecialBlocks = (content) => {
      // 将特殊标记转换为对应的样式块
      content = content
        .replace(/<p>:::note\s*(.*?)\s*:::<\/p>(.*?)<p>:::\/note:::<\/p>/gs, '<div class="note">$2</div>')
        .replace(/<p>:::tip\s*(.*?)\s*:::<\/p>(.*?)<p>:::\/tip:::<\/p>/gs, '<div class="tip">$2</div>')
        .replace(/<p>:::warning\s*(.*?)\s*:::<\/p>(.*?)<p>:::\/warning:::<\/p>/gs, '<div class="warning">$2</div>')
        .replace(/<p>:::danger\s*(.*?)\s*:::<\/p>(.*?)<p>:::\/danger:::<\/p>/gs, '<div class="danger">$2</div>');
      
      return content;
    };
    
    // 处理内容
    let processedContent = processSpecialBlocks(content);
    const { toc, processedContent: contentWithIds } = generateTOC(processedContent);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    <style>${this.styles}</style>
    <script>
      // 当页面加载完成后执行
      document.addEventListener('DOMContentLoaded', function() {
        // 给当前激活的目录项添加active类
        const updateActiveNavItem = () => {
          const navItems = document.querySelectorAll('.toc-list a');
          const scrollPosition = window.scrollY;
          
          // 找到当前可见的标题
          let activeId = null;
          document.querySelectorAll('h2[id], h3[id]').forEach(heading => {
            const top = heading.getBoundingClientRect().top + window.scrollY;
            if (top - 100 <= scrollPosition) {
              activeId = heading.id;
            }
          });
          
          // 更新导航项的激活状态
          navItems.forEach(item => {
            item.classList.remove('active');
            if (activeId && item.getAttribute('href') === '#' + activeId) {
              item.classList.add('active');
            }
          });
        };
        
        // 监听滚动事件
        window.addEventListener('scroll', updateActiveNavItem);
        updateActiveNavItem();
      });
    </script>
</head>
<body>
    <header>
        <div class="header-content">
            <h1 class="header-title">${title}</h1>
            <div class="header-meta">
                <span>发布于: ${formattedDate}</span>
                ${tagsHtml}
            </div>
        </div>
    </header>
    
    <div class="layout">
        <div class="content-wrapper">
            <aside class="sidebar">
                <div class="toc-title">目录</div>
                <ul class="toc-list">
                    ${toc || '<li>没有找到目录条目</li>'}
                </ul>
            </aside>
            <main>${contentWithIds}</main>
        </div>
    </div>
    
    <footer>
        <div class="footer-logo">技术文档渲染服务</div>
        <p>由 Markdown 渲染服务生成 · 技术介绍模板</p>
        <p><small>©${new Date().getFullYear()} 我的Markdown渲染器</small></p>
    </footer>
</body>
</html>`;
  }
};