import { api } from './auth';

export interface ReportGenerateRequest {
  title: string;
  start_date: string;
  end_date: string;
}

export interface Report {
  id: number;
  title: string;
  report_link: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const generateReport = async (data: ReportGenerateRequest) => {
  const response = await api.post<{ message: string; report_id: number }>(
    '/api/generate-report',
    data
  );
  return response.data;
};

export const getReport = async (reportId: number) => {
  const response = await api.get<Report>(
    `/api/get-report/${reportId}`
  );
  return response.data;
};

export const listReports = async (page: number = 1, perPage: number = 10) => {
  const response = await api.get<PaginatedResponse<Report>>(
    '/api/list-reports',
    {
      params: {
        page,
        per_page: perPage
      }
    }
  );
  return response.data;
};