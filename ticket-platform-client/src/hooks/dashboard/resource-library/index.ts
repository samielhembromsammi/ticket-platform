import { useCallback, useEffect, useState } from "react";
import useApi from "../../use-api";
import { IApiResponse, IResourceItem, IResourceLibraryData } from "./interface";
import { message } from "antd";

export function useResourceLibrary(initialCategory: string = "All") {
  const [resources, setResources] = useState<IResourceItem[]>([]);
  const [singleResource, setSingleResource] = useState<IResourceItem | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    category: initialCategory,
    search: "",
  });


  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { page, limit, category, search } = query;

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));

      if (category && category !== "All") {
        params.append("category", category);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await useApi.get<
        IApiResponse<IResourceLibraryData>
      >(`/resource-library/all?${params.toString()}`);

      setResources(response?.data?.data?.results || []);
      setTotal(response?.data?.data?.meta?.totalResult || 0);
    } catch (err: any) {
      setError(err.message || "Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  }, [query]);


  const getSingleResource = async (id: string) => {
    try {
      setLoading(true);
      const response = await useApi.get<
        IApiResponse<IResourceItem>
      >(`/resource-library/find/${id}`);

      setSingleResource(response?.data?.data || null);
      return response?.data?.data;
    } catch (err: any) {
      message.error(err.message || "Failed to fetch resource");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createResource = async (payload: FormData | object) => {
    try {
      setLoading(true);

      const response = await useApi.post(
        `/resource-library/create`,
        payload
      );

      message.success("Resource created successfully");
      fetchResources();
      return response?.data;
    } catch (err: any) {
      message.error(err.message || "Failed to create resource");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResource = async (id: string, payload: FormData | object) => {
    try {
      setLoading(true);

      const response = await useApi.patch(
        `/resource-library/update/${id}`,
        payload
      );

      message.success("Resource updated successfully");
      fetchResources();
      return response?.data;
    } catch (err: any) {
      message.error(err.message || "Failed to update resource");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const deleteResource = async (id: string) => {
    try {
      setLoading(true);

      await useApi.delete(`/resource-library/delete/${id}`);

      message.success("Resource deleted successfully");

      setResources(prev => prev.filter(item => item._id !== id));

      fetchResources();
    } catch (err: any) {
      message.error(err.message || "Failed to delete resource");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    resources,
    singleResource,
    total,
    loading,
    error,
    query,
    setQuery,

    // actions
    refetch: fetchResources,
    getSingleResource,
    createResource,
    updateResource,
    deleteResource,
  };
}
