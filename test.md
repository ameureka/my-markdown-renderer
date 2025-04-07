# 核心概念

1. **Cloudflare Worker:** 运行在 Cloudflare 全球边缘网络上的 JavaScript 函数，用于拦截和处理 HTTP 请求。
2. **Cloudflare KV:** 一个全球分布、低延迟的键值数据库。

## 详细操作步骤

这是一个**粗体文本**，这是*斜体文本*。

### 代码示例

```javascript
console.log("这是一段代码示例");
const x = 10;
```


npx wrangler dev --local


# 上传前端静态资源到模拟的R2存储
npx wrangler r2 object put markdown-renderer-assets-dev/index.html --file ./public/index.html --content-type "text/html"
npx wrangler r2 object put markdown-renderer-assets-dev/styles.css --file ./public/styles.css --content-type "text/css"
npx wrangler r2 object put markdown-renderer-assets-dev/script.js --file ./public/script.js --content-type "application/javascript"