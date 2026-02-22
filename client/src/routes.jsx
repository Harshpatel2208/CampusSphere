import React from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  FileText,
  CalendarDays,
  Users,
  User,
} from "lucide-react";
import DashboardPage from "./pages/DashboardPage";
import AttendancePage from "./pages/AttendancePage";
import MarksPage from "./pages/MarksPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import LeavePage from "./pages/LeavePage";
import MentoringPage from "./pages/MentoringPage";
import ProfilePage from "./pages/ProfilePage";

// Centralized route configuration
export const routes = [
  {
    path: "/",
    element: <DashboardPage />,
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    showInNavbar: true,
  },
  {
    path: "/attendance",
    element: <AttendancePage />,
    label: "Attendance",
    icon: <CalendarCheck size={20} />,
    showInNavbar: true,
  },
  {
    path: "/marks",
    element: <MarksPage />,
    label: "Marks",
    icon: <Award size={20} />,
    showInNavbar: true,
  },
  {
    path: "/assignments",
    element: <AssignmentsPage />,
    label: "Assignments",
    icon: <FileText size={20} />,
    showInNavbar: true,
  },
  {
    path: "/leave",
    element: <LeavePage />,
    label: "Leave",
    icon: <CalendarDays size={20} />,
    showInNavbar: true,
  },
  {
    path: "/mentoring",
    element: <MentoringPage />,
    label: "Mentoring",
    icon: <Users size={20} />,
    showInNavbar: true,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    label: "Profile",
    icon: <User size={20} />,
    showInNavbar: true,
  },
];
