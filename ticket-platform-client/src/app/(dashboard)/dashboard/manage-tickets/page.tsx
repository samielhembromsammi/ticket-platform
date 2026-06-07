"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, message } from "antd";

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets/all?limit=100")
      .then(res => setTickets(res.data.data.results))
      .catch(() => message.error("Failed to load tickets"))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: "Ticket ID", dataIndex: "ticketId", key: "ticketId", render: (t: string) => <span className="font-mono text-gray-500">{t}</span> },
    { title: "Event", dataIndex: ["eventId", "title"], key: "event" },
    { title: "User Email", dataIndex: ["userId", "email"], key: "user" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice", render: (p: number) => `$${p.toFixed(2)}` },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>{status.toUpperCase()}</Tag>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Tickets</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table columns={columns} dataSource={tickets} rowKey="_id" loading={loading} />
      </div>
    </div>
  );
}
