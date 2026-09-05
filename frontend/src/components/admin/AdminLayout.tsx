import { type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="min-w-0 flex-1 pt-16 lg:ml-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
