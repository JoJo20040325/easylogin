import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

/**
 * 令牌管理钩子
 * @param {Object} authStore - 认证存储实例
 * @param {Object} toast - Toast 通知实例
 * @returns {Object} 包含令牌管理相关方法和状态的对象
 */
export function useTokenManagement(authStore, toast) {
  const { accessToken, refreshToken, lastRefresh, accessTokenExpiryTime, refreshTokenExpiryTime } = storeToRefs(authStore);

  // 状态定义
  const tokenRefreshLogs = ref([]);
  const apiCallLogs = ref([]);
  const accessTokenTime = ref('15');
  const refreshTokenTime = ref('7');
  const accessTokenUnit = ref('分钟');
  const refreshTokenUnit = ref('天');

  // 计算属性
  const tokenStatus = computed(() => ({
    accessToken: accessToken.value ? '有效' : '无效',
    refreshToken: refreshToken.value ? '有效' : '无效',
    lastRefresh: lastRefresh.value
      ? new Date(lastRefresh.value).toLocaleString()
      : '从未',
  }));

  const dashboardCards = computed(() => [
    {
      title: '访问令牌状态',
      value: tokenStatus.value.accessToken,
      icon: 'key',
    },
    {
      title: '刷新令牌状态',
      value: tokenStatus.value.refreshToken,
      icon: 'refresh-cw',
    },
    {
      title: '上次刷新时间',
      value: tokenStatus.value.lastRefresh,
      icon: 'clock',
    },
    {
      title: 'Access Token 过期时间',
      value: accessTokenTime.value,
      icon: 'clock',
      isEditable: true,
      units: ['秒', '分钟', '小时', '天'],
      selectedUnit: accessTokenUnit.value,
    },
    {
      title: 'Refresh Token 过期时间',
      value: refreshTokenTime.value,
      icon: 'clock',
      isEditable: true,
      units: ['秒', '分钟', '小时', '天'],
      selectedUnit: refreshTokenUnit.value,
    },
  ]);

  // 方法定义
  const updateTokenTime = (title, newValue) => {
    if (title === 'Access Token 过期时间') {
      accessTokenTime.value = newValue;
    } else if (title === 'Refresh Token 过期时间') {
      refreshTokenTime.value = newValue;
    }
  };

  const updateTokenUnit = (title, newUnit) => {
    if (title === 'Access Token 过期时间') {
      accessTokenUnit.value = newUnit;
    } else if (title === 'Refresh Token 过期时间') {
      refreshTokenUnit.value = newUnit;
    }
  };

  const updateTokenTimes = async () => {
    try {
      const unitMap = { 秒: 's', 分钟: 'm', 小时: 'h', 天: 'd' };
      const accessTokenTimeWithUnit = `${accessTokenTime.value}${unitMap[accessTokenUnit.value]}`;
      const refreshTokenTimeWithUnit = `${refreshTokenTime.value}${unitMap[refreshTokenUnit.value]}`;

      await authStore.updateTokenTimes(
        accessTokenTimeWithUnit,
        refreshTokenTimeWithUnit
      );
      toast.success('令牌过期时间已更新');
      await fetchTokenTimes();
    } catch (error) {
      console.error('更新令牌时间失败:', error);
      toast.error('更新令牌时间失败');
    }
  };

  const fetchTokenTimes = async () => {
    try {
      const times = await authStore.getTokenTimes();
      const accessTokenInfo = parseTimeString(times.accessTokenExpiryTime);
      const refreshTokenInfo = parseTimeString(times.refreshTokenExpiryTime);

      accessTokenTime.value = accessTokenInfo.value;
      accessTokenUnit.value = accessTokenInfo.unit;
      refreshTokenTime.value = refreshTokenInfo.value;
      refreshTokenUnit.value = refreshTokenInfo.unit;
    } catch (error) {
      console.error('获取令牌时间失败:', error);
      toast.error('获取令牌时间失败');
    }
  };

  const parseTimeString = (timeString) => {
    const value = parseInt(timeString);
    const unit = timeString.slice(-1).toLowerCase();
    const unitMap = { s: '秒', m: '分钟', h: '小时', d: '天' };
    return { value, unit: unitMap[unit] || '秒' };
  };

  const clearTokenRefreshLogs = () => {
    tokenRefreshLogs.value = [];
  };

  const clearApiCallLogs = () => {
    apiCallLogs.value = [];
  };

  return {
    tokenRefreshLogs,
    apiCallLogs,
    dashboardCards,
    updateTokenTime,
    updateTokenUnit,
    updateTokenTimes,
    fetchTokenTimes,
    clearTokenRefreshLogs,
    clearApiCallLogs,
  };
}