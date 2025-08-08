import type { DataProvider } from "@refinedev/core";
import { API_URL } from "../../config/config";
import { api } from "./api";
import qs from "qs";

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id }) => {
    const { data } = await api.get(`/${resource}/${id}`);
    return data;
  },

  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const query = qs.stringify({ filters, sorters, meta, pagination }, { arrayFormat: "indices" });

    const { data } = await api.get(`/${resource}/?${query}`);
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
