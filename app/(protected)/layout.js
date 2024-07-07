"use client";

import MobileNavigation from "@/components/Navigation/MobileNavigation";
import SidebarNavigation from "@/components/Navigation/SidebarNavigation";
import { usePathname } from "next/navigation";

const Layout = ({ children }) => {
  const pathName = usePathname();

  return (
    <div className="lg:grid lg:grid-cols-4">
      <nav className="p-4 lg:p-0">
        <div className="lg:hidden">
          <MobileNavigation currentPath={pathName} />
        </div>
        <div className="hidden lg:block">
          <SidebarNavigation currentPath={pathName} />
        </div>
      </nav>
      <main className="col-span-3">{children}</main>
    </div>
  );
};

export default Layout;
