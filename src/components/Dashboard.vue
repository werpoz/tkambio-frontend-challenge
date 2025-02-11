<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchUserData as fetchUser, logout } from '../services/auth'
import type { User } from '../types/user';
import ReportButton from './ReportButton.vue'
import ReportList from './ReportList.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const router = useRouter()
const user = ref<User>()
const error = ref('')

const fetchUserData = async () => {
  try {
    const v = await fetchUser();
    console.log(v)
    user.value = await fetchUser()
  } catch (e: any) {
    error.value = 'Error fetching user data'
    if (e.response?.status === 401) {
      router.push('/login')
    }
  }
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (e: any) {
    error.value = 'Error during logout'
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="shadow-sm" style="background: linear-gradient(to right, #02ADF1, #4562E6, #4563E6);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 h-16 items-center">
          <div class="col-start-1 justify-self-center">
            <h1 class="text-xl font-bold text-gray-900">
              <img src="../assets/tkcambio.svg">
            </h1>
          </div>
          <div class="col-start-3 justify-self-end" v-if="user">
            <DropdownMenu>
              <DropdownMenuTrigger class="text-white hover:text-gray-200">
                {{ user.name }}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="handleLogout">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md p-8">
        <div v-if="error" class="mb-4 text-center text-red-600">
          {{ error }}
        </div>
        <div v-if="user" class="space-y-6">
          <h2 class="text-3xl font-bold text-center text-gray-900">Welcome, {{ user?.name }}!</h2>
          <div class="bg-gray-50 p-6 rounded-lg">
            <p class="text-gray-700"><span class="font-semibold">Email:</span> {{ user?.email }}</p>
          </div>
          <ReportList />
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <ReportButton />
      </div>
      </div>
    </div>
  </div>
</template>