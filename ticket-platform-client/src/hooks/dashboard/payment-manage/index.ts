import { useCallback, useEffect, useState } from "react";
import useApi from "../../use-api";

// Types
export interface IUser {
  _id: string;
  email: string;
  fullName?: string;
  role?: string;
}

// Withdraw types
export interface IWithdraw {
  _id: string;
  user: IUser;
  wallet: string;
  cardId: string;
  amount: number;
  profitCharge: number;
  status: string;
  transactionId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Payment types
export interface IBooking {
  _id: string;
  category: string;
  personCount: number;
  bookingStatus: string;
  totalPrice: number;
}

export interface IPayment {
  _id: string;
  booking: IBooking;
  user: IUser;
  amount: number;
  currency: string;
  paymentMethodType: string;
  transactionId: string;
  sessionId: string;
  status: string;
  gateway: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


interface PaymentResponse {
  payments: IPayment[];
  total: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number; 
 
  };
}
interface IWithdrawResponse {
  withdrawals: IWithdraw[];
  total: number;
  pagination: {
    totalResult: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UserResponse<T> {
  code: number;
  message: string;
  data: T;
}


// Payments

export function usePayments(initialQuery = { page: 1, limit: 10, search: "" }) {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [query, setQuery] = useState<any>(initialQuery); // keep it generic to accept extra filters

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Spread all query parameters, filter out empty ones
      const paramsObj: Record<string, string> = {};
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          paramsObj[key] = String(value);
        }
      });

      const params = new URLSearchParams(paramsObj);

      const response = await useApi.get<UserResponse<PaymentResponse>>(
        `/payment/all?${params.toString()}`
      );

      setPayments(response?.data?.data?.payments || []);
      setTotal(response?.data?.data?.pagination?.total || 0);
      setTotalItems(response?.data?.data?.pagination?.total || 0);
    } catch (err: any) {
      // console.error("Error fetching payments:", err);
      setError(err.message || "Failed to fetch payments");
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, [query]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, total, loading, totalItems,error, query, setQuery, refetch: fetchPayments };
}


// Get single payment by id
export function useSinglePayment(paymentId: string) {
  const [payment, setPayment] = useState<IPayment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPayment = useCallback(async () => {
    if (!paymentId) return;
    setLoading(true);
    try {
      const { data } = await useApi.get<{ data: IPayment }>(`/payment/${paymentId}`);
      setPayment(data.data);
    } catch (err) {
      // console.error("Error fetching payment:", err);
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  return { payment, loading, refetch: fetchPayment };
}


// Accept withdraw request
export function useChangeProfit() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const changeProfit = useCallback(async (profitCount: number,) => {
    try {
      setLoading(true)
      const { data } = await useApi.patch<{ data: IWithdraw }>(
        "/wallet/update-profit",
        { profit: profitCount }
      );
      setLoading(false)
      return data.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to accept withdraw request");
      setLoading(false)
      return null;
    }
  }, []);

  return { changeProfit, loading, error };
}


// Withdraws

// Get all withdraws

export function useWithdraws(initialQuery: { page?: number; limit?: number; status?: string; search?: string } = { page: 1, limit: 10 }) {
  const [withdraws, setWithdraws] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<any>(initialQuery);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // build params only if they exist
      const paramsObj: Record<string, string> = {};
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          paramsObj[key] = String(value);
        }
      });
      const qs = new URLSearchParams(paramsObj).toString();
      const url = qs ? `/withdraw/all?${qs}` : `/withdraw/all`;

      const response = await useApi.get<any>(url);
      const data = response?.data?.data;

      setWithdraws(data?.withdrawals || []);
      setTotal(data?.pagination?.totalItems || data?.pagination?.total || 0);
    } catch (err: any) {
      // console.error("Error fetching payments:", err);
      setError(err?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { withdraws, total, loading, error, query, setQuery, refetch: fetchPayments };
}


// Send withdraw request
export function useSendWithdrawRqst() {
  const [error, setError] = useState<string | null>(null);

  const sendWithdraw = useCallback(async (payload: Partial<IWithdraw>) => {
    try {
      const { data } = await useApi.post<{ data: IWithdraw }>("/withdraw/send-request", payload);
      return data.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send withdraw request");
      return null;
    }
  }, []);

  return { sendWithdraw, error };
}

// Accept withdraw request
export function useAcceptWithdRqst() {
  const [error, setError] = useState<string | null>(null);

  const acceptWithdraw = useCallback(async (withdrawId: string,) => {
    try {
      const { data } = await useApi.patch<{ data: IWithdraw }>(
        "/withdraw/accept-request",
        { withdrawalId: withdrawId }
      );
      return data.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to accept withdraw request");
      return null;
    }
  }, []);

  return { acceptWithdraw, error };
}

export interface IWalletSummary {
  totalBalance?: number;
  totalIncome?: number;
  profit?: number;
}

export function useGetWalletSummary() {
  const [summaries, setSummaries] = useState<IWalletSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await useApi.get<UserResponse<IWalletSummary>>("/wallet/get-summary");
      setSummaries(response?.data?.data || null);
    } catch (err: any) {
      // console.error("Error fetching payments:", err);
      setError(err.message || "Failed to fetch payments");
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, []);

  useEffect(() => {
    fetchWalletSummary();
  }, [fetchWalletSummary]);

  return { summaries, loading, error, refetch: fetchWalletSummary };
}