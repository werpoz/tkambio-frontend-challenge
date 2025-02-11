<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listReports } from "../services/report.service";
import { api } from "../services/auth";
import type { Report } from "../services/report.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const reports = ref<Report[]>([]);
const currentPage = ref(1);
const perPage = ref(3);
const totalPages = ref(0);
const isLoading = ref(false);

const fetchReports = async () => {
  try {
    isLoading.value = true;
    const response = await listReports(currentPage.value, perPage.value);
    reports.value = response.data;
    totalPages.value = response.last_page;
  } catch (error) {
    console.error("Error fetching reports:", error);
  } finally {
    isLoading.value = false;
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  fetchReports();
};

const downloadReport = async (report: Report) => {
  try {
    const response = await api.get(`/api/get-report/${report.id}`, {
      responseType: "blob",
    });

    // Obtener el nombre del archivo desde Content-Disposition si está disponible
    const contentDisposition = response.headers["content-disposition"];
    let fileName = `Reporte-${report.id}.xlsx`;

    if (contentDisposition) {
      const matches = contentDisposition.match(/filename="(.+)"/);
      if (matches && matches[1]) {
        fileName = matches[1];
      }
    }

    // Crear un Blob con el tipo adecuado
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Crear un enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Liberar la URL del Blob
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading report:", error);
  }
};

onMounted(() => {
  fetchReports();
});
</script>

<template>
  <div class="p-4">
    <div class="rounded-xl overflow-hidden" style="background: linear-gradient(to right, #4562e6, #4563e6)">
      <div v-if="isLoading" class="text-center py-4 text-white">Loading...</div>

      <div v-else>
        <Table class="bg-transparent">
          <TableHeader class="border-b-2">
            <TableRow class="border-none hover:bg-transparent">
              <TableHead class="text-white font-semibold text-center text-lg">Titulo</TableHead>
              <TableHead class="text-white font-semibold text-center text-lg">Fecha de creación</TableHead>
              <TableHead class="text-white font-semibold text-center text-lg">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="border-b-2">
            <TableRow v-for="report in reports" :key="report.id" class="border-none hover:bg-white/5">
              <TableCell class="text-white border-r-2 text-center">{{ report.title }}</TableCell>
              <TableCell class="text-white border-r-2 text-center">{{ new Date(report.created_at).toLocaleDateString() }}</TableCell>
              <TableCell class="text-white text-center text-md">
                <a
                  v-if="report.report_link"
                  href="#"
                  @click.prevent="downloadReport(report)"
                  class="inline-flex items-center px-4 py-2 text-white rounded-md transition-colors font-bold"
                >
                  Descargar Reporte
                  <img src="@/assets/download.svg" class="h-5 w-5 ml-2" alt="Download" />
                </a>
                <span v-else class="text-gray-300">Not available</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Controles de paginación -->
        <div class="flex justify-center gap-2 p-4">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-4 py-2 rounded-md transition-colors',
              currentPage === page ? 'bg-white text-blue-600' : 'bg-transparent text-white border border-white hover:bg-white/10',
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
