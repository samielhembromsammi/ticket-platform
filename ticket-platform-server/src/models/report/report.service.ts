import { Ticket } from "../ticket/ticket.model";
import { Event } from "../event/event.model";
import { User } from "../user/user.model";
import { Category } from "../category/category.model";

export const ReportService = {
  getDashboardStats: async () => {
    const [
      totalEvents,
      totalUsers,
      totalCategories,
      allTickets,
      recentTickets,
    ] = await Promise.all([
      Event.countDocuments(),
      User.countDocuments(),
      Category.countDocuments(),
      Ticket.find().lean(),
      Ticket.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "fullName email")
        .populate("eventId", "title")
        .lean(),
    ]);

    const ticketsSold = allTickets.reduce((sum, t) => sum + t.quantity, 0);
    const totalRevenue = allTickets.reduce((sum, t) => sum + t.totalPrice, 0);

    // Calculate sales progress (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const salesProgress = last7Days.map(date => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayTickets = allTickets.filter(t => {
        if (!t.createdAt) return false;
        const ticketDate = new Date(t.createdAt);
        return ticketDate >= date && ticketDate < nextDate;
      });

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayTickets.reduce((sum, t) => sum + t.quantity, 0),
        revenue: dayTickets.reduce((sum, t) => sum + t.totalPrice, 0),
      };
    });

    return {
      totalEvents,
      totalUsers,
      totalCategories,
      ticketsSold,
      totalRevenue,
      recentTickets,
      salesProgress,
    };
  },

  getAllReports: async () => {
    return await Ticket.find().populate("userId").populate("eventId").sort({ createdAt: -1 });
  },
};
