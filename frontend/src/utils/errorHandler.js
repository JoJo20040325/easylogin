/**
 * utils/errorHandler.js
 * 这个文件提供了处理 API 错误的工具函数。
 */

import { useToast } from 'vue-toastification';

const toast = useToast();

/**
 * 处理 API 错误并显示相应的错误消息
 * @param {Error} error - API 请求错误对象
 * @returns {Promise} 返回一个被拒绝的 Promise
 */
export const handleApiError = (error) => {
  if (error.response) {
    const { data } = error.response;
    let errorMessage = data.message;

    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      errorMessage = data.errors.map(err => err.message).join(', ');
    }
    
    toast.error(errorMessage);
  } else if (error.request) {
    toast.error('无法连接到服务器，请检查您的网络连接');
  } else {
    toast.error(error.message || '发生未知错误');
  }
  return Promise.reject(error);
};