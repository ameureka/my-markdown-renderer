// 技术介绍模板
export default {
  name: 'tech_intro',
  displayName: '技术介绍',
  description: '用于技术产品、工具或框架的介绍',
  styles: `
    body { 
      font-family: 'Roboto', 'Noto Sans SC', sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 100%;
      margin: auto;
      background-color: #f5f9fc;
      color: #333;
    }
    
    main { 
      background-color: #fff;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.08);
      width: 100%;
      box-sizing: border-box;
    }
    
    /* 技术介绍专用标题样式 */
    h1 { 
      font-size: 28px;
      font-weight: 600;
      color: #2563eb;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 10px;
      margin-top: 10px;
      margin-bottom: 25px;
    }
    
    h2 {
      font-size: 22px;
      color: #0369a1;
      border-left: 4px solid #0369a1;
      padding-left: 10px;
      margin-top: 30px;
    }
    
    h3 {
      font-size: 18px;
      color: #0891b2;
      margin-top: 25px;
    }
    
    /* 代码样式增强 */
    code { 
      background-color: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: 'JetBrains Mono', monospace;
      color: #1e40af;
    }
    
    pre { 
      background-color: #0f172a;
      color: #e2e8f0;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      border: 1px solid #334155;
    }
    
    pre code {
      background-color: transparent;
      color: #e2e8f0;
      padding: 0;
    }
    
    /* 技术概念强调 */
    blockquote { 
      background-color: #dbeafe;
      border-left: 5px solid #3b82f6;
      padding: 15px;
      margin-left: 0;
      margin-right: 0;
      color: #1e40af;
      border-radius: 0 6px 6px 0;
    }
    
    /* 链接按钮样式 */
    a { 
      color: #2563eb;
      text-decoration: none;
      border-bottom: 1px dotted #2563eb;
    }
    
    a:hover { 
      color: #1d4ed8;
      border-bottom: 1px solid #1d4ed8;
    }
    
    /* 表格样式 */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.9em;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    }
    
    th {
      background-color: #2563eb;
      color: #ffffff;
      text-align: left;
      padding: 12px 15px;
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #dddddd;
    }
    
    tr:nth-of-type(even) {
      background-color: #f8fafc;
    }
    
    tr:last-of-type td {
      border-bottom: none;
    }
    
    tr:hover {
      background-color: #dbeafe;
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
        padding: 15px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      h2 {
        font-size: 20px;
      }
      
      pre {
        padding: 10px;
      }
      
      table {
        font-size: 0.8em;
      }
      
      th, td {
        padding: 8px 10px;
      }
    }
  `,
  template: function(title, content) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=JetBrains+Mono&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    <style>${this.styles}</style>
</head>
<body>
    <main>${content}</main>
    <footer>
        <hr>
        <p><small>由 Markdown 渲染服务生成 · 技术介绍模板</small></p>
    </footer>
</body>
</html>`;
  }
};