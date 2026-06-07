import {
  LayoutDashboard,
  Ticket,
  CalendarDays,
  Heart,
  CreditCard,
  Bell,
  User,
  Settings,
  UserRound,
  ShieldAlert,
  Info,
  CircleQuestionMark,
  Users,
  ShieldCheck,
  BarChart3,
  ClipboardList,
  MessageSquareWarning,
} from "lucide-react";
import { TbMatrix, TbBulb } from "react-icons/tb";
import { MdDashboardCustomize } from "react-icons/md";
import {
  TbCategory,
  TbReportAnalytics,
  TbDiscount
} from "react-icons/tb";


export interface SubmenuItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

export interface MenuItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  submenu?: SubmenuItem[];
}

export interface MenuGroup {
  menu: MenuItem[];
}

export interface MenuData {
  linkData: MenuGroup[];
}

export const adminMenuData: MenuData = {
  linkData: [
    {
      menu: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Manage Events",
          href: "/dashboard/events",
          icon: MdDashboardCustomize,
        },
        {
          label: "Event Categories",
          href: "/dashboard/categories",
          icon: TbCategory,
        },
        {
          label: "Manage Tickets",
          href: "/dashboard/manage-tickets",
          icon: Ticket,
        },

        {
          label: "Users",
          href: "/dashboard/users",
          icon: Users,
        },
        {
          label: "Organizers",
          href: "/dashboard/organizers",
          icon: ShieldCheck,
        },
        {
          label: "Payments",
          href: "/dashboard/payments",
          icon: CreditCard,
        },
        {
          label: "Transactions",
          href: "/dashboard/transactions",
          icon: ClipboardList,
        },
        {
          label: "Coupons",
          href: "/dashboard/coupons",
          icon: TbDiscount,
        },
        {
          label: "Analytics",
          href: "/dashboard/analytics",
          icon: BarChart3,
        },
        {
          label: "Reports",
          href: "/dashboard/reports",
          icon: TbReportAnalytics,
        },

        {
          label: "Notifications",
          href: "/dashboard/notifications",
          icon: Bell,
        },
        {
          label: "Support & Issues",
          href: "/dashboard/support",
          icon: MessageSquareWarning,
        },
        {
          label: "Profile",
          href: "/dashboard/profile",
          icon: UserRound,
        },
        {
          label: "System Settings",
          href: "/dashboard/settings/system",
          icon: Settings,
        },
      ],
    },
  ],
};

export const userMenuData: MenuData = {
  linkData: [
    {
      menu: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "My Tickets",
          href: "/dashboard/my-tickets",
          icon: Ticket,
        },
        {
          label: "My Events",
          href: "/dashboard/my-events",
          icon: CalendarDays,
        },
        {
          label: "Favorites",
          href: "/dashboard/favorites",
          icon: Heart,
        },
        {
          label: "Payment History",
          href: "/dashboard/payment-history",
          icon: CreditCard,
        },
        {
          label: "Notifications",
          href: "/dashboard/notifications",
          icon: Bell,
        },
        {
          label: "Profile",
          href: "/dashboard/profile",
          icon: User,
        },
      ],
    },
  ],
};

export const navItems: MenuItem[] = [
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Sports", href: "/events?category=sports", icon: Ticket },
  { label: "Music", href: "/events?category=music", icon: Heart },
  { label: "Shows", href: "/events?category=shows", icon: Bell },

]

// For backward compatibility if needed, but we should update the component
export const menuData = adminMenuData;
