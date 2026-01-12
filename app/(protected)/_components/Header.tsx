"use client";

import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Profile from "./Profile";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`${pathname === href ? "text-blue-500" : "text-gray-500"}`}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-400 bg-white p-4">
      <div className="flex items-center gap-5">
        <h1 className="font-semibold">Simple Planner</h1>
        <nav className="flex items-center gap-2 text-sm">
          <NavLink href={ROUTES.plan.day}>Daily</NavLink>
          <NavLink href={ROUTES.plan.week}>Weekly</NavLink>
        </nav>
      </div>
      <Profile />
    </header>
  );
}
