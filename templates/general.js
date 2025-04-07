// 通用模板
export default {
  name: 'general',
  displayName: '通用',
  description: '适用于微信公众号排版的通用模板，遵循公众号的宽度和布局规范',
  styles: `
    :root {
      --primary-color: #c06000;       /* 主题橙色 */
      --primary-light: #e09010;
      --primary-dark: #a04000;
      --text-color: #333333;          /* 主文本颜色 */
      --text-light: #8c8c8c;          /* 次要文本颜色 */
      --text-subtitle: #595959;       /* 副标题颜色 */
      --bg-color: #ffffff;            /* 背景色 */
      --bg-card: #ffffff;
      --border-color: #e8e8e8;
      --divider-color: #f0f0f0;
      --code-bg: #f8f8f8;
      --blockquote-bg: #f8f8f8;
      --blockquote-border: #c06000;
      --max-content-width: 800px;     /* 微信公众号推荐的内容宽度 */
    }
    
    /* 全局样式 */
    body { 
      font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.75;
      padding: 0;
      margin: 0;
      background-color: var(--bg-color);
      color: var(--text-color);
      font-size: 15px; /* 适合公众号阅读的字体大小 */
    }
    
    .container {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: 12px 16px;
    }
    
    /* 目录样式 */
    .sidebar {
      margin: 20px 0;
      padding: 20px;
      background-color: #f8f8f8;
      border-radius: 8px;
      border-left: 3px solid var(--primary-color);
    }
    
    .sidebar-title {
      font-size: 16px;
      font-weight: bold;
      color: var(--text-color);
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--divider-color);
    }
    
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .nav-list li {
      margin-bottom: 10px;
    }
    
    .nav-list li a {
      display: flex;
      align-items: center;
      color: var(--text-color);
      text-decoration: none;
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 14px;
      transition: background-color 0.2s;
    }
    
    .nav-list li a:hover {
      background-color: rgba(7, 193, 96, 0.1);
    }
    
    .nav-list li a::before {
      content: "•";
      color: var(--primary-color);
      margin-right: 8px;
      font-weight: bold;
    }
    
    .nav-list .h3-item {
      padding-left: 20px;
      font-size: 13px;
      color: var(--text-light);
    }
    
    /* 主内容区 */
    main {
      background-color: var(--bg-card);
      padding: 20px 0;
    }
    
    /* 内容头部 */
    .content-header {
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--divider-color);
      text-align: center;
    }
    
    /* 标题样式 */
    h1 {
      font-size: 22px;
      font-weight: bold;
      color: var(--text-color);
      margin-top: 0;
      margin-bottom: 15px;
      padding-bottom: 10px;
      line-height: 1.5;
      text-align: center;
    }
    
    h2 {
      font-size: 18px;
      color: var(--text-color);
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
      position: relative;
    }
    
    h2::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 64px;
      height: 2px;
      background-color: var(--primary-color);
    }
    
    h3 {
      font-size: 16px;
      color: var(--text-color);
      margin-top: 25px;
      margin-bottom: 15px;
      position: relative;
      padding-left: 12px;
    }
    
    h3::before {
      content: "";
      position: absolute;
      left: 0;
      top: 3px;
      bottom: 3px;
      width: 3px;
      background-color: var(--primary-color);
      border-radius: 3px;
    }
    
    /* 段落样式 */
    p {
      margin: 0 0 16px;
      font-size: 15px;
      line-height: 1.8;
      color: var(--text-color);
      text-align: justify;
    }
    
    /* 列表样式 */
    ul, ol {
      margin: 0 0 20px;
      padding-left: 24px;
    }
    
    li {
      margin-bottom: 8px;
      line-height: 1.7;
    }
    
    li > ul, li > ol {
      margin-top: 8px;
      margin-bottom: 0;
    }
    
    /* 代码样式 */
    code { 
      background-color: var(--code-bg);
      padding: 3px 6px;
      border-radius: 4px;
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 14px;
      color: #d14;
    }
    
    pre { 
      background-color: var(--code-bg);
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 20px 0;
      border: 1px solid var(--border-color);
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      color: var(--text-color);
      font-size: 13px;
      line-height: 1.5;
    }
    
    /* 引用样式 */
    blockquote { 
      background-color: var(--blockquote-bg);
      border-left: 4px solid var(--blockquote-border);
      padding: 15px;
      margin: 20px 0;
      color: var(--text-subtitle);
      border-radius: 0 4px 4px 0;
    }
    
    blockquote > *:last-child {
      margin-bottom: 0;
    }
    
    /* 表格样式 */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    
    th {
      background-color: #f7f7f7;
      color: var(--text-color);
      font-weight: bold;
      padding: 10px;
      text-align: left;
      border: 1px solid var(--border-color);
    }
    
    td {
      padding: 10px;
      border: 1px solid var(--border-color);
    }
    
    tr:nth-child(even) {
      background-color: #fafafa;
    }
    
    /* 图片样式 */
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 20px auto;
      border-radius: 4px;
    }
    
    /* 链接样式 */
    a {
      color: var(--primary-color);
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* 页脚样式 */
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--divider-color);
      color: var(--text-light);
      font-size: 13px;
      text-align: center;
    }
    
    .footer-brand {
      margin-bottom: 10px;
    }
    
    .footer-article-number {
      margin-bottom: 10px;
      color: var(--text-light);
    }
    
    .footer-links {
      margin-bottom: 15px;
    }
    
    .footer-links a {
      color: var(--primary-color);
      text-decoration: none;
      margin: 0 5px;
    }
    
    .footer-reply {
      font-style: italic;
      margin-top: 10px;
    }
    
    /* 二维码宣传区域 */
    .qrcode-container {
      margin: 30px auto;
      max-width: 100%;
      background-color: #ffffff;
      padding: 20px;
      position: relative;
      text-align: center;
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 40px;
    }
    
    .qrcode-decoration {
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      height: 60px;
      overflow: hidden;
    }
    
    .qrcode-triangle {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 60px 60px 0;
      border-color: transparent #a04000 transparent transparent;
    }
    
    .qrcode-header {
      font-size: 24px;
      font-weight: bold;
      color: #000;
      margin-bottom: 5px;
      text-align: left;
      padding-left: 20px;
    }
    
    .qrcode-subtitle {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
      text-align: left;
      padding-left: 20px;
    }
    
    .qrcode-description {
      font-size: 14px;
      color: #333;
      line-height: 1.6;
      margin-bottom: 20px;
      text-align: left;
      padding-left: 20px;
      position: relative;
    }
    
    .qrcode-description::before {
      content: "◣";
      position: absolute;
      left: 0;
      top: 2px;
      font-size: 12px;
      color: #000;
    }
    
    .qrcode-image-container {
      width: 240px;
      margin: 0 auto;
      border: 2px solid #c06000;
      border-radius: 4px;
      padding: 8px;
      background-color: white;
    }
    
    .qrcode-img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .qrcode-caption {
      font-size: 14px;
      color: #333;
      text-align: center;
      margin: 10px 0;
    }
    
    .qrcode-note {
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    
    /* 移动端适配 */
    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }
      
      h1 {
        font-size: 20px;
      }
      
      h2 {
        font-size: 17px;
      }
      
      h3 {
        font-size: 15px;
      }
      
      p, li {
        font-size: 14px;
      }
      
      .qrcode-image-container {
        width: 240px;
      }
      
      .qrcode-header {
        font-size: 20px;
      }
      
      .qrcode-subtitle {
        font-size: 16px;
      }
    }
    
    /* 历史文章区域样式 */
    .history-articles {
      margin: 0;
      padding: 0;
    }
    
    .history-cards {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .history-card {
      border-radius: 8px;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-decoration: none;
      color: white;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      height: 70px;
      overflow: hidden;
      position: relative;
      z-index: 1;
    }
    
    .history-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.15;
      z-index: -1;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        radial-gradient(circle at 30% 65%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        radial-gradient(circle at 60% 10%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        radial-gradient(circle at 90% 40%, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
      background-size: 120px 120px;
    }
    
    .history-card::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background-image: 
        linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%);
    }
    
    .history-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }
    
    .history-card:hover .card-icon {
      transform: rotate(45deg);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    }
    
    .card-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    
    .history-card h3 {
      color: white;
      font-size: 18px;
      font-weight: 500;
      margin: 0;
      padding: 0;
      border: none;
    }
    
    .history-card h3::before {
      display: none;
    }
    
    .card-icon {
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card-1 {
      background: linear-gradient(135deg, #a04000 0%, #b05000 100%);
      background-image: 
        linear-gradient(135deg, #a04000 0%, #b05000 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
      background-blend-mode: overlay;
    }
    
    .card-2 {
      background: linear-gradient(135deg, #c06000 0%, #c07000 100%);
      background-image: 
        linear-gradient(135deg, #c06000 0%, #c07000 100%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E");
      background-blend-mode: overlay;
    }
    
    .card-3 {
      background: linear-gradient(135deg, #d07000 0%, #d08010 100%);
      background-image: 
        linear-gradient(135deg, #d07000 0%, #d08010 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
      background-blend-mode: overlay;
    }
    
    .card-4 {
      background: linear-gradient(135deg, #e09010 0%, #e0a010 100%);
      background-image: 
        linear-gradient(135deg, #e09010 0%, #e0a010 100%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M13 0v8H0V0h13zm65 0v8H13V0h65zM0 8v16h13V8H0zm13 16h65V8H13v16zM0 0h13v8H0V0zm13 8v16h65V8H13zm65-8v8h13V0H78zm0 8h13v16H78V8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      background-blend-mode: overlay;
    }
    
    /* 移动端适配 */
    @media (max-width: 768px) {
      .history-card {
        padding: 12px 15px;
        height: 60px;
      }
      
      .history-card h3 {
        font-size: 16px;
      }
    }
    
    /* 链接区域样式 */
    .links-section {
      margin: 30px 0;
      border-top: 1px solid var(--border-color);
      padding-top: 20px;
      position: relative;
    }
    
    .links-section::before {
      content: "";
      position: absolute;
      top: -1px;
      left: 0;
      width: 80px;
      height: 3px;
      background-color: #a04000;
    }
    
    .links-title {
      font-size: 20px;
      font-weight: bold;
      color: #a04000;
      margin-bottom: 20px;
      padding-left: 10px;
      position: relative;
      border-left: 3px solid #a04000;
    }
    
    .links-title::before {
      display: none;
    }
  `,
  render: function(title, content) {
    // 初始化额外参数，保持与原参数结构兼容
    const date = null;
    const tags = [];
    
    // 构建标题和元数据区
    const headerSection = `
      <div class="content-header">
        <h1>${title || ''}</h1>
        <div class="content-meta">
          ${date ? `<span class="date">${date}</span>` : ''}
        </div>
        ${tags && tags.length ? `
          <div class="tags">
            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
    // 添加历史文章区域
    const historySection = `
      <div class="history-articles">
        <div class="history-cards">
          <a href="http://mp.weixin.qq.com/mp/homepage?__biz=MzU1NjA1NzkyNw==&hid=25&sn=3da9de77cdde4474c3927ad49fea791c&scene=18#wechat_redirect" class="history-card card-1">
            <div class="card-content">
              <h3>AI大模型&生成PPT</h3>
              <div class="card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </a>
          <a href="http://mp.weixin.qq.com/mp/homepage?__biz=MzU1NjA1NzkyNw==&hid=19&sn=0ada034fbe22bb1ec9db8581d80d1c02&scene=18#wechat_redirect" class="history-card card-2">
            <div class="card-content">
              <h3>工作商务科技</h3>
              <div class="card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9L12 16L5 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </a>
          <a href="http://www.baidu.com" class="history-card card-3">
            <div class="card-content">
              <h3>MAC软件目录</h3>
              <div class="card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12L19 19M12 12L5 19M12 12L12 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </a>
          <a href="http://mp.weixin.qq.com/mp/homepage?__biz=MzU1NjA1NzkyNw==&hid=24&sn=2abec214a6f8c346f8068a901b2b105f&scene=18#wechat_redirect" class="history-card card-4">
            <div class="card-content">
              <h3>教程</h3>
              <div class="card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 9L12 5L16 9M8 15L12 19L16 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>
    `;
    
    // 添加页脚
    const footerSection = `
      <div class="footer">
        <div class="footer-brand">观点 / 阿橘 主笔 / ameureka 编辑 /</div>
        <div class="footer-article-number">这是阿橘公众号的第325原创文章</div>
        <div class="footer-links">
          <a href="#">有求必答</a> | <a href="#">免费分享</a> | <a href="#">AI咨询</a>
        </div>
        <div class="footer-reply">请在公众号后台回复</div>
      </div>
    `;
    
    // 添加二维码宣传区域
    const qrcodeSection = `
      <div class="qrcode-container">
        <div class="qrcode-decoration">
          <div class="qrcode-triangle"></div>
        </div>
        <div class="qrcode-header">设计交流</div>
        <div class="qrcode-subtitle">Design Communication</div>
        <div class="qrcode-description">
          我们会在这里分享设计干货、设计资源、设计案例、教程
          欢迎加入我们以及我们的交流群，期待与大家一起成长。
        </div>
        <div class="qrcode-image-container">
          <img src="https://pub-dc1343d29aa347ffac1c77099f7a67b4.r2.dev/wecom_chuan_qr.png" alt="二维码" class="qrcode-img">
        </div>
        <div class="qrcode-caption">长按扫码联系我们</div>
        <div class="qrcode-note">添加好友请注明来意哦</div>
      </div>
    `;
    
    // 构建侧边导航的目录结构
    let tocItems = [];
    const headings = content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/g) || [];
    
    if (headings.length) {
      headings.forEach(heading => {
        const levelMatch = heading.match(/<h([1-3])/);
        const textMatch = heading.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/);
        
        if (levelMatch && textMatch) {
          const level = parseInt(levelMatch[1]);
          const text = textMatch[1].replace(/<[^>]+>/g, ''); // 移除可能的内嵌标签
          const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        
        tocItems.push({
          level,
          text,
          id
        });
        }
      });
    }
    
    const sidebarContent = `
      <div class="sidebar">
        <div class="sidebar-title">目录</div>
        <ul class="nav-list">
          ${tocItems.map(item => `
            <li>
              <a href="#${item.id}" class="${item.level === 3 ? 'h3-item' : ''}">
                ${item.text}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    
    // 最终HTML构建
    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || ''}</title>
      <style>${this.styles}</style>
    </head>
    <body>
      <div class="container">
        ${tocItems.length > 0 ? sidebarContent : ''}
        <main>
          ${headerSection}
          <div class="content">
            ${content}
          </div>
          <div class="links-section">
            <h2 class="links-title">历史文章</h2>
            ${historySection}
          </div>
          ${qrcodeSection}
          ${footerSection}
        </main>
      </div>
      
      <script>
        // 为导航栏添加active类
        document.addEventListener('DOMContentLoaded', () => {
          const navLinks = document.querySelectorAll('.nav-list a');
          const sections = document.querySelectorAll('h1, h2, h3');
          
          // 初始化时添加ID
          sections.forEach(section => {
            if (!section.id) {
              section.id = section.textContent.toLowerCase().replace(/[^\w]+/g, '-');
            }
          });
          
          // 滚动监听
          window.addEventListener('scroll', () => {
            let currentSectionId = '';
            sections.forEach(section => {
              const sectionTop = section.offsetTop;
              if (window.pageYOffset >= sectionTop - 100) {
                currentSectionId = section.id;
              }
            });
            
            // 更新活动导航项
            navLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
              }
            });
          });
          
          // 点击导航项滚动到相应部分
          navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              const targetId = link.getAttribute('href').substring(1);
              const targetElement = document.getElementById(targetId);
              
              if (targetElement) {
              window.scrollTo({
                top: targetElement.offsetTop - 50,
                behavior: 'smooth'
              });
              
              // 更新URL
              history.pushState(null, null, '#' + targetId);
              }
            });
          });
        });
      </script>
    </body>
    </html>
    `;
  }
};