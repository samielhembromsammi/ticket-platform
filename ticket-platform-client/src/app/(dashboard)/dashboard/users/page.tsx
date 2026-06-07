"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, Space, Card, Button, Input, message, Avatar } from "antd";
import { Users as UsersIcon, Search, Mail, Shield, UserX, UserCheck } from "lucide-react";
import moment from "moment";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/user/all?role=user");
      const results = response.data?.data?.results || [];
      setUsers(results);
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      // Mock status toggle logic
      message.success("User status updated successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.profileImage}>{text?.[0]}</Avatar>
          <div>
            <div className="font-bold text-gray-800">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("MMM DD, YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"} className="rounded-full px-3">
          {status?.toUpperCase() || "ACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<Mail size={16} className="text-blue-500" />} />
          <Button
            type="text"
            danger={record.status !== "blocked"}
            icon={record.status === "blocked" ? <UserCheck size={16} /> : <UserX size={16} />}
            onClick={() => handleStatusToggle(record._id, record.status)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <UsersIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-500">View and manage all registered customers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Input
            prefix={<Search size={18} className="text-gray-400" />}
            placeholder="Search users..."
            className="w-full md:w-64 rounded-xl h-11 border-gray-200"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={users.filter(u => u.fullName?.toLowerCase().includes(searchText.toLowerCase()))}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
