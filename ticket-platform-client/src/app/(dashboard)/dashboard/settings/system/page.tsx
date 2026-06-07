"use client";
import { Card, Form, Input, Button, Switch, Divider, Select, message } from "antd";
import { Settings, Globe, Shield, Bell, Database, Mail } from "lucide-react";

export default function SystemSettingsPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    message.success("System settings updated successfully");
    console.log(values);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-gray-100 rounded-2xl">
          <Settings className="w-8 h-8 text-gray-700" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-500">Global platform configuration and security</p>
        </div>
      </div>

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        initialValues={{
          siteName: "Ticket Platform",
          maintenanceMode: false,
          enableRegistration: true,
          defaultCurrency: "USD",
          emailSender: "noreply@ticketplatform.com"
        }}
      >
        <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="text-blue-500" size={20} />
            <h2 className="text-xl font-bold text-gray-800">General Configuration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="siteName" label="Site Name">
              <Input className="rounded-lg h-10" />
            </Form.Item>
            <Form.Item name="defaultCurrency" label="Default Currency">
              <Select className="h-10">
                <Select.Option value="USD">USD ($)</Select.Option>
                <Select.Option value="EUR">EUR (€)</Select.Option>
                <Select.Option value="BDT">BDT (৳)</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-gray-700">Maintenance Mode</div>
              <div className="text-sm text-gray-400">Put the site offline for all users except admins</div>
            </div>
            <Form.Item name="maintenanceMode" valuePropName="checked" className="mb-0">
              <Switch />
            </Form.Item>
          </div>
        </Card>

        <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-red-500" size={20} />
            <h2 className="text-xl font-bold text-gray-800">Security & Registration</h2>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="font-bold text-gray-700">Allow New Registrations</div>
              <div className="text-sm text-gray-400">Toggle whether new users can sign up</div>
            </div>
            <Form.Item name="enableRegistration" valuePropName="checked" className="mb-0">
              <Switch />
            </Form.Item>
          </div>
          <Form.Item name="adminEmail" label="Security Alert Email">
            <Input prefix={<Mail size={16} className="text-gray-400" />} className="rounded-lg h-10" placeholder="admin@platform.com" />
          </Form.Item>
        </Card>

        <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Database className="text-indigo-500" size={20} />
            <h2 className="text-xl font-bold text-gray-800">Email Server (SMTP)</h2>
          </div>
          <Form.Item name="emailSender" label="Sender Email Address">
            <Input className="rounded-lg h-10" />
          </Form.Item>
          <div className="text-xs text-gray-400 mb-4">SMTP credentials are managed via environment variables for security.</div>
        </Card>

        <div className="mt-8 flex justify-end">
          <Button type="primary" htmlType="submit" className="h-12 px-10 rounded-xl bg-gray-800 border-none font-bold shadow-lg">
            Save All Changes
          </Button>
        </div>
      </Form>
    </div>
  );
}
