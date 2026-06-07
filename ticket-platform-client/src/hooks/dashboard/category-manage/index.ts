import { useCallback, useEffect, useState } from "react";
import useApi from "../../use-api";
import { message } from "antd";

// TypeScript interfaces for your category data
export interface SubCategory {
  _id?: string;
  name: string;
  categoryPhoto: string;
}

export interface Category {
  _id: string;
  primaryCategoryName: string;
  thumbnail: string;
  subCategory?: SubCategory[] | [];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await useApi.get<{ data: Category[] }>("/categories");
      setCategories(data?.data || []);
    } catch (error) {
      // console.error("Error fetching categories:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refetch: fetchCategories };
}

// --- Create Category ---
export function useCreateCategory() {
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(async (payload: FormData) => {
    try {
      const { data } = await useApi.post<{ data: Category }>(
        "/categories",
        payload
      );
      return data.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create category");
      return null;
    }
  }, []);

  return { createCategory, error };
}

// --- Create SubCategory ---
export function useCreateSubCategory() {
  const [error, setError] = useState<string | null>(null);

  const createSubCategory = useCallback(
    async (categoryId: string, payload: FormData) => {
      try {
        const { data } = await useApi.post<{ data: SubCategory }>(
          `/categories/add-sub-category/${categoryId}`,
          payload
        ); 
        return data.data;
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to create subcategory"
        ); 
        return null;
      }
    },
    []
  );

  return { createSubCategory, error };
}

// --- Update Category ---
export function useUpdateCategory() {
  const [error, setError] = useState<string | null>(null);

  const updateCategory = useCallback(
    async (categoryId: string, payload: FormData) => {
      try {
        const { data } = await useApi.patch<{ data: Category }>(
          `/category/update/${categoryId}`,
          payload
        ); 
        return data.data;
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to update category");
        
        return null;
      }
    },
    []
  );

  return { updateCategory, error };
}

// --- Delete Category ---
export function useDeleteCategory() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteCategory = useCallback(
    async (categoryId: string, options?: { subCategoryIds?: string[] }) => {
      try {
        setLoading(true);
        const url =
          options?.subCategoryIds && options.subCategoryIds.length > 0
            ? `/category/delete/${categoryId}?subCategoryIds=${options.subCategoryIds.join(
                ","
              )}`
            : `/category/delete/${categoryId}`;
        const { data } = await useApi.delete<{ data: { success: boolean } }>(
          url
        );

        if (data?.data?.success) {
          message.success("Category deleted successfully.");
          return true;
        }
        setLoading(false);
        setError("Failed to delete category");
        return false;
      } catch (err: any) {
        setLoading(false);
        const msg = err?.response?.data?.message || "Failed to delete category";
        setError(msg);
        message.error(msg);
        return false;
      }
    },
    []
  );

  return { deleteCategory, loading, error };
}
