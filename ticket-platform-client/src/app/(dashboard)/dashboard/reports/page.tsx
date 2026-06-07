"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, Table, Button, Tag, Row, Col, Space, message } from "antd";
import { TbReportAnalytics } from "react-icons/tb";
import { FileText, Download, Filter, FileSpreadsheet, FilePieChart } from "lucide-react";
import moment from "moment";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports");
        setReports(response.data.data);
      } catch (error) {
        // message.error("Failed to load reports");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "ticketId",
      key: "ticketId",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-500" />
          <span className="font-medium text-gray-800">{text || 'N/A'}</span>
        </div>
      )
    },
    {
      title: "Event",
      dataIndex: "eventId",
      key: "event",
      render: (event: any) => (
        <span className="font-medium text-gray-700">{event?.title || 'N/A'}</span>
      )
    },
    {
      title: "User",
      dataIndex: "userId",
      key: "user",
      render: (user: any) => (
        <div>
          <div className="font-medium text-gray-800">{user?.fullName || 'N/A'}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
      )
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => (
        <span className="font-bold text-gray-700">${price?.toFixed(2)}</span>
      )
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => <span className="text-gray-600">{moment(date).format("MMM DD, YYYY hh:mm A")}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'red'} className="rounded-md px-2 py-0.5 capitalize font-medium">
          {status || 'Unknown'}
        </Tag>
      )
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Button type="text" icon={<Download size={16} />} className="text-blue-600 hover:bg-blue-50 rounded-lg">Download</Button>
      )
    }
  ];

  const quickReports = [
    { title: "Monthly Sales Report", icon: <FileSpreadsheet className="text-emerald-500" /> },
    { title: "User Activity Summary", icon: <FileText className="text-blue-500" /> },
    { title: "Event Performance", icon: <FilePieChart className="text-purple-500" /> },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 rounded-2xl">
            <TbReportAnalytics className="w-8 h-8 text-slate-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
            <p className="text-gray-500">Generate and download platform reports</p>
          </div>
        </div>
        <Button type="primary" className="h-11 rounded-xl bg-slate-800 border-none font-bold">
          Generate New Report
        </Button>
      </div>

      <Row gutter={[20, 20]} className="mb-8">
        {quickReports.map((report, idx) => (
          <Col xs={24} md={8} key={idx}>
            <Card hoverable className="rounded-2xl border-none shadow-sm group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                    {report.icon}
                  </div>
                  <div className="font-bold text-gray-700">{report.title}</div>
                </div>
                <Download size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        title="Generated Reports History"
        variant="borderless"
        className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden"
        extra={<Button icon={<Filter size={16} />} type="text">Filter</Button>}
      >
        <Table columns={columns} dataSource={reports} loading={loading} rowKey="_id" />
      </Card>
    </div>
  );
}
