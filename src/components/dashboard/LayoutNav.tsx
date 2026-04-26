"use client";

import Link from "next/link";
import { JSX, ReactNode, useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
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

export default function SideBar({
  children,
}: DashboardLayoutProps): JSX.Element {
  const pathname = usePathname();
  const params = useParams<{ organisationId?: string }>();
  const checkingAuth = useRequireAuth();
  const { user } = useCurrentUser();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  
  const [collapsed, setCollapsed] = useState(false);

  const organisationId = params?.organisationId;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const currentOrgRole = user?.roles?.find(
    (item) => item.company_id === organisationId
  );

  const displayedRole = currentOrgRole?.role || user?.roles?.[0]?.role || "User";

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

         <div
            ref={dropdownRef}
            className="relative ml-6 flex cursor-pointer items-center gap-3"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <img
              src={user?.profile_image || "/mockup-table.png"}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-900">
                {user?.email || "Loading user..."}
              </p>
              <p className="text-xs text-gray-500">{displayedRole || primaryRole}</p>
            </div>

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="absolute right-0 top-14 z-50 w-44 rounded-xl border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    router.push("/dashboard");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    router.push("/dashboard/account");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Account
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}