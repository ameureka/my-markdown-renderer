// 新闻广播模板
export default {
  name: 'news_broad',
  displayName: '新闻广播',
  description: '用于新闻、公告和实时信息发布',
  styles: `
    body { 
      font-family: 'Georgia', 'Noto Serif SC', serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 100%;
      margin: auto;
      background-color: #f9fafb;
      color: #111827;
    }
    
    main { 
      background-color: #fff;
      padding: 25px;
      border-radius: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      width: 100%;
      box-sizing: border-box;
    }
    
    /* 新闻标题 */
    h1 { 
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 15px;
      margin-top: 10px;
      margin-bottom: 25px;
      letter-spacing: -0.025em;
      line-height: 1.2;
    }
    
    h2 {
      font-size: 24px;
      color: #1f2937;
      margin-top: 35px;
      font-weight: 600;
    }
    
    h3 {
      font-size: 20px;
      color: #374151;
      margin-top: 25px;
      font-weight: 600;
    }
    
    /* 段落和文本 */
    p {
      margin-bottom: 20px;
      font-size: 17px;
    }
    
    /* 引用和来源 */
    blockquote { 
      background-color: #f3f4f6;
      border-left: 5px solid #9ca3af;
      padding: 15px 20px;
      margin: 25px 0;
      font-style: italic;
      color: #4b5563;
    }
    
    blockquote p:last-child {
      margin-bottom: 0;
    }
    
    /* 新闻引用源 */
    .source {
      font-size: 14px;
      color: #6b7280;
      text-align: right;
      margin-top: -15px;
      font-style: normal;
    }
    
    /* 链接样式 */
    a { 
      color: #2563eb;
      text-decoration: none;
    }
    
    a:hover { 
      text-decoration: underline;
    }
    
    /* 图片处理 */
    img {
      max-width: 100%;
      height: auto;
      margin: 20px 0;
      display: block;
    }
    
    /* 图片说明 */
    .caption {
      font-size: 14px;
      color: #6b7280;
      text-align: center;
      margin-top: -15px;
      margin-bottom: 20px;
    }
    
    /* 日期时间戳 */
    .dateline {
      font-weight: 700;
      color: #6b7280;
      margin-bottom: 20px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* 响应式设计 */
    @media (min-width: 768px) {
      body {
        max-width: 780px;
      }
      
      main {
        padding: 40px;
      }
    }
    
    @media (max-width: 767px) {
      body {
        padding: 10px;
      }
      
      main {
        padding: 20px;
      }
      
      h1 {
        font-size: 26px;
      }
      
      h2 {
        font-size: 20px;
      }
      
      p {
        font-size: 16px;
      }
    }
    
    /* 页脚样式 */
    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
  `,
  template: function(title, content) {
    // 添加发布日期时间戳
    const now = new Date();
    const formattedDate = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // 添加时间戳到渲染内容中
    const contentWithTimestamp = `<div class="dateline">${formattedDate}</div>\n${content}`;
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Georgia&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
    <style>${this.styles}</style>
</head>
<body>
    <main>${contentWithTimestamp}</main>
    <footer>
        <p><small>由 Markdown 渲染服务生成 · 新闻广播模板</small></p>
    </footer>
</body>
</html>`;
  }
};