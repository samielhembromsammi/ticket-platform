import { useCallback, useEffect, useState } from "react";
import useApi from "../../use-api";
import { IApiResponse, ICategory, ICategoryResponse } from "./interface";
import { message, Modal } from "antd";

export function useContentModeration() {
    const [conversations, setConversations] = useState<ICategory[]>([]);
    const [singleConversation, setSingleConversation] = useState<ICategory | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState({ page: 1, limit: 10, search: "" });

    const fetchConversations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { page, limit, search } = query;
            const params = new URLSearchParams();
            params.append("page", String(page));
            params.append("limit", String(limit));
            if (search.trim()) params.append("search", search.trim());

            const response = await useApi.get<IApiResponse<ICategoryResponse>>(
                `/conversation/all?${params.toString()}`
            );

            setConversations(response?.data?.data?.results || []);
            setTotal(response?.data?.data?.meta?.totalResult || 0);
        } catch (err: any) {
            setError(err.message || "Failed to fetch conversations");
        } finally {
            setLoading(false);
        }
    }, [query]);

    const getSingleConversation = async (id: string) => {
        try {
            setLoading(true);
            const response = await useApi.get<IApiResponse<ICategory>>(
                `/conversation/find/${id}`
            );
            setSingleConversation(response?.data?.data || null);
            return response?.data?.data;
        } catch (err: any) {
            message.error(err.message || "Failed to fetch conversation");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createConversation = async (data: FormData | ICategory) => {
        try {
            setLoading(true);

            const response = await useApi.post(`/conversation/create`, data);

            message.success("Conversation created successfully");
            fetchConversations();
            return response?.data;
        } catch (err: any) {
            message.error(err.message || "Failed to create conversation");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateConversation = async (
        id: string,
        data: FormData | Partial<ICategory>
    ) => {
        try {
            setLoading(true);

            const response = await useApi.patch(`/conversation/update/${id}`, data);

            message.success("Conversation updated successfully");
            fetchConversations();
            return response?.data;
        } catch (err: any) {
            message.error(err.message || "Failed to update conversation");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteConversation = (id: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this conversation?",
            okText: "Yes",
            cancelText: "No",
            onOk: async () => {
                try {
                    setLoading(true);
                    await useApi.delete(`/conversation/delete/${id}`);
                    message.success("Conversation deleted successfully");
                    setConversations(prev => prev.filter(item => item._id !== id));
                    fetchConversations();
                } catch (err: any) {
                    message.error(err.message || "Failed to delete conversation");
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    return {
        conversations,
        singleConversation,
        total,
        loading,
        error,
        query,
        setQuery,
        refetch: fetchConversations,
        getSingleConversation,
        createConversation,
        updateConversation,
        deleteConversation,
    };
}
