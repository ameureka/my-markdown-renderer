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
    // 检查请求的模板是否存在，如果不存在使用默认模板
    const template = templates[templateName] || templates[DEFAULT_TEMPLATE];
    
    // 如果找不到默认模板，抛出错误
    if (!template) {
      throw new Error(`模板系统错误：找不到默认模板 "${DEFAULT_TEMPLATE}"`);
    }
    
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
    const template = this.getTemplate(templateName);
    return template.template(title, content);
  }
  
  /**
   * 验证模板名称是否有效
   * @param {string} templateName 模板名称
   * @returns {boolean} 是否是有效的模板名称
   */
  static isValidTemplate(templateName) {
    return templates.hasOwnProperty(templateName);
  }
}