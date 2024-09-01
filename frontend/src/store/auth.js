/**
 * store/auth.js
 * 这个文件定义了认证相关的 Pinia store，管理用户认证状态和相关操作。
 */

import { defineStore } from "pinia";
import api from "@/utils/api";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    lastRefresh:null,
    refreshInterval: null,
    accessTokenExpiryTime: null,
    refreshTokenExpiryTime: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isInitialized: (state) => state.user !== null && state.accessToken !== null,
    userEmail: (state) => state.user?.email,
    userName: (state) => state.user?.username,
  },

  actions: {
    // 初始化认证状态
    async initializeAuth() {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken && !this.isAuthenticated) {
        this.refreshToken = refreshToken;
        try {
          await this.fetchTokenTimes();
          await this.refreshAccessToken();
          await this.fetchUser();
          this.startRefreshInterval();
          return true;
        } catch (error) {
          console.error("认证初始化失败:", error);
          this.logout();
          return false;
        }
      }
      return this.isAuthenticated;
    },

    // 用户登录
    async login(username, password) {
      try {
        const { data } = await api.post("/auth/login", { username, password });
        this.setTokens(data.accessToken, data.refreshToken);
        await this.fetchTokenTimes();
        await this.fetchUser();
        this.startRefreshInterval();
      } catch (error) {
        this.clearTokens();
        throw error;
      }
    },

    // 用户注册
    async register(username, email, password) {
      await api.post("/auth/register", { username, email, password });
    },

    // 刷新访问令牌
    async refreshAccessToken() {
      try {
        const { data } = await api.post("/auth/refresh", {
          refreshToken: this.refreshToken,
        });
        this.setTokens(data.accessToken, data.refreshToken);
        this.lastRefresh = new Date().toISOString();
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    // 获取用户信息
    async fetchUser() {
      const { data } = await api.get("/user/profile");
      this.user = data;
    },

    // 获取令牌过期时间
    async fetchTokenTimes() {
      try {
        const { data } = await api.get("/auth/token-times");
        this.accessTokenExpiryTime = data.accessTokenExpiryTime;
        this.refreshTokenExpiryTime = data.refreshTokenExpiryTime;
      } catch (error) {
        console.error("获取token过期时间失败:", error);
      }
    },

    // 更新用户资料
    async updateProfile(userData) {
      const { data } = await api.put("/user/profile", userData);
      if (data.user) {
        this.user = { ...this.user, ...data.user };
      }
      return data;
    },

    // 更改密码
    async changePassword(oldPassword, newPassword) {
      await api.post("/user/change-password", { oldPassword, newPassword });
    },

    // 删除账户
    async deleteAccount() {
      await api.delete("/user/account");
      this.logout();
    },

    // 忘记密码
    async forgotPassword(email) {
      await api.post("/auth/forgot-password", { email });
    },

    // 重置密码
    async resetPassword(token, newPassword) {
      await api.post("/auth/reset-password", { token, newPassword });
    },

    // 设置令牌
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.lastRefresh = new Date().toISOString();
      localStorage.setItem("refreshToken", refreshToken);
    },

    // 更新令牌过期时间
    async updateTokenTimes(accessTokenTime, refreshTokenTime) {
      const { data } = await api.post("/auth/update-token-times", {
        accessTokenTime,
        refreshTokenTime,
      });
      this.setTokens(data.accessToken, data.refreshToken);
      this.accessTokenExpiryTime = accessTokenTime;
      this.refreshTokenExpiryTime = refreshTokenTime;
      this.updateRefreshInterval();
      return data;
    },

    // 获取令牌过期时间
    async getTokenTimes() {
      const { data } = await api.get("/auth/token-times");
      this.accessTokenExpiryTime = data.accessTokenExpiryTime;
      this.refreshTokenExpiryTime = data.refreshTokenExpiryTime;
      return data;
    },
    
    // 清除令牌
    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      this.lastRefresh = null,
      localStorage.removeItem("refreshToken");
      this.stopRefreshInterval();
    },

    // 用户登出
    logout() {
      this.clearTokens();
      this.user = null;
      router.push({ name: "Login" });
    },

    // 开始令牌刷新定时器
    startRefreshInterval() {
      this.stopRefreshInterval();
      const refreshTime = this.parseTime(this.accessTokenExpiryTime);
      this.refreshInterval = setInterval(
        () => this.refreshAccessToken(),
        refreshTime
      );
    },

    // 停止令牌刷新定时器
    stopRefreshInterval() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },

    // 更新令牌刷新定时器
    updateRefreshInterval() {
      this.startRefreshInterval();
    },

    // 解析时间字符串
    parseTime(timeString) {
      const num = parseInt(timeString);
      const unit = timeString.slice(-1).toLowerCase();
      const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
      return num * (multipliers[unit] || 1000);
    },
  },
});
