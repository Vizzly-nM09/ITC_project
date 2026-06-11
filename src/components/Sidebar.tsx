"use client";
import axiosClient from "@/lib/axiosCLient";
import { useModul } from "@/store/useModul";
import useSidebar from "@/store/useSidebar";
import { ModulType } from "@/types/ModulType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}
export default function Sidebar({
  toggleSidebar,
  isSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const { data: session, status }: { data: any; status: string } = useSession();

  const { modul, setModul }: any = useModul();

  const getModul = async () => {
    // if (modul.length > 0) return modul;

    try {
      const res = await axiosClient.post(
        "/api/modul/getModulesAccess",
        {
          group_id: session.user?.groupId,
          asal_sistem: "admisi",
        },
        {
          headers: {
            Authorization: `Bearer ${session.user?.accessToken}`,
          },
          validateStatus(status) {
            return (status >= 200 && status < 300) || status === 404;
          },
        }
      );

      if (res.status === 200) {
        const baseData = Array.isArray(res.data.data) ? res.data.data : [];

        const data = [
          {
            ModulId: 1,
            ModulName: "Dashboard",
            ModulLink: "/dashboard",
            ModulIcon: "bx bx-home",
            ModulMainMenu: 0,
            ModulUrutan: 0,
            SubMenu: null,
          },
          ...baseData,
        ];

        setModul(data);
        return data;
      }

      return [];
    } catch (error) {
      return [];
    }
  };

  const { isFetched, data: modulList } = useQuery({
    queryKey: ["modul"],
    queryFn: () => getModul(),
    enabled: status === "authenticated",
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-60 h-screen py-6 pl-3 bg-[#f0f0f0] transition-transform ${
          isSidebarOpen ? "-translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white rounded-xl shadow-lg shadow-gray-400 border border-gray-400">
          <div className="border-2 border-[#F8B600] rounded-lg w-full h-32 flex flex-col p-3">
            <div className="flex flex-row-reverse justify-between lg:block">
              <Link href="/" className="flex items-center ps-2.5 mb-5">
                <Image
                  width={200}
                  height={200}
                  src="/logo/logo-uib.png"
                  className="w-40 h-auto"
                  alt="Universitas Internasional Batam"
                />
              </Link>
              <button
                className="block md:hidden order-first"
                onClick={toggleSidebar}
              >
                <span className="bx bx-menu text-3xl text-black"></span>
              </button>
            </div>
          </div>

          <div className="bg-[#2A3955] rounded-lg w-full h-32 flex flex-col p-3 -mt-17">
            <div className="flex flex-row items-center gap-2">
              <span className="bx bx-user text-sm text-white"></span>
              <span className="text-sm text-white">{session?.user?.nama}</span>
            </div>

            <div className="flex flex-col mt-8">
              <span className="text-xs font-medium text-white">
                {session?.user?.groupName}
              </span>
              <span className="text-xs font-light text-white">
                New Admission Platform
              </span>
              <span className="text-xs font-light text-white">
                Universitas Internasional Batam
              </span>
            </div>
          </div>
          <hr className="mt-3" />
          <ul className="space-y-2 font-normal text-sm mt-2 menu w-full">
            {modul.length > 0 ? (
              modul.map((mdl: ModulType) => {
                const hasChildren = mdl.SubMenu && mdl.SubMenu.length > 0;

                return !hasChildren ? (
                  <li key={mdl.ModulId}>
                    <Link
                      href={`${mdl.ModulLink}`}
                      className={`flex items-center py-2 px-4 rounded-lg group hover:bg-[#2A3955] hover:text-white  ${
                        pathname === `${mdl.ModulLink}` ||
                        pathname.split(/(?=\/)/)[0] === mdl.ModulLink
                          ? "bg-[#2A3955] text-white"
                          : "text-black"
                      }`}
                    >
                      <span className={`text-xl ${mdl.ModulIcon}`}></span>
                      <span className="ms-3">{mdl.ModulName}</span>
                    </Link>
                  </li>
                ) : (
                  <li
                    key={mdl.ModulId}
                    className="rounded-lg group"
                    style={{ marginLeft: "-9px" }}
                  >
                    <details
                      open={mdl?.SubMenu?.some(
                        (sub_mdl: any) =>
                          sub_mdl.ModulMainMenu === mdl.ModulId &&
                          pathname === `${sub_mdl.ModulLink}`
                      )}
                    >
                      <summary
                        className={`hover:bg-[#2A3955] hover:text-white rounded-lg ${
                          mdl?.SubMenu?.some(
                            (sub_mdl: any) =>
                              sub_mdl.ModulMainMenu === mdl.ModulId &&
                              pathname === `${sub_mdl.ModulLink}`
                          )
                            ? "bg-[#2A3955] text-white"
                            : ""
                        }`}
                      >
                        <span className={`text-xl ${mdl.ModulIcon}`}></span>{" "}
                        {mdl.ModulName}
                      </summary>
                      <ul className="mt-2">
                        {(mdl.SubMenu || []).map((sub_mdl: any) =>
                          sub_mdl.ModulMainMenu === mdl.ModulId ? (
                            <li
                              key={sub_mdl.ModulId}
                              className={`mt-2 ${
                                pathname === `${sub_mdl.ModulLink}`
                                  ? "rounded-lg bg-[#F8B600] text-white"
                                  : ""
                              }`}
                            >
                              <Link href={`${sub_mdl.ModulLink}`}>
                                {sub_mdl.ModulName}
                              </Link>
                            </li>
                          ) : null
                        )}
                      </ul>
                    </details>
                  </li>
                );
              })
            ) : (
              <div className="space-y-2">
                <div className="skeleton h-10 w-full"></div>
                <div className="skeleton h-10 w-full"></div>
                <div className="skeleton h-10 w-full"></div>
                <div className="skeleton h-10 w-full"></div>
                <div className="skeleton h-10 w-full"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
}
