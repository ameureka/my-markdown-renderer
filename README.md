# Markdown渲染服务 - 综合说明文档
**当前版本**: 0.4.1

## 1. 项目概述

Markdown渲染服务是一个基于Cloudflare Workers的云端应用，能够将Markdown内容转换为精美的HTML页面，支持多种排版模板，并提供美观的前端界面供用户使用。它支持API调用和在线编辑两种使用方式。

**版本更新**:
- 版本0.4.1：完善前端优化设计
- 计划中的版本：增加内容改写功能选项

### 1.1 主要功能

- ✅ Markdown转HTML渲染
- ✅ 5种精美排版模板支持
- ✅ 安全的API密钥验证
- ✅ 云端存储和链接分享
- ✅ 响应式的前端界面
- ✅ 亮色/暗色主题切换

## 2. 项目结构

```
my-markdown-renderer/
├── src/                  # 后端源代码
│   ├── index.js          # 主应用入口和路由处理
│   └── templateManager.js # 模板管理模块
├── public/               # 前端静态资源
│   ├── index.html        # 前端主页
│   ├── styles.css        # 样式表
│   └── script.js         # 客户端脚本
├── templates/            # 渲染模板
│   ├── general.js        # 通用模板
│   ├── tech_intro.js     # 技术介绍模板
│   ├── news_broad.js     # 新闻广播模板
│   ├── tech_interpre.js  # 技术解读模板
│   └── video_interpre.js # 视频讲解模板
├── test/                 # 测试文件
├── wrangler.toml         # Cloudflare Workers配置
├── deploy.sh             # 部署脚本
├── API.md                # API详细文档
└── README.md             # 项目说明
```

## 3. API使用详解

### 3.1 认证方式

所有涉及写操作的API端点需要通过API密钥进行认证：

```
X-API-Key: your-api-key
```

### 3.2 主要API端点

#### 3.2.1 状态检查

```bash
curl https://my-markdown-renderer.lynnwongchina.workers.dev/status
```

返回服务状态和可用模板列表。

#### 3.2.2 获取模板列表

```bash
curl https://my-markdown-renderer.lynnwongchina.workers.dev/templates
```

返回所有可用渲染模板的名称、显示名和描述。

#### 3.2.3 上传Markdown内容

**JSON格式上传：**

```bash
curl -X POST https://my-markdown-renderer.lynnwongchina.workers.dev/upload \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "content": "# 这是标题\n\n这是正文，支持**加粗**和*斜体*。",
    "template": "general",
    "title": "我的文章标题"
  }'
```

**纯文本上传：**

```bash
curl -X POST https://my-markdown-renderer.lynnwongchina.workers.dev/upload \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "X-Template: tech_intro" \
  -H "X-Title: 技术文档" \
  --data-binary @yourfile.md
```

**成功响应：**

```json
{
  "success": true,
  "message": "Markdown 上传成功。",
  "id": "unique-id",
  "url": "https://my-markdown-renderer.lynnwongchina.workers.dev/view/unique-id",
  "template": "general"
}
```

#### 3.2.4 查看渲染内容

访问上传后返回的URL查看渲染结果：

```
https://my-markdown-renderer.lynnwongchina.workers.dev/view/unique-id
```

支持通过查询参数覆盖模板和标题：

```
https://my-markdown-renderer.lynnwongchina.workers.dev/view/unique-id?template=news_broad&title=新标题
```

## 4. 模板使用指南

### 4.1 可用模板列表

1. **通用模板(general)**
   - 适用于各种场景的基本模板
   - 简洁大方的布局和配色

2. **技术介绍模板(tech_intro)**
   - 适合产品和技术介绍
   - 包含代码高亮和技术风格

3. **新闻广播模板(news_broad)**
   - 适合公告和通知
   - 自动生成日期时间戳

4. **技术解读模板(tech_interpre)**
   - 适合深度技术文章
   - 优化的代码显示和技术术语呈现

5. **视频讲解模板(video_interpre)**
   - 专为视频教程文字版设计
   - 支持时间戳标记：`@[00:15:30]`格式

### 4.2 特殊语法支持

除了标准Markdown语法外，部分模板支持额外功能：

- **视频讲解模板**：时间戳标记
  ```markdown
  @[00:05:30] 第一章节开始
  内容...
  
  @[00:12:45] 第二章节开始
  更多内容...
  ```

## 5. 开发与部署

### 5.1 本地开发

1. 克隆仓库并安装依赖：
   ```bash
   git clone https://github.com/yourusername/my-markdown-renderer.git
   cd my-markdown-renderer
   npm install
   ```

2. 配置本地环境变量：
   创建`.dev.vars`文件：
   ```
   API_KEY=your_local_test_key
   ```

3. 启动本地开发服务器：
   ```bash
   wrangler dev
   ```

### 5.2 部署到Cloudflare Workers

1. 设置API密钥：
   ```bash
   wrangler secret put API_KEY
   ```

2. 上传静态资源到R2存储桶：
   ```bash
   # 使用deploy.sh脚本自动上传资源
   ./deploy.sh
   ```
   
   或手动上传：
   ```bash
   # 创建R2存储桶（如果尚未创建）
   wrangler r2 bucket create markdown-renderer-assets
   
   # 上传静态资源
   wrangler r2 object put markdown-renderer-assets/index.html --file ./public/index.html --content-type "text/html"
   wrangler r2 object put markdown-renderer-assets/styles.css --file ./public/styles.css --content-type "text/css"
   wrangler r2 object put markdown-renderer-assets/script.js --file ./public/script.js --content-type "application/javascript"
   ```

3. 部署Worker：
   ```bash
   wrangler deploy
   ```

部署后，您的服务将在 https://my-markdown-renderer.lynnwongchina.workers.dev 上线，支持所有5种模板和完整的API功能。

## 6. 前端界面使用

服务提供了美观的前端界面，可通过浏览器访问：
https://my-markdown-renderer.lynnwongchina.workers.dev

### 使用步骤：

1. 输入您的API密钥
2. 选择排版模板
3. 输入文章标题（可选）
4. 粘贴或编写Markdown内容
5. 点击"生成排版"按钮
6. 获取生成的永久链接

前端界面支持以下功能：
- 粘贴剪贴板内容
- 插入示例内容
- 预览生成的页面
- 复制生成的链接
- 切换暗色/亮色主题

## 7. 使用限制

- 最大Markdown内容大小：25MB
- API请求速率：每分钟100次请求

## 8. 许可证

MIT