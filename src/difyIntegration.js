// Dify工作流集成模块
const DIFY_API_URL = 'https://api.dify.ai/v1';

/**
 * 调用Dify工作流API (URL生成，阻塞模式)
 * @param {string} url - 要处理的URL
 * @param {string} apiKey - Dify API密钥
 * @param {number} maxRetries - 最大重试次数
 * @param {number} timeoutMs - 请求超时时间 (毫秒)
 * @returns {Promise<{answer: string}>} - 返回生成的内容
 */
export async function callDifyWorkflow(url, apiKey, maxRetries = 2, timeoutMs = 60000) { // 默认1分钟超时
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      console.log(`调用Dify URL工作流API (尝试 ${retryCount + 1}/${maxRetries + 1})，URL: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: { url},
          response_mode: "blocking",
          user: "url-renderer"
        }),
        signal: controller.signal // 添加超时控制
      });

      clearTimeout(timeoutId); // 清除超时计时器

      if (!response.ok) {
        const errorText = await response.text();
        const status = response.status;
        let errorMessage = `Dify API responded with status ${status}`;
        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
          errorMessage += `: ${parsedError.message || errorText}`;
        } catch (e) {
          errorMessage += `: ${errorText}`;
        }
        console.error(`API响应错误 (${status}):`, errorMessage, parsedError || errorText);

        // 针对特定错误进行重试 (例如: 502, 504 网关错误, 429 速率限制)
        if ((status === 502 || status === 504 || status === 429) && retryCount < maxRetries) {
          retryCount++;
          const waitTime = 1500 * Math.pow(2, retryCount - 1); // 指数退避
          console.log(`错误 ${status}，将在 ${waitTime / 1000} 秒后重试...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue; // 继续下一次循环尝试
        }
        
        // 对于其他不可重试错误或达到最大重试次数，直接抛出
        throw new Error(errorMessage);
      }

      // 成功响应
      const data = await response.json();
      console.log("Dify URL工作流API调用成功，收到响应。");
      console.log("完整响应数据:", JSON.stringify(data));

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

    } catch (error) {
      clearTimeout(timeoutId); // 捕获错误时也清除超时

      // 如果是 AbortError (超时)
      if (error.name === 'AbortError') {
          console.error(`Dify API请求超时 (${timeoutMs}ms)`);
          if (retryCount < maxRetries) {
              retryCount++;
              console.log(`请求超时，将在 2 秒后重试...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue; // 继续下一次循环尝试
          } else {
              throw new Error(`Dify API请求在 ${maxRetries + 1} 次尝试后均超时 (${timeoutMs}ms)`);
          }
      } 
      // 其他网络错误或不可重试的 API 错误
      else {
          console.error('调用Dify URL工作流出错:', error.message);
          if (retryCount < maxRetries) {
              retryCount++;
              const waitTime = 1500 * Math.pow(2, retryCount - 1);
              console.log(`网络或未知错误，将在 ${waitTime / 1000} 秒后重试...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue; // 继续下一次循环尝试
          } else {
              // 达到最大重试次数，抛出最终错误
              throw new Error(`调用Dify URL工作流失败，经过 ${maxRetries + 1} 次尝试后仍然出错: ${error.message}`);
          }
      }
    }
  }
  // 如果循环结束仍未成功（理论上不应发生，因为错误会抛出）
  throw new Error(`调用Dify URL工作流最终失败 (重试 ${maxRetries} 次后)`);
}