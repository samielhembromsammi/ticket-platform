"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, Card, Input, Button, Space, message } from "antd";
import { ClipboardList, Search, Download, Filter } from "lucide-react";
import moment from "moment";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/payments/my");
        setTransactions(response.data.data);
      } catch (error) {
        message.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("MMM DD, hh:mm A"),
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text: string) => <span className="font-mono text-xs">{text}</span>
    },
    {
      title: "Description",
      key: "description",
      render: (record: any) => `Ticket Purchase: ${record.event?.title || "N/A"}`
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method: string) => <Tag className="rounded-lg">{method?.toUpperCase()}</Tag>
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="font-bold text-gray-900">${(amount || 0).toFixed(2)}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "paid" ? "blue" : "default"} className="rounded-full">
          {status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 rounded-2xl">
            <ClipboardList className="w-8 h-8 text-slate-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Transaction History</h1>
            <p className="text-gray-500">Detailed logs of all financial movements</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={<Download size={16} />} className="rounded-xl h-10 border-gray-200">Export CSV</Button>
          <Button icon={<Filter size={16} />} className="rounded-xl h-10 border-gray-200">Filter</Button>
        </div>
      </div>

      <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <Input 
            prefix={<Search size={18} className="text-gray-400" />}
            placeholder="Search by ID or name..."
            className="max-w-md rounded-xl h-10 border-gray-200 shadow-none"
          />
        </div>
        <Table 
          columns={columns} 
          dataSource={transactions} 
          loading={loading}
          rowKey="_id"
        />
      </Card>
    </div>
  );
}
