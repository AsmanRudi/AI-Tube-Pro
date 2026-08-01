import AppLayout from "@/components/layout/AppLayout";
import AuthGuard from "@/components/providers/AuthGuard";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppLayout>
        {children}
      </AppLayout>
    </AuthGuard>
  );
}