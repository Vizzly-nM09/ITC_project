"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/Sidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status }: { data: any; status: string } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    setToken(session?.user?.accessToken);
  }, [session]);

  return (
    <>
      <div className="flex flex-1">
        <QueryClientProvider client={queryClient}>
          <Sidebar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <div className="flex-1 w-screen min-h-screen sm:ml-60 bg-[#f0f0f0] dark:bg-[#212121]">
            <Header toggleSidebar={toggleSidebar} />
            <>{children}</>
          </div>
        </QueryClientProvider>
      </div>
    </>
  );
}
