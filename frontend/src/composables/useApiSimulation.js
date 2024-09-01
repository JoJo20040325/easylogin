/**
 * API 调用模拟钩子
 * @param {Object} api - API 实例
 * @param {Ref<Array>} apiCallLogs - API 调用日志引用
 * @param {Object} toast - Toast 通知实例
 * @returns {Object} 包含模拟 API 调用方法的对象
 */
export function useApiSimulation(api, apiCallLogs, toast) {
  /**
   * 模拟 API 调用
   */
  const simulateApiCall = async () => {
    try {
      await api.get('/user/profile');
      addLog(true, 'API 调用成功');
    } catch (error) {
      addLog(false, `API 调用失败: ${error.message}`);
      toast.error('API 调用失败');
    }
  };

  /**
   * 添加日志
   * @param {boolean} success - 调用是否成功
   * @param {string} message - 日志消息
   */
  const addLog = (success, message) => {
    apiCallLogs.value.unshift({
      id: Date.now(),
      success,
      message,
      timestamp: new Date(),
    });

    // 保持日志数量不超过 50 条
    apiCallLogs.value = apiCallLogs.value.slice(0, 50);
  };

  return { simulateApiCall };
}
