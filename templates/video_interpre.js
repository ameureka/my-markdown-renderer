// 视频解释模板
export default {
  name: 'video_interpre',
  displayName: '视频解释',
  description: '用于视频内容的讲解和说明',
  styles: `
    body { 
      font-family: 'Nunito', 'Noto Sans SC', sans-serif;
      line-height: 1.7;
      padding: 20px;
      max-width: 100%;
      margin: auto;
      background-color: #0f172a;
      color: #e2e8f0;
    }
    
    main { 
      background-color: #1e293b;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
      width: 100%;
      box-sizing: border-box;
    }
    
    /* 视频讲解专用标题样式 */
    h1 { 
      font-size: 32px;
      font-weight: 700;
      color: #f8fafc;
      margin-top: 10px;
      margin-bottom: 30px;
      text-align: center;
      background: linear-gradient(90deg, #3b82f6, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    h2 {
      font-size: 24px;
      color: #f8fafc;
      margin-top: 40px;
      margin-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 10px;
    }
    
    h3 {
      font-size: 20px;
      color: #e2e8f0;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    
    /* 段落样式 */
    p {
      margin-bottom: 20px;
    }
    
    /* 时间戳样式 */
    .timestamp {
      display: inline-block;
      background-color: #334155;
      color: #f8fafc;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      margin-right: 8px;
      font-size: 0.9em;
    }
    
    /* 代码样式 */
    code { 
      background-color: #334155;
      padding: 3px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9em;
      color: #a5b4fc;
    }
    
    pre { 
      background-color: #334155;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      border: 1px solid #475569;
      margin: 25px 0;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
    }
    
    /* 亮点和重点内容 */
    blockquote { 
      background-color: #334155;
      border-left: 4px solid #3b82f6;
      padding: 15px 20px;
      margin: 25px 0;
      color: #e2e8f0;
    }
    
    blockquote p:last-child {
      margin-bottom: 0;
    }
    
    /* 链接样式 */
    a { 
      color: #3b82f6;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    a:hover { 
      color: #60a5fa;
      text-decoration: underline;
    }
    
    /* 视频元素样式 */
    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9宽高比 */
      height: 0;
      overflow: hidden;
      max-width: 100%;
      background-color: #0f172a;
      margin: 30px 0;
      border-radius: 8px;
    }
    
    .video-container iframe,
    .video-container video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      border: none;
    }
    
    /* 图片样式 */
    img {
      max-width: 100%;
      border-radius: 8px;
      margin: 20px auto;
      display: block;
    }
    
    /* 章节导航 */
    .chapter-nav {
      background-color: #334155;
      padding: 15px;
      border-radius: 8px;
      margin: 30px 0;
    }
    
    .chapter-nav h4 {
      margin-top: 0;
      color: #f8fafc;
      border-bottom: 1px solid #475569;
      padding-bottom: 8px;
    }
    
    .chapter-nav ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    .chapter-nav li {
      margin-bottom: 10px;
    }
    
    .chapter-nav a {
      display: block;
      padding: 6px 10px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .chapter-nav a:hover {
      background-color: #475569;
      text-decoration: none;
    }
    
    /* 响应式设计 */
    @media (min-width: 768px) {
      body {
        max-width: 800px;
      }
      
      main {
        padding: 40px;
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
      
      pre {
        padding: 15px;
      }
    }
    
    /* 页脚样式 */
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #94a3b8;
    }
  `,
  template: function(title, content) {
    // 自动添加视频嵌入功能 (如果发现视频URL)
    // 这里只是一个简单示例，实际实现会根据Markdown内容中的视频链接格式进行
    let processedContent = content;
    
    // 提取并处理内容中类似 !video[...](URL) 的模式
    const videoPattern = /!video\[(.*?)\]\((https?:\/\/.*?)\)/g;
    processedContent = processedContent.replace(videoPattern, (match, alt, url) => {
      return `<div class="video-container">
        <iframe src="${url}" title="${alt}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p style="text-align: center; margin-top: -10px; color: #94a3b8;"><em>${alt}</em></p>`;
    });
    
    // 处理时间戳标记，例如 @[00:15:30]
    const timestampPattern = /@\[(\d{2}:\d{2}(?::\d{2})?)\]/g;
    processedContent = processedContent.replace(timestampPattern, (match, time) => {
      return `<span class="timestamp">${time}</span>`;
    });
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=JetBrains+Mono&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    <style>${this.styles}</style>
</head>
<body>
    <main>${processedContent}</main>
    <footer>
        <hr>
        <p><small>由 Markdown 渲染服务生成 · 视频解释模板</small></p>
    </footer>
</body>
</html>`;
  }
};