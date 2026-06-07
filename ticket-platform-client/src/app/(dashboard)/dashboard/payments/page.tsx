"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, Card, Row, Col, Statistic, message } from "antd";
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import moment from "moment";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    successfulPayments: 0,
    pendingPayments: 0
  });

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments/my"); // For admin, maybe a different endpoint?
      // For now using the same endpoint as user but for all
      const data = response.data.data;
      setPayments(data);
      
      const revenue = data.reduce((sum: number, p: any) => sum + (p.status === "paid" ? p.amount : 0), 0);
      const success = data.filter((p: any) => p.status === "paid").length;
      const pending = data.filter((p: any) => p.status === "pending").length;

      setSummary({
        totalRevenue: revenue,
        successfulPayments: success,
        pendingPayments: pending
      });
    } catch (error) {
      message.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text: string) => <span className="font-mono text-xs font-bold text-blue-600">{text}</span>
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: any) => user?.fullName || "Guest User"
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="font-bold">${(amount || 0).toFixed(2)}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "paid" ? "green" : "gold"} className="rounded-full px-3">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("MMM DD, YYYY hh:mm A")
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-indigo-600" /> Payments Overview
        </h1>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={8}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
            <Statistic 
              title="Total Revenue" 
              value={summary.totalRevenue} 
              prefix={<TrendingUp className="mr-2 text-emerald-500" />} 
              precision={2}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
            <Statistic 
              title="Successful Payments" 
              value={summary.successfulPayments} 
              prefix={<CheckCircle2 className="mr-2 text-blue-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
            <Statistic 
              title="Pending Payments" 
              value={summary.pendingPayments} 
              prefix={<AlertCircle className="mr-2 text-amber-500" />} 
            />
          </Card>
        </Col>
      </Row>

      <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={payments} 
          loading={loading}
          rowKey="_id"
        />
      </Card>
    </div>
  );
}
