<script setup lang="ts">
import { ref } from 'vue';
import { generateReport } from '../services/report.service';
import Button from './ui/button/Button.vue';

const loading = ref(false);
const error = ref('');
const showModal = ref(false);
const startDate = ref('');
const endDate = ref('');
const reportTitle = ref('');

const openModal = () => {
  showModal.value = true;
  reportTitle.value = `Report ${new Date().toLocaleString()}`;
};

const closeModal = () => {
  showModal.value = false;
};

const handleGenerateReport = async () => {
  if (!startDate.value || !endDate.value || !reportTitle.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  error.value = '';
  
  try {
    const response = await generateReport({
      title: reportTitle.value,
      start_date: startDate.value,
      end_date: endDate.value
    });
    
    console.log('Report generation started:', response);
    closeModal();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to generate report';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <Button
      @click="openModal"
      :disabled="loading"
      class="rounded-full bg-yellow-400 text-black hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors h-[40px] w-min-[200px]"
    >
      <span v-if="loading">Generating...</span>
      <span v-else>Crear Reporte</span>
    </Button>
    
    <p v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </p>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="text-center">
            <h3 class="text-lg font-semibold mb-1">Reporte por fecha de nacimiento</h3>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ingresa los siguientes datos para generar tu reporte</label>
        </div>
      
        <div class="space-y-4 mt-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion del reporte</label>
            <input
              v-model="reportTitle"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter report title"
            />
          </div>

          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
              <input
                v-model="startDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input
                v-model="endDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <Button
            @click="closeModal"
            variant="outline"
            class="rounded-full"
          >
            Cancel
          </Button>
          <Button
            @click="handleGenerateReport"
            :disabled="loading"
            class="rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>