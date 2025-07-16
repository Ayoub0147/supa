"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/categories", label: "Categories" },
  { href: "/dashboard/manufacturers", label: "Manufacturers" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide TopNav on all /auth routes and /
  if (pathname.startsWith("/auth") || pathname === "/") return null;

  // Dummy logout handler (replace with real logic)
  const handleLogout = () => {
    // TODO: Add Supabase signOut and redirect
    router.push("/auth");
  };

  return (
    <nav className="w-full bg-background border-b sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg tracking-tight">MyApp</span>
          <div className="hidden md:flex gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith(link.href) ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t px-4 pb-4">
          <div className="flex flex-col gap-2 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith(link.href) ? "bg-muted text-primary" : "text-muted-foreground hover:bg-muted"}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full mt-2">
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
} 