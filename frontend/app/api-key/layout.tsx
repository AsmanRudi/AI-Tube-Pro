import AppLayout from "@/components/layout/AppLayout";
import AuthGuard from "@/components/providers/AuthGuard";

export default function ApiKeyLayout({
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

