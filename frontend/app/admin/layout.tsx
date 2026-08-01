import AdminGuard from "@/components/providers/AdminGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-gray-950 lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 lg:overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}

