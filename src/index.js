import { marked } from 'marked';
import { TemplateManager } from './templateManager.js';
import { callDifyWorkflow } from './difyIntegration.js';
import { callDifyArticleWorkflow } from './difyIntegrationArticle.js';

// 配置 marked 选项
marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
  smartypants: true
});

// 模板定义 - 通用模板
const GENERAL_TEMPLATE = {
  name: 'general',
  displayName: '通用',
  description: '适用于各种场景的通用模板',
  styles: `
    :root {
      --primary-color: #3b82f6;
      --primary-light: #60a5fa;
      --primary-dark: #2563eb;
      --text-color: #1e293b;
      --text-light: #64748b;
      --bg-color: #f8fafc;
      --bg-card: #ffffff;
      --border-color: #e2e8f0;
      --code-bg: #f1f5f9;
      --code-color: #db2777;
      --blockquote-bg: #f1f5f9;
      --blockquote-border: #3b82f6;
      --max-width: 800px;
    }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      line-height: 1.75;
      padding: 0;
      margin: 0;
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    
    .container {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 30px 20px;
    }
    
    main { 
      background-color: var(--bg-card);
      padding: 40px 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      width: 100%;
      box-sizing: border-box;
    }
    
    h1 { 
      font-size: 32px;
      font-weight: 700;
      color: var(--primary-dark);
      margin-top: 0;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid var(--primary-light);
      text-align: center;
    }
    
    h2 {
      font-size: 24px;
      color: var(--primary-dark);
      margin-top: 40px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-color);
      position: relative;
    }
    
    h2::before {
      content: "";
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 80px;
      height: 3px;
      background-color: var(--primary-color);
      border-radius: 3px;
    }
    
    h3 {
      font-size: 20px;
      color: var(--text-color);
      margin-top: 30px;
      margin-bottom: 15px;
      position: relative;
      padding-left: 15px;
    }
    
    h3::before {
      content: "";
      position: absolute;
      left: 0;
      top: 5px;
      bottom: 5px;
      width: 4px;
      background-color: var(--primary-light);
      border-radius: 4px;
    }
    
    p {
      margin-bottom: 20px;
      line-height: 1.8;
    }
    
    code { 
      background-color: var(--code-bg);
      padding: 3px 6px;
      border-radius: 4px;
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
      color: var(--code-color);
    }
    
    pre { 
      background-color: #1e293b;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 25px 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      color: #e2e8f0;
      font-size: 0.95em;
      line-height: 1.5;
    }
    
    blockquote { 
      background-color: var(--blockquote-bg);
      border-left: 5px solid var(--blockquote-border);
      padding: 20px;
      margin: 25px 0;
      color: var(--text-color);
      border-radius: 0 8px 8px 0;
      font-style: italic;
    }
    
    blockquote > *:last-child {
      margin-bottom: 0;
    }
    
    ul, ol {
      padding-left: 25px;
      margin-bottom: 25px;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    li > ul, li > ol {
      margin-top: 8px;
      margin-bottom: 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    th {
      background-color: var(--primary-light);
      color: white;
      font-weight: 600;
      padding: 12px 15px;
      text-align: left;
    }
    
    td {
      padding: 10px 15px;
      border-bottom: 1px solid var(--border-color);
    }
    
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    a {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
      display: block;
    }
    
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: var(--text-light);
      padding: 20px 0;
      border-top: 1px solid var(--border-color);
    }
    
    @media (max-width: 768px) {
      main {
        padding: 25px 20px;
      }
      
      h1 {
        font-size: 28px;
      }
      
      h2 {
        font-size: 22px;
      }
      
      h3 {
        font-size: 18px;
      }
    }
  `,
  render: function(title, content) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || '渲染的Markdown'}</title>
    <style>${this.styles}</style>
</head>
<body>
    <div class="container">
      <main>${content}</main>
      <footer>
          <p><small>由 Markdown 渲染服务生成 · 通用模板</small></p>
      </footer>
    </div>
</body>
</html>`;
  }
};

// 模板定义 - 技术介绍模板
const TECH_INTRO_TEMPLATE = {
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
    
    code { 
      background-color: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.9em;
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
    
    blockquote { 
      background-color: #dbeafe;
      border-left: 5px solid #3b82f6;
      padding: 15px;
      margin-left: 0;
      margin-right: 0;
      color: #1e40af;
      border-radius: 0 6px 6px 0;
    }
    
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
  `,
  render: function(title, content) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || '技术介绍'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
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

// 模板定义 - 新闻广播模板
const NEWS_BROAD_TEMPLATE = {
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
    
    p {
      margin-bottom: 20px;
      font-size: 17px;
    }
    
    blockquote { 
      background-color: #f3f4f6;
      border-left: 5px solid #9ca3af;
      padding: 15px 20px;
      margin: 25px 0;
      font-style: italic;
      color: #4b5563;
    }
    
    .dateline {
      font-weight: 700;
      color: #6b7280;
      margin-bottom: 20px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
  `,
  render: function(title, content) {
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
    <title>${title || '新闻播报'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
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

// 模板定义 - 技术解释模板
const TECH_INTERPRE_TEMPLATE = {
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
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      width: 100%;
      box-sizing: border-box;
    }
    
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
    
    code { 
      background-color: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.9em;
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
    
    blockquote { 
      background-color: #eef2ff;
      border-left: 5px solid #6366f1;
      padding: 20px;
      margin: 25px 0;
      color: #4338ca;
      border-radius: 8px;
    }
    
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
  `,
  render: function(title, content) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || '技术解释'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
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

// 模板定义 - 视频解释模板
const VIDEO_INTERPRE_TEMPLATE = {
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
    
    p {
      margin-bottom: 20px;
    }
    
    .timestamp {
      display: inline-block;
      background-color: #334155;
      color: #f8fafc;
      padding: 2px 8px;
      border-radius: 4px;
      margin-right: 8px;
      font-size: 0.9em;
    }
    
    code { 
      background-color: #334155;
      padding: 3px 6px;
      border-radius: 4px;
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
    
    blockquote { 
      background-color: #334155;
      border-left: 4px solid #3b82f6;
      padding: 15px 20px;
      margin: 25px 0;
      color: #e2e8f0;
    }
    
    .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      max-width: 100%;
      background-color: #0f172a;
      margin: 30px 0;
      border-radius: 8px;
    }
    
    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #94a3b8;
    }
  `,
  render: function(title, content) {
    // 处理时间戳标记，例如 @[00:15:30]
    const processedContent = content.replace(/@\[(\d{2}:\d{2}(?::\d{2})?)\]/g, (match, time) => {
      return `<span class="timestamp">${time}</span>`;
    });
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || '视频解释'}</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Noto+Sans+SC:wght@400;700&display=swap" rel="stylesheet">
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

// 内联模板管理器
const Templates = {
  templates: {
    'general': GENERAL_TEMPLATE,
    'tech_intro': TECH_INTRO_TEMPLATE,
    'news_broad': NEWS_BROAD_TEMPLATE,
    'tech_interpre': TECH_INTERPRE_TEMPLATE,
    'video_interpre': VIDEO_INTERPRE_TEMPLATE
  },
  
  getAvailableTemplates() {
    return Object.values(this.templates).map(tpl => ({
      name: tpl.name,
      displayName: tpl.displayName,
      description: tpl.description
    }));
  },
  
  isValidTemplate(name) {
    return !!this.templates[name];
  },
  
  render(templateName, title, content) {
    const template = this.templates[templateName] || this.templates.general;
    return template.render(title, content);
  }
};

// 随机ID生成，用于为上传的 Markdown 文档分配唯一标识符
function generateRandomId(length = 16) {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 主要的 Worker 处理函数
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS头设置
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-Template, X-Title'
        };

        // 处理OPTIONS请求（预检请求）
        if (method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders,
                status: 204
            });
        }

        try {
            // 路由处理
            // 0. 处理favicon请求
            if (path === '/favicon.ico') {
                return new Response(null, { status: 204 });
            }
            
            // 1. 状态检查 API
            if (path === '/status' && method === 'GET') {
                return new Response(JSON.stringify({
                    status: 'ok',
                    message: 'Worker 运行正常',
                    templates: TemplateManager.getAvailableTemplates()
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    status: 200,
                });
            }

            // 2. 获取模板列表
            if (path === '/templates' && method === 'GET') {
                return new Response(JSON.stringify({
                    success: true,
                    templates: TemplateManager.getAvailableTemplates()
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    },
                    status: 200,
                });
            }

            // 3. Markdown 上传 API
            if (path === '/upload' && method === 'POST') {
                // 验证 API 密钥
                const apiKey = request.headers.get('X-API-Key');
                
                if (!apiKey) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: '未提供 API 密钥。请在请求头中包含 X-API-Key。'
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 401,
                    });
                }
                
                if (apiKey !== env.API_KEY) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: 'API 密钥无效。'
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 403,
                    });
                }

                // 处理上传的内容
                let content = '';
                let template = 'general'; // 默认模板
                let title = ''; // 默认标题
                
                const contentType = request.headers.get('Content-Type') || '';
                
                if (contentType.includes('application/json')) {
                    // JSON格式上传
                    const jsonData = await request.json();
                    content = jsonData.content || '';
                    template = jsonData.template || template;
                    title = jsonData.title || '';
                } else {
                    // 纯文本格式上传
                    content = await request.text();
                    // 从请求头获取模板和标题
                    const headerTemplate = request.headers.get('X-Template');
                    const headerTitle = request.headers.get('X-Title');
                    if (headerTemplate) template = headerTemplate;
                    if (headerTitle) title = headerTitle;
                }
                
                // 检查内容是否为空
                if (!content.trim()) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: 'Markdown 内容不能为空。'
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 400,
                    });
                }

                // 检查模板是否有效
                if (!TemplateManager.isValidTemplate(template)) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: `模板 "${template}" 不存在。可用模板: ${TemplateManager.getAvailableTemplates().map(t => t.name).join(', ')}`
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 400,
                    });
                }

                // 内容验证 - 添加内容大小限制检查
                const contentSizeInBytes = new TextEncoder().encode(content).length;
                const MAX_CONTENT_SIZE = 25 * 1024 * 1024; // 25MB
                
                if (contentSizeInBytes > MAX_CONTENT_SIZE) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: `内容大小超过限制，最大允许25MB，当前大小约 ${(contentSizeInBytes / 1024 / 1024).toFixed(2)}MB。`
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 413, // Payload Too Large
                    });
                }

                // 生成唯一ID并保存内容
                const id = generateRandomId();
                
                // 保存到KV存储
                await env.MARKDOWN_KV.put(id, JSON.stringify({
                    content,
                    template,
                    title,
                    createdAt: new Date().toISOString()
                }));
                
                // 返回成功响应
                const viewUrl = `${url.origin}/view/${id}`;
        return new Response(JSON.stringify({
            success: true,
            message: 'Markdown 上传成功。',
                    id,
                    url: viewUrl,
                    template
                }), {
                    headers: { 
                        'Content-Type': 'application/json',
                        ...corsHeaders 
                    },
                    status: 201,
                });
            }

            // 4. 查看渲染后的内容
            if (path.startsWith('/view/') && method === 'GET') {
                const id = path.replace('/view/', '');
                
                // 从KV存储获取内容
                const storedItem = await env.MARKDOWN_KV.get(id);
                
                if (!storedItem) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: '未找到内容。可能指定了无效的ID，或者内容已被删除。'
                    }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 404,
                    });
                }

                const parsedItem = JSON.parse(storedItem);
                const markdownContent = parsedItem.content;
                
                // 将Markdown转换为HTML
        const htmlContent = marked(markdownContent);

                // 获取查询参数，允许覆盖模板和标题
                const queryParams = url.searchParams;
                const templateOverride = queryParams.get('template');
                const titleOverride = queryParams.get('title');
                
                // 确定要使用的模板和标题
                const templateName = templateOverride || parsedItem.template || 'general';
                const titleToUse = titleOverride || parsedItem.title || '';
                
                // 使用模板渲染HTML
                try {
                    const finalHtml = TemplateManager.render(templateName, titleToUse, htmlContent);
                    
                    // 检查Accept头，决定返回HTML还是JSON
                    const acceptHeader = request.headers.get('Accept') || '';
                    const wantsJson = acceptHeader.includes('application/json');
                    
                    if (wantsJson) {
                        // 返回JSON格式的内容
                        return new Response(JSON.stringify({
                            success: true,
                            id,
                            template: templateName,
                            title: titleToUse,
                            html: finalHtml
                        }), {
                            headers: { 
                                'Content-Type': 'application/json',
                                ...corsHeaders
                            },
                            status: 200,
                        });
                    } else {
                        // 返回HTML内容，供浏览器直接渲染
                        return new Response(finalHtml, {
                            headers: { 
                                'Content-Type': 'text/html;charset=UTF-8',
                                ...corsHeaders
                            },
                            status: 200,
                        });
                    }
                } catch (error) {
                    console.error('渲染模板时出错:', error);
                    return new Response(JSON.stringify({
                        success: false,
                        message: `渲染内容时出错: ${error.message}`
                    }), { 
                        headers: { 
                            'Content-Type': 'application/json',
                            ...corsHeaders 
                        },
                        status: 500,
                    });
                }
            }

            // 5. 静态文件处理
            if (path === '/' || path === '/index.html') {
                const indexHtml = await env.ASSETS.get('index.html');
                if (indexHtml) {
                    const content = await indexHtml.text();
                    return new Response(content, {
                        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
                        status: 200,
                    });
                }
            }
            
            if (path === '/styles.css') {
                const css = await env.ASSETS.get('styles.css');
                if (css) {
                    const content = await css.text();
                    return new Response(content, {
                        headers: { 'Content-Type': 'text/css;charset=UTF-8' },
                        status: 200,
                    });
                }
            }
            
            if (path === '/script.js') {
                const js = await env.ASSETS.get('script.js');
                if (js) {
                    const content = await js.text();
                    return new Response(content, {
                        headers: { 'Content-Type': 'application/javascript;charset=UTF-8' },
                        status: 200,
                    });
                }
            }
            
            // 添加处理测试页面的路由
            if (path === '/test-article.html') {
                console.log('尝试获取 test-article.html');
                try {
                    const testHtml = await env.ASSETS.get('test-article.html');
                    console.log('获取结果:', testHtml ? '找到文件' : '文件不存在');
                    
                    if (testHtml) {
                        const content = await testHtml.text();
                        return new Response(content, {
                            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
                            status: 200,
                        });
                    } else {
                        // 明确的错误处理
                        return new Response('未找到test-article.html文件', {
                            status: 404,
                            headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
                        });
                    }
                } catch (error) {
                    console.error('获取test-article.html时出错:', error);
                    return new Response(`获取test-article.html时出错: ${error.message}`, {
                        status: 500,
                        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
                    });
                }
            }

            // 处理Dify原始工作流调用
            if (path === '/api/dify/generate' && request.method === 'POST') {
                try {
                    const { url } = await request.json();
                    
                    // 强制从环境变量获取原始工作流的API Key
                    const apiKey = env.DIFY_API_KEY;

                    if (!apiKey) {
                        console.error('服务器错误: 环境变量 DIFY_API_KEY 未设置');
                        return new Response(JSON.stringify({
                            success: false,
                            message: '服务器配置错误，无法处理请求' // 不暴露密钥问题给前端
                        }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            }
                        });
                    }
                    
                    if (!url) {
                        return new Response(JSON.stringify({
                            success: false,
                            message: '请求体中缺少url字段'
                        }), {
                            status: 400,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            }
                        }); 
                    }

                    console.log(`处理URL生成请求: ${url}, 使用 DIFY_API_KEY`);
                    const result = await callDifyWorkflow(url, apiKey);
                    
                    return new Response(JSON.stringify({
                        success: true,
                        content: result.answer
                    }), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                } catch (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: error.message
                    }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
            }

            // 处理Dify文章生成工作流调用（流式响应）
            if (path === '/api/dify/generateArticle' && request.method === 'GET') {
                const url = new URL(request.url);
                const apiKey = env.DIFY_ARTICLE_API_KEY || url.searchParams.get('apiKey');
                const title = url.searchParams.get('title');
                const style = url.searchParams.get('style') || '';
                const context = url.searchParams.get('context') || '';
                
                console.log('接收文章生成请求:', title, style ? `风格: ${style}` : '');
                
                if (!apiKey) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: '未提供API密钥'
                    }), {
                        status: 401,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                
                if (!title) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: '请提供文章标题'
                    }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                
                try {
                    // 创建一个TransformStream来处理流式响应
                    const { readable, writable } = new TransformStream();
                    const writer = writable.getWriter();
                    
                    // 定义事件发送函数
                    const sendEvent = (data) => {
                        writer.write(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                    };
                    
                    // 定义回调函数
                    const callbacks = {
                        onStart: () => {
                            sendEvent({ status: '正在开始生成...' });
                        },
                        onProgress: (status, data) => {
                            // 检查data是否存在并且有content属性
                            if (data && data.content) {
                                sendEvent({ 
                                    status: status, 
                                    content: data.content,
                                    result: data.content  // 同时通过result字段发送
                                });
                            } else if (data && data.result) {  // 新增：处理result字段
                                sendEvent({ 
                                    status: status, 
                                    content: data.result,
                                    result: data.result
                                });
                            } else {
                                // 如果没有content或result，只发送status
                                sendEvent({ status: status });
                            }
                        },
                        onComplete: (result) => {
                            sendEvent({ 
                                status: '生成完成', 
                                content: result,
                                result: result,  // 同时通过result字段发送
                                done: true
                            });
                            sendEvent('[DONE]');
                            writer.close();
                        },
                        onError: (error) => {
                            sendEvent({ 
                                error: error.message || '生成过程中发生错误'
                            });
                            sendEvent('[DONE]');
                            writer.close();
                        }
                    };
                    
                    // 准备输入参数
                    const inputs = {
                        prompt: title,
                        style: style,
                        context: context || `生成关于${title}的高质量文章内容`
                    };
                    
                    // 异步调用Dify文章生成API
                    callDifyArticleWorkflow(inputs, apiKey, callbacks).catch(error => {
                        console.error('调用文章生成工作流时出错:', error);
                        // 错误会被onError回调处理
                    });
                    
                    // 返回SSE响应
                    return new Response(readable, {
                        headers: {
                            'Content-Type': 'text/event-stream',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                    
                } catch (error) {
                    return new Response(JSON.stringify({
                        success: false,
                        message: error.message
                    }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
            }

            // 6. 处理404
            return new Response(JSON.stringify({
                success: false,
                message: '未找到请求的资源。'
            }), { 
                headers: { 
                    'Content-Type': 'application/json',
                    ...corsHeaders 
                },
                status: 404,
            });
        } catch (error) {
            // 错误处理
            console.error('处理请求时发生错误:', error);
            return new Response(JSON.stringify({
                success: false,
                message: `服务器错误: ${error.message}`,
                error: {
                    type: error.name,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                }
            }), {
                headers: { 
                    'Content-Type': 'application/json',
                    ...corsHeaders 
                },
                status: 500,
            });
        }
    },
};