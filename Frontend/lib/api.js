import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((e) => e.message).join(", ");
  }
  if (error.message === "Network Error") {
    return "Unable to reach the server. Please check that the API is running.";
  }
  return error.message || "Something went wrong. Please try again.";
}

export async function registerUser({ name, email, password }) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export async function getJobs(filters = {}) {
  const params = { page: filters.page || 1, limit: filters.limit || 5 };
  if (filters.category && filters.category !== "All") {
    params.category = filters.category;
  }
  if (filters.status && filters.status !== "All") {
    params.status = filters.status;
  }
  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }
  const { data } = await api.get("/jobs", { params });
  return data;
}

export async function getJob(id) {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
}

export async function createJob(jobData) {
  const { data } = await api.post("/jobs", jobData);
  return data;
}

export async function updateJobStatus(id, status) {
  const { data } = await api.patch(`/jobs/${id}`, { status });
  return data;
}

export async function deleteJob(id) {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
}
