import {
  HelpCircleIcon,
  LayoutDashboardIcon,
  NotebookIcon,
} from "lucide-react";

export const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon size={24} />,
  },
  {
    name: "View Notes",
    href: "/view-notes",
    icon: <NotebookIcon size={24} />,
  },
  {
    name: "Help & Support",
    href: "/help&support",
    icon: <HelpCircleIcon size={24} />,
  },
];
