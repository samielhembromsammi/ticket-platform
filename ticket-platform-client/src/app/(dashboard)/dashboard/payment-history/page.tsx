"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, Card, message } from "antd";
import { CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import moment from "moment";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/payments/my");
        setPayments(response.data.data);
      } catch (error) {
        // message.error("Failed to load payment history");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text: string) => <span className="font-mono text-xs">{text}</span>
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      render: (event: any) => event?.title || "N/A"
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method: string) => (
        <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs font-medium">{method}</span>
      )
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="font-bold text-gray-800">${(amount || 0).toFixed(2)}</span>
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("MMM DD, YYYY hh:mm A")
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "paid" ? "green" : status === "pending" ? "gold" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
      </div>

      <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={payments} 
          loading={loading}
          rowKey="_id"
          locale={{ emptyText: "No payment history found" }}
        />
      </Card>
    </div>
  );
}
