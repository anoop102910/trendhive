import type { DataProvider } from "@refinedev/core";
import { API_URL } from "../../config/config";
import { api } from "./api";

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id }) => {
    const { data } = await api.get(`/${resource}/${id}`);
    return data;
  },

  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const { data } = await api.get(`/${resource}`, {
      params: {
        pagination,
        sorters,
        filters,
        meta,
      },
    });
    return data;
  },

  create: async ({ resource, variables }) => {
    const { data } = await api.post(`/${resource}`, variables);
    return { data, success: true };
  },

  update: async ({ resource, id, variables }) => {
    const { data } = await api.put(`/${resource}/${id}`, variables);
    return { data, success: true };
  },

  deleteOne: async ({ resource, id }) => {
    const { data } = await api.delete(`/${resource}/${id}`);
    return { data, success: true };
  },

  getApiUrl: () => API_URL,
};
