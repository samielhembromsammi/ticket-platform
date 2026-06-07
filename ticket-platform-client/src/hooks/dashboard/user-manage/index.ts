import { useCallback, useEffect, useState } from "react";
import useApi from "../../use-api";
import { message } from "antd";
import { IUser, IServiceResponse, IUserResponse } from "./interface";



export function useUserService() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        status: "",
        search: "",
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { page, limit, status, search } = query;

            const params = new URLSearchParams();

            if (page !== 1) params.append("page", String(page));
            if (limit !== 10) params.append("limit", String(limit));
            if (status) params.append("status", status);
            if (search) params.append("search", search);

            const url = `/user/all?${params.toString()}`;

            const response = await useApi.get<IServiceResponse<IUserResponse>>(url);

            setUsers(response?.data?.data?.results || []);
            setTotal(response?.data?.data?.meta?.totalPages || 0);
            setTotalItems(response?.data?.data?.meta?.totalResult || 0);
        } catch (err: any) {
            setError(err.message || "Failed to fetch users");
        } finally {
            setTimeout(() => setLoading(false), 400);
        }
    }, [query]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const deleteUser = async (id: string) => {
        try {
            await useApi.delete(`/user/delete/${id}`);
            message.success("User deleted successfully");
            fetchUsers();
            return true;
        } catch (error: any) {
            message.error(error.message || "Failed to delete user");
            return false;
        }
    };

    return {
        users,
        total,
        totalItems,
        loading,
        error,
        query,
        setQuery,
        refetch: fetchUsers,
        deleteUser
    };
}
