import type { DataProvider } from "@refinedev/core";
import { api } from "./api";
import { API_URL } from "@/config";

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

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    const { data } = await api.request({
      url,
      method: method?.toUpperCase(),
      params: {
        filters,
        sorters,
        ...query,
      },
      data: payload,
      headers,
    });

    return {
      data,
    };
  },
};
