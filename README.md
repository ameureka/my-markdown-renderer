# AI智能创作平台
**当前版本**: 0.8.1

## 1. 项目概述

AI智能创作平台是一个基于Cloudflare Workers的云端应用，集成了AI文章生成和Markdown渲染功能。它不仅能够将Markdown内容转换为精美的HTML页面，还能通过AI技术帮助用户快速创作高质量的文章内容。平台支持多种排版模板，并提供美观的前端界面供用户使用。

**版本更新**:
- 版本0.8.1：修改了UI细节，工作流优化
- 版本0.8.0：添加AI文章创作功能，优化界面设计
- 版本0.4.1：完善前端优化设计
- 计划中的版本：增加更多AI辅助创作功能

### 1.1 主要功能

- ✅ AI智能文章生成
  - 支持自定义标题和风格
  - 支持上下文要求定制
  - 实时生成反馈
- ✅ Markdown转HTML渲染
  - 5种精美排版模板
  - 支持API调用和在线编辑
- ✅ 智能内容处理
  - URL内容智能提取
  - AI优化改写
- ✅ 云端功能
  - 安全的API密钥验证
  - 云端存储和链接分享
- ✅ 用户界面
  - 响应式的前端设计
  - 亮色/暗色主题切换
  - 实时状态反馈

## 2. 项目结构

```
my-markdown-renderer/
├── src/                      # 后端源代码
│   ├── index.js              # 主应用入口和路由处理
│   ├── templateManager.js     # 模板管理模块
│   ├── difyIntegration.js    # Dify API集成模块
│   └── difyIntegrationArticle.js # AI文章生成模块
├── public/                   # 前端静态资源
│   ├── index.html            # 前端主页
│   ├── styles.css            # 样式表
│   └── script.js             # 客户端脚本
├── templates/                # 渲染模板
│   ├── general.js            # 通用模板
│   ├── tech_intro.js         # 技术介绍模板
│   ├── news_broad.js         # 新闻广播模板
│   ├── tech_interpre.js      # 技术解读模板
│   └── video_interpre.js     # 视频讲解模板
├── testapi-v02/             # API测试脚本
│   ├── chinese_api_test.js   # 中文API测试
│   ├── frontend_api_test.js  # 前端API测试
│   └── temp_test_dify.js     # Dify API测试
├── wrangler.toml            # Cloudflare Workers配置
├── deploy.sh                # 部署脚本
├── API.md                   # API详细文档
└── README.md                # 项目说明
```

## 3. AI文章生成功能

### 3.1 功能概述

AI文章生成功能通过集成Dify API，提供智能文章创作服务。用户可以通过简单的输入获得高质量的文章内容。

### 3.2 使用方法

1. **基本步骤**
   - 输入文章标题（必填）
   - 选择文章风格（可选）
   - 提供上下文/要求（可选）
   - 点击"AI生成"按钮

2. **风格选项示例**
   - 简约
   - 专业
   - 活泼
   - 学术
   - 新闻

3. **上下文/要求示例**
   - 面向初学者的技术教程
   - 产品营销文案
   - 深度技术分析
   - 新闻报道风格

### 3.3 最佳实践

- 提供清晰具体的标题
- 添加适当的上下文信息
- 选择合适的文章风格
- 生成后可以进行人工优化

## 4. API使用详解

### 4.1 认证方式

所有涉及写操作的API端点需要通过API密钥进行认证：

```
X-API-Key: your-api-key
```

### 4.2 主要API端点

#### 4.2.1 状态检查

```bash
curl https://my-markdown-renderer.lynnwongchina.workers.dev/status
```

返回服务状态和可用模板列表。

#### 4.2.2 获取模板列表

```bash
curl https://my-markdown-renderer.lynnwongchina.workers.dev/templates
```

返回所有可用渲染模板的名称、显示名和描述。

#### 4.2.3 上传Markdown内容

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

#### 4.2.4 查看渲染内容

访问上传后返回的URL查看渲染结果：

```
https://my-markdown-renderer.lynnwongchina.workers.dev/view/unique-id
```

支持通过查询参数覆盖模板和标题：

```
https://my-markdown-renderer.lynnwongchina.workers.dev/view/unique-id?template=news_broad&title=新标题
```

## 5. 模板使用指南

### 5.1 可用模板列表

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

### 5.2 特殊语法支持

除了标准Markdown语法外，部分模板支持额外功能：

- **视频讲解模板**：时间戳标记
  ```markdown
  @[00:05:30] 第一章节开始
  内容...
  
  @[00:12:45] 第二章节开始
  更多内容...
  ```

## 6. 开发与部署

### 6.1 本地开发

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
   DIFY_API_KEY=your_dify_api_key
   DIFY_ARTICLE_API_KEY=your_dify_article_api_key
   ```

3. 启动本地开发服务器：
   ```bash
   wrangler dev
   ```

### 6.2 部署到Cloudflare Workers

1. 设置环境变量：
   ```bash
   # 设置API密钥
   wrangler secret put API_KEY
   # 设置Dify API密钥
   wrangler secret put DIFY_API_KEY
   # 设置Dify文章生成API密钥
   wrangler secret put DIFY_ARTICLE_API_KEY
   ```

2. 上传静态资源到R2存储桶：
   ```bash
   # 上传HTML文件
   wrangler r2 object put markdown-renderer-assets-new/index.html --file="public/index.html" --remote
   
   # 上传JavaScript文件
   wrangler r2 object put markdown-renderer-assets-new/script.js --file="public/script.js" --remote
   
   # 上传CSS文件
   wrangler r2 object put markdown-renderer-assets-new/styles.css --file="public/styles.css" --remote
   ```
   
   > 注意：必须使用 `--remote` 参数来确保文件被上传到Cloudflare的远程存储桶，而不是本地存储。

3. 部署Worker：
   ```bash
   wrangler deploy
   ```

部署完成后，您的服务将在以下地址上线：
https://my-markdown-renderer.lynnwongchina.workers.dev

### 6.3 部署检查清单

- [ ] 环境变量设置完成
  - [ ] API_KEY
  - [ ] DIFY_API_KEY
  - [ ] DIFY_ARTICLE_API_KEY
- [ ] 静态资源上传完成
  - [ ] index.html
  - [ ] script.js
  - [ ] styles.css
- [ ] Worker部署成功
- [ ] 访问测试通过

## 7. 前端界面使用

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

## 8. 使用限制

- 最大Markdown内容大小：25MB
- API请求速率：每分钟100次请求

## 9. 许可证

MIT