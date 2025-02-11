<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { login, isAuthenticated } from "../services/auth";
import Button from "./ui/button/Button.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");

onMounted(() => {
  if (isAuthenticated()) {
    router.push("/dashboard");
  }
});

const handleLogin = async () => {
  try {
    await login(email.value, password.value);
    router.push("/dashboard");
  } catch (e: any) {
    console.log(e);
    error.value = e.response?.data?.message || "An error occurred during login";
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 class="text-center text-3xl font-extrabold text-gray-900 mb-8">Login</h2>
        </div>
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              autocomplete="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              autocomplete="current-password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div v-if="error" class="text-sm text-red-600 mt-2">
          {{ error }}
        </div>
        <Button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Login
        </Button>
      </form>
    </div>
  </div>
</template>
