// 模板管理器
import techIntro from '../templates/tech_intro.js';
import newsBroad from '../templates/news_broad.js';
import techInterpre from '../templates/tech_interpre.js';
import general from '../templates/general.js';
import videoInterpre from '../templates/video_interpre.js';

// 默认模板名称
const DEFAULT_TEMPLATE = 'general';

// 可用模板列表
const templates = {
  tech_intro: techIntro,
  news_broad: newsBroad,
  tech_interpre: techInterpre,
  general: general,
  video_interpre: videoInterpre
};

/**
 * 模板管理器类
 */
export class TemplateManager {
  /**
   * 获取所有可用模板的信息
   * @returns {Array} 模板信息数组
   */
  static getAvailableTemplates() {
    return Object.values(templates).map(template => ({
      name: template.name,
      displayName: template.displayName,
      description: template.description
    }));
  }

  /**
   * 根据名称获取模板
   * @param {string} templateName 模板名称
   * @returns {Object} 模板对象
   */
  static getTemplate(templateName) {
    console.log(`getTemplate: 尝试获取模板 "${templateName}"`);
    
    // 检查请求的模板是否存在，如果不存在使用默认模板
    let template = templates[templateName];
    
    if (!template) {
      console.log(`getTemplate: 模板 "${templateName}" 不存在，尝试使用默认模板 "${DEFAULT_TEMPLATE}"`);
      template = templates[DEFAULT_TEMPLATE];
    }
    
    // 如果找不到默认模板，抛出错误
    if (!template) {
      const error = new Error(`模板系统错误：找不到默认模板 "${DEFAULT_TEMPLATE}"`);
      console.error(error);
      throw error;
    }
    
    // 验证模板是否有render方法
    if (typeof template.render !== 'function') {
      console.error(`模板系统错误: 模板 "${templateName || DEFAULT_TEMPLATE}" 没有render方法`, template);
      // 返回一个有默认render方法的模板
      return {
        name: templateName || DEFAULT_TEMPLATE,
        displayName: '默认模板',
        description: '系统自动生成的默认模板',
        styles: 'body { font-family: sans-serif; padding: 20px; }',
        render: function(title, content) {
          return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title || '未命名文档'}</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 20px; }
    h1 { color: #333; }
    .error { color: red; font-style: italic; }
  </style>
</head>
<body>
  <h1>${title || '未命名文档'}</h1>
  <div>${content}</div>
  <p class="error">注意: 使用了降级模板渲染 (原模板不可用)</p>
</body>
</html>`;
        }
      };
    }
    
    console.log(`getTemplate: 成功获取模板 "${templateName || DEFAULT_TEMPLATE}"`);
    return template;
  }

  /**
   * 使用指定模板渲染内容
   * @param {string} templateName 模板名称
   * @param {string} title 标题
   * @param {string} content HTML 内容
   * @returns {string} 完整的 HTML 页面
   */
  static render(templateName, title, content) {
    try {
      console.log(`render: 开始渲染模板 "${templateName}" 标题: "${title?.substring(0, 30)}..."`);
      
      const template = this.getTemplate(templateName);
      
      if (!template || typeof template.render !== 'function') {
        throw new Error(`模板 "${templateName}" 不存在或没有render方法`);
      }
      
      const result = template.render(title, content);
      console.log(`render: 模板渲染成功`);
      return result;
    } catch (error) {
      console.error(`render: 渲染模板出错`, error);
      
      // 降级处理 - 使用极简模板
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title || '渲染错误'}</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 20px; }
    h1 { color: #333; }
    .error { color: red; font-style: italic; }
    pre { background: #f1f1f1; padding: 10px; border-radius: 4px; overflow: auto; }
  </style>
</head>
<body>
  <h1>${title || '渲染错误'}</h1>
  <p class="error">模板渲染出错: ${error.message}</p>
  <div>${content}</div>
  <details>
    <summary>错误详情</summary>
    <pre>${error.stack}</pre>
  </details>
</body>
</html>`;
    }
  }
  
  /**
   * 验证模板名称是否有效
   * @param {string} templateName 模板名称
   * @returns {boolean} 是否是有效的模板名称
   */
  static isValidTemplate(templateName) {
    console.log(`检查模板 "${templateName}" 是否有效`);
    
    // 首先检查模板是否存在
    const exists = templates.hasOwnProperty(templateName);
    
    if (!exists) {
      console.log(`模板 "${templateName}" 不存在`);
      return false;
    }
    
    // 再检查是否有render方法
    const template = templates[templateName];
    const hasRender = template && typeof template.render === 'function';
    
    console.log(`模板 "${templateName}" ${hasRender ? '有效' : '无效(缺少render方法)'}`);
    return hasRender;
  }
}