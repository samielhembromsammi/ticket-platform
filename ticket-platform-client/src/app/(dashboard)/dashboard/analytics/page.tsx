"use client";
import { Card, Row, Col, Statistic, Select } from "antd";
import { BarChart3, TrendingUp, Users, Ticket, DollarSign, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-500">Track platform performance and growth</p>
          </div>
        </div>
        <Select defaultValue="7d" className="w-32 h-10">
          <Select.Option value="24h">Last 24h</Select.Option>
          <Select.Option value="7d">Last 7 days</Select.Option>
          <Select.Option value="30d">Last 30 days</Select.Option>
        </Select>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
            <Statistic 
              title="Total Sales" 
              value={124500} 
              prefix={<DollarSign size={20} className="text-emerald-500 mr-2" />} 
              precision={2}
            />
            <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +12.5% from last week
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
            <Statistic 
              title="New Users" 
              value={456} 
              prefix={<Users size={20} className="text-blue-500 mr-2" />} 
            />
            <div className="mt-2 text-xs text-blue-600 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +8.2% from last week
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
            <Statistic 
              title="Tickets Sold" 
              value={3240} 
              prefix={<Ticket size={20} className="text-purple-500 mr-2" />} 
            />
            <div className="mt-2 text-xs text-purple-600 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +5.1% from last week
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
            <Statistic 
              title="Active Events" 
              value={84} 
              prefix={<Calendar size={20} className="text-orange-500 mr-2" />} 
            />
            <div className="mt-2 text-xs text-orange-600 font-bold">Stable performance</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Revenue Growth" variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl min-h-[400px] flex items-center justify-center">
            <div className="text-gray-300 text-center">
              <BarChart3 size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Interactive Chart Area</p>
              <p className="text-sm">Revenue trends over the selected period</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="User Distribution" variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl min-h-[400px] flex items-center justify-center">
             <div className="text-gray-300 text-center">
              <div className="w-32 h-32 border-8 border-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users size={32} className="opacity-20" />
              </div>
              <p className="text-lg">Donut Chart Area</p>
              <p className="text-sm">New vs Returning Users</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
