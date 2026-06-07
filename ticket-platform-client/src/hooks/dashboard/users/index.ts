/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import useApi from "./../../use-api/index";
import { UserStatus } from "@/src/types";

interface UserResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface UsersData {
  results: any[];
  total: number;
  pagination: {
    totalResult: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IStatus {
  status: string;
}


interface ProfileResponse<T> {
  data: T;
  message?: string;
}

interface IUserProfile {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profileUrl?: string;
  address?: string;
  role?: string;
  status?: string;
}

export function useUsers(initialRole: string = "User") {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    role: initialRole,
    search: "",
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { page, limit, role, search } = query;
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        role,
        ...(search ? { search } : {}),
      });

      const response = await useApi.get<UserResponse<UsersData>>(
        `/users/all?${params.toString()}`
      );
      setUsers(response?.data?.data?.results || []);
      setTotal(response?.data?.data?.pagination?.totalResult || 0);
    } catch (err: any) {
      // console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, [query]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    total,
    loading,
    error,
    query,
    setQuery,
    refetch: fetchUsers,
  };
}

export function useMyProfile() {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await useApi.get<UserResponse<IUserProfile>>(
        "/users/get-my-profile"
      );
      setProfile(response?.data?.data || null);
    } catch (err: any) {
      // console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}

export function useUpdateUserStatus() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateUserStatus = async (id: string, status: UserStatus) => {
    setLoading(true);
    const payload: IStatus = { status };
    try {
      const response = await useApi.patch<UserResponse<UserStatus>>(
        `/users/${id}/status`,
        payload
      );
      setLoading(false);
      return response?.data;
    } catch (err: any) {
      setLoading(false);
      const message =
        err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      // console.error("Error updating support:", err);
      return null;
    }
  };

  return { updateUserStatus, loading, error };
}




export function useUpdateProfile() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateProfile = async (payload: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await useApi.patch<ProfileResponse<IUserProfile>>(
        `/users/update-my-profile`,
        payload
      );
      setLoading(false);
      return response?.data;
    } catch (err: any) {
      setLoading(false);
      const message =
        err?.response?.data?.message || "An unexpected error occurred.";
      setError(message);
      console.error("Error updating profile:", err);
      return null;
    }
  };

  return { updateProfile, loading, error };
}