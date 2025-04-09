// Dify工作流集成模块
const DIFY_API_URL = 'https://api.dify.ai/v1';

/**
 * 调用Dify工作流API
 * @param {string} url - 要处理的URL
 * @param {string} apiKey - Dify API密钥
 * @returns {Promise<{answer: string}>} - 返回生成的内容
 */
export async function callDifyWorkflow(url, apiKey) {
  const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      inputs: { url },
      response_mode: "blocking",
      user: "markdown-renderer"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Dify API responded with status ${response.status}`;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage += `: ${errorData.message || errorText}`;
    } catch (e) {
      errorMessage += `: ${errorText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // 提取内容，处理可能的嵌套结构
  let answer = null;
  
  if (data.answer) {
    answer = data.answer;
  } else if (data.data?.outputs?.text) {
    answer = data.data.outputs.text;
  } else if (data.data?.outputs?.output) {
    answer = data.data.outputs.output;
  } else if (data.outputs?.output) {
    answer = data.outputs.output;
  } else if (data.outputs?.text) {
    answer = data.outputs.text;
  } else if (typeof data.output === 'string') {
    answer = data.output;
  } else if (typeof data.text === 'string') {
    answer = data.text;
  }
  
  return { answer: answer || '无法获取生成内容' };
}