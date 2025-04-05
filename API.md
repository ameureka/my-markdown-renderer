# Markdown 渲染服务 API 使用说明

这个文档提供了 Markdown 渲染服务的 API 详细使用说明。

## API 概览

| 端点 | 方法 | 描述 | 认证要求 |
|------|------|------|----------|
| `/status` | GET | 获取服务状态及可用模板 | 否 |
| `/templates` | GET | 获取所有可用模板列表 | 否 |
| `/upload` | POST | 上传 Markdown 内容 | 是 (API 密钥) |
| `/view/{id}` | GET | 查看渲染后的 Markdown | 否 |

## 认证方式

本服务使用 API 密钥进行认证，只有上传端点需要认证。

在请求头中添加 `X-API-Key` 字段：

```
X-API-Key: your-api-key
```

## 跨域请求支持 (CORS)

所有API端点均支持跨域请求，包括：
- 允许来自任何源的请求 (`Access-Control-Allow-Origin: *`)
- 支持 `OPTIONS` 预检请求
- 允许 `GET`, `POST`, `OPTIONS` 方法
- 允许 `Content-Type`, `X-API-Key`, `X-Template`, `X-Title` 头部

## 响应格式

除了渲染内容的HTML响应外，所有API端点返回的响应均为JSON格式。成功响应格式：

```json
{
  "success": true,
  "message": "操作成功消息",
  // 其他数据...
}
```

错误响应格式：

```json
{
  "success": false,
  "message": "错误描述信息",
  // 可能包含其他错误详情...
}
```

## 端点详细说明

### 1. 状态检查

**端点**: `/status`  
**方法**: GET  
**认证**: 不需要  
**描述**: 检查服务是否正常运行，并返回可用模板信息。

**响应示例**:
```json
{
  "status": "ok",
  "message": "Worker 运行正常",
  "templates": [
    {
      "name": "general",
      "displayName": "通用",
      "description": "适用于各种场景的通用模板"
    },
    {
      "name": "tech_intro",
      "displayName": "技术介绍",
      "description": "用于技术产品、工具或框架的介绍"
    },
    ...
  ]
}
```

**使用示例**:
```bash
curl https://my-markdown-renderer.lynnwongchina.workers.dev/status
```

### 2. 获取模板列表

**端点**: `/templates`  
**方法**: GET  
**认证**: 不需要  
**描述**: 获取所有可用的渲染模板信息。

**响应示例**:
```json
{
  "success": true,
  "templates": [
    {
      "name": "general",
      "displayName": "通用",
      "description": "适用于各种场景的通用模板"
    },
    ...
  ]
}
```

**使用示例**:
```bash
curl https://my-markdown-renderer.lynnwongchina.workers.dev/templates
```

### 3. 上传 Markdown 内容

**端点**: `/upload`  
**方法**: POST  
**认证**: 需要 (X-API-Key)  
**描述**: 上传 Markdown 内容，并返回用于查看渲染内容的唯一链接。

**内容大小限制**: 最大支持 25MB

**支持两种上传方式**:

#### 3.1 JSON 格式上传

**Content-Type**: `application/json`

**请求参数**:
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| content | string | 是 | Markdown 内容 |
| template | string | 否 | 模板名称 (默认: "general") |
| title | string | 否 | 页面标题 |

**请求示例**:
```json
{
  "content": "# 这是标题\n\n这是正文内容，支持 **Markdown** 格式。",
  "template": "tech_intro",
  "title": "自定义页面标题"
}
```

**使用示例**:
```bash
curl -X POST https://my-markdown-renderer.lynnwongchina.workers.dev/upload \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "content": "# 这是标题\n\n这是正文内容，支持 **Markdown** 格式。",
    "template": "tech_intro",
    "title": "自定义页面标题"
  }'
```

#### 3.2 纯文本格式上传

**Content-Type**: `text/plain` 或省略

**请求头参数**:
| 请求头 | 必填 | 描述 |
|--------|------|------|
| X-API-Key | 是 | API密钥 |
| X-Template | 否 | 模板名称 (默认: "general") |
| X-Title | 否 | 页面标题 |

**请求体**: 纯文本 Markdown 内容

**使用示例**:
```bash
curl -X POST https://my-markdown-renderer.lynnwongchina.workers.dev/upload \
  -H "Content-Type: text/plain; charset=utf-8" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "X-Template: news_broad" \
  -H "X-Title: 新闻标题" \
  --data-binary @your-markdown-file.md
```

**响应示例** (成功):
```json
{
  "success": true,
  "message": "Markdown 上传成功。",
  "id": "ae380945b72a359a",
  "url": "https://my-markdown-renderer.lynnwongchina.workers.dev/view/ae380945b72a359a",
  "template": "tech_intro"
}
```

**错误码**:
- 400: 错误请求 (内容为空或模板无效)
- 401: 未认证 (缺少API密钥)
- 403: 禁止访问 (API密钥无效)
- 413: 请求实体太大 (内容超过25MB限制)
- 500: 服务器内部错误

### 4. 查看渲染内容

**端点**: `/view/{id}`  
**方法**: GET  
**认证**: 不需要  
**描述**: 查看指定 ID 的 Markdown 内容渲染后的 HTML 页面。

**URL 参数**:
| 参数 | 必填 | 描述 |
|------|------|------|
| id | 是 | 内容标识符 (在上传响应中获取) |

**查询参数**:
| 参数 | 必填 | 描述 |
|------|------|------|
| template | 否 | 覆盖存储的模板 |
| title | 否 | 覆盖存储的标题 |

**响应格式**:
- 默认返回HTML格式 (浏览器访问)
- 如果请求头包含 `Accept: application/json`，则返回JSON格式，包含HTML内容

**使用示例** (获取HTML):
```
https://my-markdown-renderer.lynnwongchina.workers.dev/view/ae380945b72a359a?template=video_interpre&title=新标题
```

**使用示例** (获取JSON):
```bash
curl -H "Accept: application/json" https://my-markdown-renderer.lynnwongchina.workers.dev/view/ae380945b72a359a
```

**JSON响应示例**:
```json
{
  "success": true,
  "id": "ae380945b72a359a",
  "template": "general",
  "title": "文档标题",
  "html": "<!DOCTYPE html>..."
}
```

**错误码**:
- 404: 未找到 (ID 无效或内容已删除)
- 500: 服务器内部错误 (渲染失败)

## 支持的模板

服务目前支持以下五种渲染模板:

1. **general** (通用) - 适用于各种场景的基础样式
2. **tech_intro** (技术介绍) - 适用于技术产品、工具或框架的介绍
3. **news_broad** (新闻广播) - 适用于新闻、公告和实时信息发布
4. **tech_interpre** (技术解释) - 适用于深入解释技术概念和原理
5. **video_interpre** (视频解释) - 专为视频内容的讲解和说明设计

## 特殊功能

不同模板支持特殊功能:

1. **news_broad** (新闻广播):
   - 自动生成日期时间戳

2. **video_interpre** (视频解释):
   - 时间戳标记: 使用 `@[00:15:30]` 格式标记视频时间点

## 错误处理

所有错误响应均为统一的JSON格式:

```json
{
  "success": false,
  "message": "错误描述信息"
}
```

严重错误可能包含额外信息 (仅在开发环境):
```json
{
  "success": false,
  "message": "服务器错误描述",
  "error": {
    "type": "错误类型",
    "stack": "错误堆栈..."
  }
}
```

## 使用限制

- 最大 Markdown 内容大小: 25MB
- API 请求速率限制: 每分钟 100 次请求

## 示例应用

### 创建内容并获取链接

```javascript
async function createContent() {
  const response = await fetch('https://my-markdown-renderer.lynnwongchina.workers.dev/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'YOUR_API_KEY'
    },
    body: JSON.stringify({
      content: '# Hello World\n\nThis is a test.',
      template: 'tech_intro',
      title: 'Test Page'
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log(`创建成功! 链接: ${result.url}`);
    return result.url;
  } else {
    throw new Error(`创建失败: ${result.message}`);
  }
}
```