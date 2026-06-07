"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, List, Avatar, Tag, Empty, Button, message } from "antd";
import { Bell, CheckCircle2, AlertCircle, Info, Calendar } from "lucide-react";
import moment from "moment";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications/my");
        setNotifications(response.data.data);
      } catch (error) {
        message.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="text-green-500" size={20} />;
      case "warning": return <AlertCircle className="text-amber-500" size={20} />;
      case "info": return <Info className="text-blue-500" size={20} />;
      default: return <Bell className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        </div>
        <Button variant="outlined" className="rounded-lg border-gray-200">Mark all as read</Button>
      </div>

      {notifications.length > 0 ? (
        <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item: any) => (
              <List.Item
                className={`px-6 py-4 hover:bg-gray-50 transition cursor-pointer ${!item.isRead ? "bg-blue-50/30" : ""}`}
                actions={[<span key="date" className="text-xs text-gray-400">{moment(item.createdAt).fromNow()}</span>]}
              >
                <List.Item.Meta
                  avatar={
                    <div className={`p-2 rounded-xl ${!item.isRead ? "bg-white" : "bg-gray-100"}`}>
                      {getIcon(item.type)}
                    </div>
                  }
                  title={<span className={`font-semibold ${!item.isRead ? "text-gray-900" : "text-gray-600"}`}>{item.title}</span>}
                  description={item.message}
                />
              </List.Item>
            )}
          />
        </Card>
      ) : (
        <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl py-20">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-gray-400">
                <p className="text-lg font-medium mb-2 text-gray-500">All caught up!</p>
                <p>No new notifications at the moment.</p>
              </div>
            }
          />
        </Card>
      )}
    </div>
  );
}
