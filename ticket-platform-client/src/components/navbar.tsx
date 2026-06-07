"use client";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { Button, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { RiMenu3Fill } from "react-icons/ri";
import { navItems } from "../data";

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, logout } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isHome = pathname === "/";
  const currentCategory = searchParams.get("category") || "";

  // Fix hydration mismatch by only rendering auth-dependent UI on the client
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/events");
    }
  };

  const handleCategoryClick = (name: string) => {
    if (name === "Cities") {
      router.push("/events");
      return;
    }
    let catVal = name;
    if (name === "Shows") catVal = "Comedy";
    router.push(`/?category=${catVal}`);
  };

  const items: MenuProps['items'] = [
    {
      key: 'profile-info',
      label: (
        <div className="px-4 py-2 border-b border-gray-100 min-w-[200px]">
          <p className="font-bold text-gray-800 m-0">{user?.fullName || "User"}</p>
          <p className="text-xs text-gray-500 m-0">{user?.email}</p>
        </div>
      ),
      disabled: true,
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: (
        <Link href={user?.role === "admin" ? "/dashboard" : "/dashboard/tickets"}>
          View Dashboard
        </Link>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Logout',
      onClick: logout,
    },
  ];

  // Dynamic Tailwind styling classes
  const navContainerClass = `flex justify-between items-center py-4 px-8 fixed top-0 w-full z-50 transition-all duration-300 ${isHome
    ? (isScrolled ? 'bg-white/80 backdrop-blur-md text-black shadow-sm px-6 pt-5' : 'bg-transparent text-slate-900 px-6 py-7')
    : (isScrolled ? 'bg-white/80 backdrop-blur-md text-black shadow px-6 pt-5' : 'bg-white text-slate-800 px-6 py-7')
    }`;

  const logoClass = `text-2xl font-black tracking-tighter transition-colors select-none ${isScrolled ? 'text-black' : 'text-slate-900'}`;

  const linkClass = (isActive: boolean) => `transition-colors font-semibold text-sm cursor-pointer ${isScrolled
    ? (isActive ? 'text-black border-b-2 border-blue-500 pb-0.5' : 'text-black/60 hover:text-black')
    : (isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' : 'text-slate-600 hover:text-slate-900')
    }`;

  const searchInputClass = `w-full pl-10 pr-4 py-2 rounded-full border text-sm transition-all focus:outline-none ${isScrolled
    ? 'bg-white/10 border-black/10 text-black placeholder-black/40 focus:bg-white/20 focus:ring-1 focus:ring-blue-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
    }`;

  return (
    <nav className={navContainerClass}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <Link href="/" className={logoClass}>
            TICKET<span className="text-primary">PRO</span>
          </Link>

          {/* Pill Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-[280px] hidden md:block">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder="What do you want to see live?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchInputClass}
            />
          </form>

          {/* Category Links */}
          <div className="flex items-center gap-5 select-none hidden lg:flex">
            {navItems.map((item: any) => {
              let catName = item.label;
              if (item.label === "Shows") catName = "Comedy";
              const isActive = currentCategory.toLowerCase() === catName.toLowerCase();
              return (
                <Link key={item.label} href={`/events?category=${catName}`}>
                  <button
                    className={linkClass(isActive)}
                  >
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm font-semibold">
          {/* Mobile Menu Button */}
          <div className={`lg:hidden transition-colors ${isScrolled ? 'text-black' : 'text-slate-900'}`}>
            <button className="cursor-pointer flex items-center justify-center" onClick={() => toggleMenu()}>
              <RiMenu3Fill size={24} />
            </button>
          </div>
          {mounted && (
            isAuthenticated ? (
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
                trigger={['hover']}
              >
                <div className="flex items-center gap-2 cursor-pointer group">
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    src={user?.profilePhoto}
                    className="border border-blue-500 group-hover:border-blue-400 transition-all animate-fade-in"
                  />
                  <span className={`hidden md:inline font-medium transition-colors ${isScrolled ? '!text-black/90 group-hover:text-black/60' : '!text-black/90 group-hover:text-blue-600'}`}>
                    {user?.fullName?.split(' ')[0] || "Profile"}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login">
                  <button className={`font-semibold text-xs px-4 py-2 rounded-lg border transition shadow-xs cursor-pointer bg-white hover:bg-slate-50 text-slate-700 border-slate-200`}>
                    Sign in
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className={`font-semibold text-xs px-4 py-2 rounded-lg border transition shadow-xs cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-blue-600`}>
                    Sign up
                  </button>
                </Link>
              </div>
            )
          )}

          {/* Placeholder during server-side render / hydration */}
          {!mounted && <div className="w-[60px] h-8" />}
        </div>
        {/* Placeholder during server-side render / hydration */}
        {!mounted && <div className="w-[60px] h-8" />}
      </div>
      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          className="fixed w-full h-screen inset-0 bg-black/90 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 !z-[999] w-64 h-screen bg-white text-black shadow-xl transform transition-transform duration-300 ease-in-out
                ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center py-4 px-5 border-b border-slate-100">
          <Link href="/" className="text-xl font-black tracking-tighter select-none text-slate-900" onClick={() => setMenuOpen(false)}>
            TICKET<span className="text-blue-600">PRO</span>
          </Link>
          <button onClick={toggleMenu} className="cursor-pointer text-slate-500 hover:text-slate-800 transition-colors">
            <X size={20} className="border border-slate-200 rounded-full w-8 h-8 p-[6px]" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-68px)] justify-between p-5">
          <div className="space-y-6">
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearchSubmit(e); setMenuOpen(false); }} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </form>

            {/* Categories */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">Categories</p>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item: any) => {
                  let catName = item.label;
                  if (item.label === "Shows") catName = "Comedy";
                  const isActive = currentCategory.toLowerCase() === catName.toLowerCase();
                  return (
                    <Link key={item.label} href={`/events?category=${item.label}`}>
                      <button
                        onClick={() => {
                          handleCategoryClick(item.label);
                          setMenuOpen(false);
                        }}
                        className={`text-left w-full px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                      >
                        {item.label}
                      </button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Auth Section at Bottom */}
          <div className="border-t border-slate-100 pt-5">
            {mounted && (
              isAuthenticated ? (
                <div className="space-y-4">
                  {/* User Profile Info */}
                  <div className="flex items-center gap-3 px-1">
                    <Avatar
                      size="default"
                      icon={<UserOutlined />}
                      src={user?.profilePhoto}
                      className="border border-blue-500"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-800 text-sm m-0 truncate">{user?.fullName || "User"}</p>
                      <p className="text-xs text-gray-500 m-0 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-col space-y-1">
                    <Link
                      href={user?.role === "admin" ? "/dashboard" : "/dashboard/tickets"}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold text-sm transition-colors"
                    >
                      <DashboardOutlined />
                      <span>View Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
                    >
                      <LogoutOutlined />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="w-full">
                    <button className="w-full font-semibold text-xs px-4 py-2.5 rounded-lg border transition shadow-xs bg-white hover:bg-slate-50 text-slate-700 border-slate-200">
                      Sign in
                    </button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="w-full">
                    <button className="w-full font-semibold text-xs px-4 py-2.5 rounded-lg border transition shadow-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
                      Sign up
                    </button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </aside>
    </nav >
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-[72px] w-full bg-slate-950/10 fixed top-0 z-50" />}>
      <NavbarContent />
    </Suspense>
  );
}