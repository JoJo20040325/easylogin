// store/auth.js
import { defineStore } from "pinia";
import { ref, computed, shallowRef } from 'vue';
import api from "@/utils/api";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  // 状态
  const user = shallowRef(null);
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const lastRefresh = ref(null);
  const refreshInterval = ref(null);
  const accessTokenExpiryTime = ref(null);
  const refreshTokenExpiryTime = ref(null);

  // 计算属性
  const isAuthenticated = computed(() => !!accessToken.value);
  const isInitialized = computed(() => user.value !== null && accessToken.value !== null);
  const userEmail = computed(() => user.value?.email);
  const userName = computed(() => user.value?.username);

  // 方法
  async function initializeAuth() {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedRefreshToken && !isAuthenticated.value) {
      refreshToken.value = storedRefreshToken;
      try {
        await fetchTokenTimes();
        await refreshAccessToken();
        await fetchUser();
        startRefreshInterval();
        return true;
      } catch (error) {
        console.error("认证初始化失败:", error);
        logout();
        return false;
      }
    }
    return isAuthenticated.value;
  }

  async function login(username, password) {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      setTokens(data.accessToken, data.refreshToken);
      await fetchTokenTimes();
      await fetchUser();
      startRefreshInterval();
    } catch (error) {
      clearTokens();
      throw error;
    }
  }

  async function register(username, email, password) {
    await api.post("/auth/register", { username, email, password });
  }

  async function refreshAccessToken() {
    try {
      const { data } = await api.post("/auth/refresh", {
        refreshToken: refreshToken.value,
      });
      accessToken.value = data.accessToken;
      lastRefresh.value = new Date().toISOString();
    } catch (error) {
      logout();
      throw error;
    }
  }

  async function fetchUser() {
    const { data } = await api.get("/user/profile");
    user.value = data;
  }

  async function fetchTokenTimes() {
    try {
      const { data } = await api.get("/auth/token-times");
      accessTokenExpiryTime.value = data.accessTokenExpiryTime;
      refreshTokenExpiryTime.value = data.refreshTokenExpiryTime;
    } catch (error) {
      console.error("获取token过期时间失败:", error);
    }
  }

  async function updateProfile(userData) {
    const { data } = await api.put("/user/profile", userData);
    if (data.user) {
      user.value = { ...user.value, ...data.user };
    }
    return data;
  }

  async function changePassword(oldPassword, newPassword) {
    await api.post("/user/change-password", { oldPassword, newPassword });
  }

  async function deleteAccount() {
    await api.delete("/user/account");
    logout();
  }

  async function forgotPassword(email) {
    await api.post("/auth/forgot-password", { email });
  }

  async function resetPassword(token, newPassword) {
    await api.post("/auth/reset-password", { token, newPassword });
  }

  function setTokens(newAccessToken, newRefreshToken) {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    lastRefresh.value = new Date().toISOString();
    localStorage.setItem("refreshToken", newRefreshToken);
  }

  async function updateTokenTimes(newAccessTokenTime, newRefreshTokenTime) {
    const { data } = await api.post("/auth/update-token-times", {
      accessTokenTime: newAccessTokenTime,
      refreshTokenTime: newRefreshTokenTime,
    });
    setTokens(data.accessToken, data.refreshToken);
    accessTokenExpiryTime.value = newAccessTokenTime;
    refreshTokenExpiryTime.value = newRefreshTokenTime;
    updateRefreshInterval();
    return data;
  }

  async function getTokenTimes() {
    const { data } = await api.get("/auth/token-times");
    accessTokenExpiryTime.value = data.accessTokenExpiryTime;
    refreshTokenExpiryTime.value = data.refreshTokenExpiryTime;
    return data;
  }

  function clearTokens() {
    accessToken.value = null;
    refreshToken.value = null;
    lastRefresh.value = null;
    localStorage.removeItem("refreshToken");
    stopRefreshInterval();
  }

  function logout() {
    clearTokens();
    user.value = null;
    router.push({ name: "Login" });
  }

  function startRefreshInterval() {
    stopRefreshInterval();
    const refreshTime = parseTime(accessTokenExpiryTime.value);
    refreshInterval.value = setInterval(() => refreshAccessToken(), refreshTime);
  }

  function stopRefreshInterval() {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value);
      refreshInterval.value = null;
    }
  }

  function updateRefreshInterval() {
    startRefreshInterval();
  }

  function parseTime(timeString) {
    const num = parseInt(timeString);
    const unit = timeString.slice(-1).toLowerCase();
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return num * (multipliers[unit] || 1000);
  }

  return {
    user,
    accessToken,
    refreshToken,
    lastRefresh,
    refreshInterval,
    accessTokenExpiryTime,
    refreshTokenExpiryTime,
    isAuthenticated,
    isInitialized,
    userEmail,
    userName,
    initializeAuth,
    login,
    register,
    refreshAccessToken,
    fetchUser,
    fetchTokenTimes,
    updateProfile,
    changePassword,
    deleteAccount,
    forgotPassword,
    resetPassword,
    setTokens,
    updateTokenTimes,
    getTokenTimes,
    clearTokens,
    logout,
    startRefreshInterval,
    stopRefreshInterval,
    updateRefreshInterval,
    parseTime
  };
});