// 技术解释模板
module.exports = {
  name: 'tech_interpre',
  displayName: '技术解释',
  description: '用于深入解释技术概念和原理',
  styles: `
    body { 
      font-family: 'Inter', 'Noto Sans SC', sans-serif;
      line-height: 1.7;
      padding: 20px;
      max-width: 100%;
      margin: auto;
      background-color: #f1f5f9;
      color: #334155;
    }
    
    main { 
      background-color: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      width: 100%;
      box-sizing: border-box;
    }
    
    /* 技术解释专用标题样式 */
    h1 { 
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
      position: relative;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }
    
    h1:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100px;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #a855f7);
      border-radius: 2px;
    }
    
    h2 {
      font-size: 24px;
      color: #1e293b;
      margin-top: 40px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    h3 {
      font-size: 20px;
      color: #334155;
      margin-top: 30px;
      margin-bottom: 12px;
    }
    
    /* 解释性段落 */
    p {
      margin-bottom: 20px;
      font-size: 16px;
    }
    
    /* 重要概念强调 */
    strong {
      color: #334155;
      font-weight: 600;
    }
    
    /* 代码样式 */
    code { 
      background-color: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: 'Fira Code', monospace;
      color: #0f172a;
    }
    
    pre { 
      background-color: #1e293b;
      color: #e2e8f0;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 25px 0;
      position: relative;
    }
    
    pre::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #a855f7);
    }
    
    pre code {
      background-color: transparent;
      color: #e2e8f0;
      padding: 0;
    }
    
    /* 关键概念说明 */
    blockquote { 
      background-color: #eef2ff;
      border-left: 5px solid #6366f1;
      padding: 20px;
      margin: 25px 0;
      color: #4338ca;
      border-radius: 8px;
    }
    
    blockquote p:last-child {
      margin-bottom: 0;
    }
    
    /* 提示和说明 */
    .note {
      background-color: #fffbeb;
      border-left: 5px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      color: #92400e;
      border-radius: 8px;
    }
    
    /* 链接样式 */
    a { 
      color: #3b82f6;
      text-decoration: none;
      transition: color 0.2s;
      border-bottom: 1px solid rgba(59, 130, 246, 0.3);
    }
    
    a:hover { 
      color: #2563eb;
      border-bottom: 1px solid rgba(37, 99, 235, 0.7);
    }
    
    /* 列表样式 */
    ul, ol {
      margin: 20px 0;
      padding-left: 30px;
    }
    
    li {
      margin-bottom: 8px;
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
      background-color: #f8fafc;
      text-align: left;
      padding: 12px 15px;
      font-weight: 600;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    tr:last-of-type td {
      border-bottom: none;
    }
    
    tr:hover {
      background-color: #f8fafc;
    }
    
    /* 响应式设计 */
    @media (min-width: 768px) {
      body {
        max-width: 850px;
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
        font-size: 26px;
      }
      
      h2 {
        font-size: 22px;
      }
      
      h3 {
        font-size: 18px;
      }
      
      pre {
        padding: 15px;
      }
    }
    
    /* 页脚样式 */
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
  `,
  template: function(title, content) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    <style>${this.styles}</style>
</head>
<body>
    <main>${content}</main>
    <footer>
        <hr>
        <p><small>由 Markdown 渲染服务生成 · 技术解释模板</small></p>
    </footer>
</body>
</html>`;
  }
};