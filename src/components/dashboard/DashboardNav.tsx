"use client";

import Link from "next/link";
import { JSX, ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiMonitor,
  FiBell,
  FiActivity,
  FiUser,
  FiLogOut,
  FiSearch,
  FiMenu,
  FiChevronLeft,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { logoutUser } from "../../lib/authSession";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type NavItem = {
  name: string;
  icon: IconType;
  href: string;
};

type DashboardLayoutProps = {
  children?: ReactNode;
};

export default function DashboardNav({
  children,
}: DashboardLayoutProps): JSX.Element {
  const pathname = usePathname();
  const checkingAuth = useRequireAuth();
  const { user } = useCurrentUser();

  const [collapsed, setCollapsed] = useState(false);

  const topLinks: NavItem[] = [
    { name: "Dashboard", icon: FiHome, href: "/dashboard" },
    { name: "Organisations", icon: FiUsers, href: "/dashboard/organisations" },
    { name: "Settings", icon: FiMonitor, href: "/dashboard/assets" },
    { name: "Notification", icon: FiBell, href: "/dashboard/notifications" },
    {
      name: "Create Organisation",
      icon: FiActivity,
      href: "/dashboard/create-organisation",
    },
  ];

  const bottomLinks: NavItem[] = [
    { name: "Account", icon: FiUser, href: "/dashboard/account" },
  ];

  const handleLogout = async () => {
    await logoutUser();
  };

  const isActiveLink = (href: string): boolean => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  const primaryRole = user?.roles?.[0]?.role || "User";

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <aside
        className={`flex flex-col justify-between border-r border-gray-200 bg-white px-4 py-6 transition-all duration-300 ${
          collapsed ? "w-[82px]" : "w-[250px]"
        }`}
      >
        <div>
          <div
            className={`mb-10 flex items-center ${
              collapsed ? "justify-center" : "justify-between px-2"
            }`}
          >
            {!collapsed && (
              <img src="/logo.png" alt="Logo" className="h-auto w-[140px]" />
            )}

            {collapsed && (
              <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            )}

            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
            >
              {collapsed ? <FiMenu size={18} /> : <FiChevronLeft size={18} />}
            </button>
          </div>

          <nav className="space-y-1">
            {topLinks.map((item) => {
              const Icon = item.icon;
              const active = isActiveLink(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center rounded-md px-3 py-2.5 text-sm transition-all ${
                    collapsed ? "justify-center" : "gap-3"
                  } ${
                    active
                      ? "bg-gray-100 font-medium text-black"
                      : "text-gray-500 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.name}</span>}
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
                title={collapsed ? item.name : undefined}
                className={`flex items-center rounded-md px-3 py-2.5 text-sm transition-all ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  active
                    ? "bg-gray-100 font-medium text-black"
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm text-gray-500 transition-all hover:bg-gray-100 hover:text-black ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <FiLogOut size={18} />
            {!collapsed && <span>Log out</span>}
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
              src={user?.profile_image || "/mockup-table.png"}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-900">
                {user?.email || "Loading user..."}
              </p>
              <p className="text-xs text-gray-500">User</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}