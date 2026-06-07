"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, Table, Tag, Button, Avatar, message, Space, Modal, Input, Select } from "antd";
import { MessageSquareWarning, Search, Filter, MessageCircle, CheckCircle, Clock } from "lucide-react";
import moment from "moment";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/support");
      setTickets(response.data.data);
    } catch (error) {
      // message.error("Failed to load support tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/support/${id}/status`, { status });
      message.success("Ticket status updated");
      fetchTickets();
      if (selectedTicket?._id === id) setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" src={user?.profileImage}>{user?.fullName?.[0]}</Avatar>
          <span className="font-medium">{user?.fullName || "Guest"}</span>
        </div>
      )
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text: string) => <span className="font-bold text-gray-800">{text}</span>
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag color={priority === "high" ? "red" : priority === "medium" ? "orange" : "blue"} className="rounded-full px-3">
          {priority.toUpperCase()}
        </Tag>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag 
          icon={status === "resolved" ? <CheckCircle size={12} /> : <Clock size={12} />} 
          color={status === "resolved" ? "green" : status === "open" ? "blue" : "gray"}
          className="rounded-full px-3 flex items-center gap-1 w-fit"
        >
          {status.toUpperCase().replace('_', ' ')}
        </Tag>
      )
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("MMM DD, HH:mm")
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small" 
          className="rounded-lg bg-indigo-600 border-none"
          onClick={() => {
            setSelectedTicket(record);
            setIsModalOpen(true);
          }}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 rounded-2xl">
            <MessageSquareWarning className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Support & Issues</h1>
            <p className="text-gray-500">Manage user inquiries and technical problems</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Input
            prefix={<Search size={18} className="text-gray-400" />}
            placeholder="Search tickets..."
            className="w-full md:w-64 rounded-xl h-11 border-gray-200"
          />
        </div>
      </div>

      <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <Table columns={columns} dataSource={tickets} loading={loading} rowKey="_id" />
      </Card>

      <Modal
        title="Support Ticket Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>Close</Button>,
          selectedTicket?.status !== "resolved" && (
            <Button 
              key="resolve" 
              type="primary" 
              className="bg-green-600 border-none"
              onClick={() => handleStatusChange(selectedTicket._id, "resolved")}
            >
              Mark as Resolved
            </Button>
          )
        ]}
        className="rounded-2xl"
      >
        {selectedTicket && (
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">From</label>
              <div className="font-bold text-gray-800">{selectedTicket.user?.fullName} ({selectedTicket.user?.email})</div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</label>
              <div className="font-bold text-lg text-gray-800">{selectedTicket.subject}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</label>
              <div className="p-4 bg-gray-50 rounded-xl text-gray-700 italic border border-gray-100">
                "{selectedTicket.message}"
              </div>
            </div>
            <div className="flex gap-4">
               <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</label>
                <div><Tag className="rounded-full px-3">{selectedTicket.priority.toUpperCase()}</Tag></div>
              </div>
               <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Status</label>
                <div><Tag color="blue" className="rounded-full px-3">{selectedTicket.status.toUpperCase()}</Tag></div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
