"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, Space, Card, Button, Input, message, Avatar, Modal } from "antd";
import { ShieldCheck, Search, Mail, ExternalLink, Ban, CheckCircle } from "lucide-react";
import moment from "moment";

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchOrganizers = async () => {
    try {
      const response = await api.get("/user/all?role=organizer");
      const results = response.data?.data?.results || [];
      setOrganizers(results);
    } catch (error) {
      message.error("Failed to load organizers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const handleVerify = (id: string) => {
    Modal.confirm({
      title: 'Verify Organizer',
      content: 'Are you sure you want to verify this organizer? They will be able to create events.',
      onOk: async () => {
        message.success("Organizer verified");
        fetchOrganizers();
      }
    });
  };

  const columns = [
    {
      title: "Organizer",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.profileImage} className="bg-purple-100 text-purple-600 font-bold">{text?.[0]}</Avatar>
          <div>
            <div className="font-bold text-gray-800">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Total Events",
      dataIndex: "eventCount",
      key: "eventCount",
      render: (count: number) => <span className="font-medium">{count || 0}</span>
    },
    {
      title: "Verification",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (verified: boolean) => (
        <Tag color={verified ? "blue" : "warning"} className="rounded-full px-3">
          {verified ? "VERIFIED" : "PENDING"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          {!record.isVerified && (
            <Button
              type="primary"
              size="small"
              className="bg-emerald-600 border-none rounded-lg"
              onClick={() => handleVerify(record._id)}
            >
              Verify
            </Button>
          )}
          <Button type="text" icon={<ExternalLink size={16} className="text-gray-400" />} />
          <Button type="text" danger icon={<Ban size={16} />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="p-3 bg-purple-50 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Organizers</h1>
            <p className="text-gray-500">Manage event organizers and their permissions</p>
          </div>
        </div>
        <Input
          prefix={<Search size={18} className="text-gray-400" />}
          placeholder="Search organizers..."
          className="w-full md:!w-64 rounded-xl h-11 border-gray-200"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={organizers.filter(o => o.fullName?.toLowerCase().includes(searchText.toLowerCase()))}
          loading={loading}
          rowKey="_id"
        />
      </Card>
    </div>
  );
}
