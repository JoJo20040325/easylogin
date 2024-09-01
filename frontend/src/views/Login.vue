<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <NavBar />
    <div class="mt-16 flex flex-grow items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录您的账户
        </h2>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/layout/NavBar.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
</script>