"use client";
import { useNotifikasi } from "@/store/useNotifikasi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useModulGroupData } from "@/hooks/Usergroup/useModulGroupData";
import { DataTable } from "../data-table";
import { columns } from "../columns";
import { ModulAlternateType } from "@/types/ModulAlternateType";
import { useEditModulGroup } from "@/hooks/Usergroup/useEditModulGroup";

export default function SetModulView({
  usergroupId,
  usergroupName,
}: {
  usergroupId: string;
  usergroupName: string;
}) {
  const pathname = usePathname();
  const showNotification = useNotifikasi.getState().show;
  const { data: session, status }: { data: any; status: string } = useSession();

  // console.log(session);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [usergroup, setUsergroup] = useState<ModulAlternateType[]>([]);
  const [selectedModul, setSelectedModul] = useState<{}>({});

  // Get data usergroup
  const { data, isLoading, refetch } = useModulGroupData(
    session?.user?.accessToken,
    usergroupId,
    status
  );
  const { mutate: updateModulGroupMutation } = useEditModulGroup(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil mengedit usergroup",
      });
      refetch();
      setIsLoadingSubmit(false);
    },
    (msg) => {
      showNotification({
        status: "text-red-500",
        icon: "bx bx-error text-2xl",
        header: "Terjadi Kesalahan",
        message: msg,
      });
    }
  );

  // Submit form tambah dan edit user
  const handleSubmit = async () => {
    updateModulGroupMutation({
      token: session?.user?.accessToken,
      modulGroup: {
        selected_modul: selectedModul,
        group_id: String(usergroupId),
      },
    });
    setIsLoadingSubmit(true);
  };

  const catchChangedModul = (selectedModul: {}) => {
    setSelectedModul(selectedModul);
  };

  useEffect(() => {
    if (!data) return;

    setUsergroup(data.modulList);
  }, [data]);

  return (
    <div className="px-8 py-4">
      <h1 className="w-full text-4xl font-bold text-black">
        Set Modul {usergroupName}
      </h1>

      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm text-black">
        <ul>
          <li>
            <Link
              href={"/managemen-user/usergroup"}
              className="btn bg-black btn-xs rounded-lg text-white font-normal no-underline"
            >
              <span className="bx bx-arrow-back"></span> Kembali
            </Link>
          </li>
          <li className="text-xs">
            <Link href={"/dashboard"}>Dashboard</Link>
          </li>
          <li className="text-xs">
            <Link href={"/dashboard/managemen-user/usergroup"}>Usergroup</Link>
          </li>
          <li className="text-xs">
            <Link href={pathname}>Set Modul {usergroupName}</Link>
          </li>
        </ul>
      </div>

      {/* Search */}
      <div className="mt-2 flex flex-wrap gap-4">
        <span className="font-normal text-black">
          Atur modul yang dapat diakses oleh grup <b>{usergroupName}</b>
        </span>
        <hr className="my-4" />
        <input
          type="text"
          placeholder="Cari modul..."
          className="input w-full bg-white mb-4 input-md shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Content - Table modul */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        {/* Table modul */}
        <div className="col-span-3">
          <DataTable
            columns={columns}
            data={usergroup || []}
            searchQuery={searchTerm}
            isLoading={isLoading || isLoadingSubmit}
            refetch={refetch}
            catchChangedModul={catchChangedModul}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
