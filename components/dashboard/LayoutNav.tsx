"use client";

import Link from "next/link";
import { JSX, ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiMonitor,
  FiRepeat,
  FiClock,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiActivity,
  FiUser,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { logoutUser } from "../../lib/authSession";
import { useRequireAuth } from "../../hooks/useRequireAuth";

type NavItem = {
  name: string;
  icon: IconType;
  href: string;
};

type DashboardLayoutProps = {
  children?: ReactNode;
};

export default function SideBar({
  children,
}: DashboardLayoutProps): JSX.Element {
  const pathname = usePathname();
  const params = useParams<{ organisationId?: string }>();

  const checkingAuth = useRequireAuth();

  const organisationId = params?.organisationId;

  const baseDashboardPath = organisationId
    ? `/dashboard/${organisationId}`
    : "/dashboard";

  const topLinks: NavItem[] = [
    { name: "Dashboard", icon: FiHome, href: baseDashboardPath },
    {
      name: "Members Management",
      icon: FiUsers,
      href: `${baseDashboardPath}/members`,
    },
    {
      name: "Asset Management",
      icon: FiMonitor,
      href: `${baseDashboardPath}/devices`,
    },
    {
      name: "Asset Assignment",
      icon: FiRepeat,
      href: `${baseDashboardPath}/assignments`,
    },
    {
      name: "Asset History",
      icon: FiClock,
      href: `${baseDashboardPath}/history`,
    },
    {
      name: "Reports & Analytics",
      icon: FiBarChart2,
      href: `${baseDashboardPath}/reports`,
    },
    {
      name: "Notification",
      icon: FiBell,
      href: `${baseDashboardPath}/notifications`,
    },
    {
      name: "Organization Setting",
      icon: FiSettings,
      href: `${baseDashboardPath}/settings`,
    },
    {
      name: "Activity Log",
      icon: FiActivity,
      href: `${baseDashboardPath}/activity-log`,
    },
  ];

  const bottomLinks: NavItem[] = [
    { name: "Account", icon: FiUser, href: `${baseDashboardPath}/account` },
  ];

  const handleLogout = async () => {
    await logoutUser();
  };

  const isActiveLink = (href: string): boolean => {
    if (href === baseDashboardPath) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <aside className="flex w-[250px] flex-col justify-between border-r border-gray-200 bg-white px-4 py-6">
        <div>
          <div className="mb-10 px-2">
            <img src="/logo.png" alt="Logo" className="h-auto w-[140px]" />
          </div>

          <nav className="space-y-1">
            {topLinks.map((item) => {
              const Icon = item.icon;
              const active = isActiveLink(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-gray-100 font-medium text-black"
                      : "text-gray-500 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1 pt-6">
          {bottomLinks.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-gray-100 font-medium text-black"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon size={17} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-500 transition-all hover:bg-gray-100 hover:text-black"
          >
            <FiLogOut size={17} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="relative w-full max-w-[420px]">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              placeholder="search for all items..."
              className="w-full rounded-md bg-gray-100 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="ml-6 flex items-center gap-3">
            <img
              src="/mockup-table.png"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-900">Michael Adams</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}