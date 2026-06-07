"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, Space, Card, Button, Input, message, Modal, Form, Select, DatePicker } from "antd";
import { Plus, Search, Edit, Trash2, Ticket } from "lucide-react";
import moment from "moment";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/coupons");
      setCoupons(response.data.data);
    } catch (error) {
      // message.error("Failed to load coupons");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      await api.post("/coupons", values);
      message.success("Coupon created successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchCoupons();
    } catch (error) {
      message.error("Failed to create coupon");
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text: string) => <Tag color="blue" className="font-bold font-mono px-3 py-1 text-sm rounded-lg">{text}</Tag>
    },
    {
      title: "Discount",
      key: "discount",
      render: (record: any) => (
        <span className="font-bold">
          {record.discountType === "percentage" ? `${record.discountValue}%` : `$${record.discountValue}`}
        </span>
      )
    },
    {
      title: "Expiry",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date: string) => moment(date).format("MMM DD, YYYY")
    },
    {
      title: "Usage",
      key: "usage",
      render: (record: any) => `${record.usedCount} / ${record.usageLimit}`
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "ACTIVE" : "INACTIVE"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <Button type="text" icon={<Edit size={16} />} />
          <Button type="text" danger icon={<Trash2 size={16} />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <Ticket className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Coupons</h1>
            <p className="text-gray-500">Create and manage discount codes</p>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          className="h-11 rounded-xl bg-amber-600 hover:bg-amber-700 border-none font-bold shadow-lg shadow-amber-100"
          onClick={() => setIsModalOpen(true)}
        >
          Create Coupon
        </Button>
      </div>

      <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <Table columns={columns} dataSource={coupons} loading={loading} rowKey="_id" />
      </Card>

      <Modal
        title="Create New Coupon"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="rounded-2xl overflow-hidden"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="code" label="Coupon Code" rules={[{ required: true }]}>
            <Input placeholder="e.g. SUMMER50" className="rounded-lg h-10" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="discountType" label="Type" rules={[{ required: true }]}>
              <Select className="rounded-lg h-10">
                <Select.Option value="percentage">Percentage</Select.Option>
                <Select.Option value="fixed">Fixed Amount</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="discountValue" label="Value" rules={[{ required: true }]}>
              <Input type="number" className="rounded-lg h-10" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}>
              <DatePicker className="w-full rounded-lg h-10" />
            </Form.Item>
            <Form.Item name="usageLimit" label="Usage Limit" rules={[{ required: true }]}>
              <Input type="number" className="rounded-lg h-10" />
            </Form.Item>
          </div>
          <Button type="primary" block htmlType="submit" className="h-11 rounded-xl bg-amber-600 border-none font-bold mt-2">
            Create Coupon
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
