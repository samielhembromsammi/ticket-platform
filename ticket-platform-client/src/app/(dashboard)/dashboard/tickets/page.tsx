"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, message } from "antd";
import { Ticket } from "lucide-react";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets/my")
      .then(res => setTickets(res.data.data))
      .catch(() => message.error("Failed to load tickets"))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "Event",
      dataIndex: ["eventId", "title"],
      key: "event",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <img src={record.eventId?.image} alt={text} className="w-10 h-10 object-cover rounded-md" />
          <span className="font-semibold">{text}</span>
        </div>
      ),
    },
    {
      title: "Ticket ID",
      dataIndex: "ticketId",
      key: "ticketId",
      render: (text: string) => <span className="font-mono text-gray-500">{text}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = status === "active" ? "green" : status === "used" ? "gray" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Purchase Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Ticket className="mr-3 text-blue-600" /> My Tickets
      </h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={tickets} 
          rowKey="_id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}
