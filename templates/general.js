// 通用模板
export default {
  name: 'general',
  displayName: '通用',
  description: '适用于各种场景的通用模板',
  styles: `
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 'Noto Sans SC', sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 100%;
      margin: auto;
      background-color: #f8f9fa;
      color: #343a40;
    }
    
    main { 
      background-color: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      width: 100%;
      box-sizing: border-box;
    }
    
    /* 通用标题样式 */
    h1 { 
      font-size: 28px;
      font-weight: 600;
      color: #212529;
      margin-top: 0;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e9ecef;
    }
    
    h2 {
      font-size: 22px;
      color: #343a40;
      margin-top: 32px;
      margin-bottom: 16px;
    }
    
    h3 {
      font-size: 18px;
      color: #495057;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    
    /* 段落样式 */
    p {
      margin-bottom: 16px;
    }
    
    /* 代码样式 */
    code { 
      background-color: #f1f3f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
      font-size: 0.9em;
      color: #e83e8c;
    }
    
    pre { 
      background-color: #f8f9fa;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      border: 1px solid #e9ecef;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      color: #212529;
    }
    
    /* 引用样式 */
    blockquote { 
      background-color: #f8f9fa;
      border-left: 4px solid #ced4da;
      padding: 16px;
      margin: 20px 0;
      color: #495057;
    }
    
    blockquote p:last-child {
      margin-bottom: 0;
    }
    
    /* 链接样式 */
    a { 
      color: #0d6efd;
      text-decoration: none;
    }
    
    a:hover { 
      text-decoration: underline;
    }
    
    /* 列表样式 */
    ul, ol {
      padding-left: 24px;
      margin: 16px 0;
    }
    
    li {
      margin-bottom: 6px;
    }
    
    /* 表格样式 */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 0.95em;
    }
    
    th {
      background-color: #f8f9fa;
      text-align: left;
      padding: 12px;
      border-bottom: 2px solid #dee2e6;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }
    
    /* 图片样式 */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      display: block;
      margin: 20px auto;
    }
    
    /* 响应式设计 */
    @media (min-width: 768px) {
      body {
        max-width: 800px;
      }
    }
    
    @media (max-width: 767px) {
      body {
        padding: 15px;
      }
      
      main {
        padding: 20px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      h2 {
        font-size: 20px;
      }
    }
    
    /* 页脚样式 */
    footer {
      margin-top: 32px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
    }
  `,
  template: function(title, content) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    <style>${this.styles}</style>
</head>
<body>
    <main>${content}</main>
    <footer>
        <hr>
        <p><small>由 Markdown 渲染服务生成 · 通用模板</small></p>
    </footer>
</body>
</html>`;
  }
};