/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import useApi from './../use-api/index';

// Define the expected API response shape
interface DashboardResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface DashboardData {
  [key: string]: any;
}

export function useDashboard(year?: number) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(
    async (selectedYear?: number) => {
      setLoading(true);
      setError(null);
      try {
        const queryYear = selectedYear ?? year ?? new Date().getFullYear();
        const response = await useApi.get<DashboardResponse<DashboardData>>(
          `/dashboard/meta/admin?year=${queryYear}`
        );
        setDashboardData(response.data.data);
      } catch (err: any) {
        // console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    },
    [year]
  );

  // Fetch on mount or when `year` changes
  useEffect(() => {
    fetchDashboard(year);
  }, [year, fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard, 
  };
}
