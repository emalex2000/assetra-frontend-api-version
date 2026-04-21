"use client";

import Link from "next/link";
import { JSX, ReactNode } from "react";
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

export default function DashboardNav({
  children,
}: DashboardLayoutProps): JSX.Element {
  const pathname = usePathname();
  const checkingAuth = useRequireAuth();

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

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <aside className="w-[250px] border-r border-gray-200 bg-white px-4 py-6 flex flex-col justify-between">
        <div>
          <div className="mb-10 px-2">
            <img src="/logo.png" alt="Logo" className="w-[140px] h-auto" />
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
                      ? "bg-gray-100 text-black font-medium"
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
                    ? "bg-gray-100 text-black font-medium"
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

      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="relative w-full max-w-[420px]">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              placeholder="search for all items..."
              className="w-full rounded-md bg-gray-100 pl-10 pr-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
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