<template>
  <div class="bg-white">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <router-link to="/" class="flex items-center space-x-2">
            <img class="h-8 w-auto" src="../assets/logo.svg" alt="logo" />
            <span class="text-xl font-bold tracking-tight text-gray-800">EasyLogin</span>
          </router-link>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <a href="#features" class="text-sm font-semibold leading-6 text-gray-900">功能</a>
          <a href="#tutorial" class="text-sm font-semibold leading-6 text-gray-900">使用教程</a>
          <a href="#about" class="text-sm font-semibold leading-6 text-gray-900">关于我们</a>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <router-link to="/login" class="text-sm font-semibold leading-6 text-gray-900">登录 <span
              aria-hidden="true">&rarr;</span></router-link>
        </div>
      </nav>
    </header>

    <main>
      <!-- Hero section -->
      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              安全可靠的身份认证系统
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              我们的系统提供了强大的用户认证功能，包括登录、注册、自动令牌刷新等，为您的应用保驾护航。
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <router-link to="/login"
                class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">开始使用</router-link>
              <a href="#features" class="text-sm font-semibold leading-6 text-gray-900">了解更多 <span
                  aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </div>

      <!-- Features section -->
      <div id="features" class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base font-semibold leading-7 text-indigo-600">
              强大功能
            </h2>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              一切您需要的认证功能
            </p>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              我们的系统提供了全面的用户认证解决方案，确保您的应用安全可靠。
            </p>
          </div>
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div
                    class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                  </div>
                  安全登录
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  使用最新的加密技术确保用户登录的安全性，保护用户的敏感信息。
                </dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div
                    class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  自动令牌刷新
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  无缝刷新认证令牌，确保用户始终保持登录状态，提供流畅的用户体验。
                </dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div
                    class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </div>
                  用户注册
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  简单直观的用户注册流程，支持电子邮件验证，确保用户信息的真实性。
                </dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div
                    class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                    </svg>
                  </div>
                  安全退出
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600">
                  一键安全退出，清除所有会话信息，保护用户的账户安全。
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Tutorial section -->
      <div id="tutorial" class="bg-gray-50 py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base font-semibold leading-7 text-indigo-600">
              使用教程
            </h2>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              快速上手指南
            </p>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              按照以下步骤，轻松集成我们的认证系统到您的应用中。
            </p>
          </div>
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <ol class="space-y-8">
              <li class="flex gap-x-3">
                <span
                  class="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">1</span>
                <div>
                  <h3 class="font-semibold text-gray-900">注册账户</h3>
                  <p class="mt-2 text-gray-600">
                    点击右上角的"注册"按钮，填写必要信息创建您的账户。
                  </p>
                </div>
              </li>
              <li class="flex gap-x-3">
                <span
                  class="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">2</span>
                <div>
                  <h3 class="font-semibold text-gray-900">登录系统</h3>
                  <p class="mt-2 text-gray-600">
                    使用您的用户名和密码登录系统，体验全面的功能。
                  </p>
                </div>
              </li>
              <li class="flex gap-x-3">
                <span
                  class="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">3</span>
                <div>
                  <h3 class="font-semibold text-gray-900">探索仪表板</h3>
                  <p class="mt-2 text-gray-600">
                    登录后，您将进入仪表板界面，这里展示了认证状态和其他重要信息。
                  </p>
                </div>
              </li>
              <li class="flex gap-x-3">
                <span
                  class="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">4</span>
                <div>
                  <h3 class="font-semibold text-gray-900">体验自动令牌刷新</h3>
                  <p class="mt-2 text-gray-600">
                    停留在仪表板页面，观察系统如何自动刷新认证令牌，保持您的登录状态。
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- About section -->
      <div id="about" class="bg-white py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base font-semibold leading-7 text-indigo-600">
              关于我们
            </h2>
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              专注于提供最佳的认证解决方案
            </p>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              一个热爱技术、追求卓越的人，致力于为开发者提供最安全、最便捷的身份认证系统。
            </p>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" class="sr-only">Footer</h2>
      <div class="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div class="mt-8 border-t border-gray-900/10 pt-8 md:flex md:items-center md:justify-between">
          <div class="flex space-x-6 md:order-2">
            <!-- 这里可以添加社交媒体链接 -->
          </div>
          <p class="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
            &copy; 2024 EasyLogin, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
