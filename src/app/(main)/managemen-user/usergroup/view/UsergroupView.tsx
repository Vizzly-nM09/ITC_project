"use client";
import { useNotifikasi } from "@/store/useNotifikasi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { columns } from "../columns";
import { useDebounce } from "use-debounce";
import { useConfirmation } from "@/store/useConfirmationBox";
import { useUsergroupData } from "@/hooks/Usergroup/useUsergroupData";
import { UsergroupType } from "@/types/UsergroupTypes";
import { useCreateUsergroup } from "@/hooks/Usergroup/useCreateUsergroup";
import { useEditUsergroup } from "@/hooks/Usergroup/useEditUsergroup";
import { useDeleteUsergroup } from "@/hooks/Usergroup/useDeleteUsergroup";

export default function UsergroupView() {
  const pathname = usePathname();
  const showNotification = useNotifikasi.getState().show;
  const showConfirmation = useConfirmation.getState().show;
  const { data: session, status }: { data: any; status: string } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchUsergroupQuery, setSearchUsergroupQuery] = useState("");
  const [debouncedSearchUsergroupQuery] = useDebounce(
    searchUsergroupQuery,
    500
  );
  const [usergroup, setUsergroup] = useState({
    id: "",
    nama: "",
    level: "",
    keterangan: "",
  });

  // Get data usergroup
  const { data, isLoading, refetch } = useUsergroupData(
    session.user?.accessToken,
    status
  );
  // Mutation create usergroup
  const { mutate: createUsergroupMutation } = useCreateUsergroup(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil menambahkan usergroup",
      });
      refetch();
      setUsergroup({ nama: "", level: "", keterangan: "", id: "" });
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
  const { mutate: updateUsergroupMutation } = useEditUsergroup(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil mengedit usergroup",
      });
      refetch();
      setUsergroup({ nama: "", level: "", keterangan: "", id: "" });
      setIsEditing(false);
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
  const { mutate: deleteUsergroupMutation } = useDeleteUsergroup(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil menghapus usergroup",
      });
      refetch();
      setUsergroup({ nama: "", level: "", keterangan: "", id: "" });
      setSearchTerm("");
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(isEditing);

    !isEditing
      ? createUsergroupMutation({
          token: session.user?.accessToken,
          usergroup: {
            group_name: usergroup.nama,
            group_level: usergroup.level,
            keterangan_group: usergroup.keterangan,
          },
        })
      : updateUsergroupMutation({
          token: session.user?.accessToken,
          usergroup: {
            group_id: usergroup.id,
            group_name: usergroup.nama,
            group_level: usergroup.level,
            keterangan_group: usergroup.keterangan,
          },
        });
  };
  // Open editing state
  const handleEdit = (data: UsergroupType) => {
    setIsEditing(true);
    setUsergroup({
      id: data.group_id,
      nama: data.group_name,
      level: data.group_level,
      keterangan: data.keterangan_group,
    });
  };
  // Handle delete
  const handleDelete = (data: UsergroupType) => {
    showConfirmation({
      title: "Hapus Usergroup?",
      message:
        "Usergroup ini akan dihapus dari sistem dan tidak dapat dikembalikan. Lanjut hapus?",
      icon: "trash",
      confirmButtonText: "Hapus",
      confirmButtonColor: "bg-red-600",
      onConfirm() {
        deleteUsergroupMutation({
          token: session.user?.accessToken,
          usergroupId: data.group_id,
        });
      },
    });
  };

  // Filter usergroup
  useEffect(() => {
    if (!data) return;

    const search = debouncedSearchUsergroupQuery.toLowerCase();

    const filtered = (data.mainMenuList || []).filter(
      (usergroup: UsergroupType) =>
        usergroup.group_name.toLowerCase().includes(search)
    );
  }, [data, debouncedSearchUsergroupQuery]);

  return (
    <div className="px-8 py-4">
      <h1 className="w-full text-4xl font-bold text-black">Usergroup</h1>

      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm text-black">
        <ul>
          <li>
            <Link
              href={`/dashboard`}
              className="btn bg-black btn-xs rounded-lg text-white font-normal no-underline"
            >
              <span className="bx bx-arrow-back"></span> Kembali
            </Link>
          </li>
          <li className="text-xs">
            <Link href={"/dashboard"}>Dashboard</Link>
          </li>
          <li className="text-xs">
            <Link href={pathname}>Usergroup</Link>
          </li>
        </ul>
      </div>

      {/* Search */}
      <div className="mt-2 flex flex-wrap gap-4">
        <span className="font-normal text-black">
          Modul untuk manajemen usergroup SIM Admisi
        </span>
        <hr className="my-4" />
        <input
          type="text"
          placeholder="Cari usergroup..."
          className="input w-full bg-white mb-4 input-md shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Content - Table modul dan form modul */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        {/* Table modul */}
        <div className="col-span-2">
          <DataTable
            columns={columns}
            data={data || []}
            searchQuery={searchTerm}
            isLoading={isLoading}
            refetch={refetch}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>

        {/* Form usergroup */}
        <div className="col-span-1">
          <div className="w-full card h-auto bg-white text-black p-4 shadow">
            <h2 className="text-l font-bold mb-4">
              {isEditing ? "Ubah" : "Tambah"} Usergroup
            </h2>

            <form id="form" onSubmit={handleSubmit}>
              {/* Nama usergroup */}
              <div className="form-control">
                <label className="label" htmlFor="namaUsergroup">
                  <span className="label-text text-black font-medium text-sm">
                    Nama Usergroup <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="namaUsergroup"
                  id="namaUsergroup"
                  className="input input-bordered input-sm bg-white text-black"
                  placeholder="Nama usergroup"
                  value={usergroup.nama}
                  onChange={(e) =>
                    setUsergroup({ ...usergroup, nama: e.target.value })
                  }
                  required
                />
              </div>

              {/* Level usergroup */}
              <div className="form-control">
                <label className="label" htmlFor="level">
                  <span className="label-text text-black font-medium text-sm">
                    Level <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  name="level"
                  id="level"
                  className="select select-sm select-bordered bg-white text-black"
                  required
                  value={usergroup.level || ""}
                  onChange={(e) =>
                    setUsergroup({ ...usergroup, level: e.target.value })
                  }
                >
                  <option disabled value="">
                    Pilih level
                  </option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {/* Keterangan usergroup */}
              <div className="form-control">
                <label className="label" htmlFor="keterangan">
                  <span className="label-text text-black font-medium text-sm">
                    Keterangan <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  name="keterangan"
                  id="keterangan"
                  className="input input-bordered input-sm bg-white text-black"
                  placeholder="Keterangan usergroup"
                  value={usergroup.keterangan}
                  onChange={(e) =>
                    setUsergroup({ ...usergroup, keterangan: e.target.value })
                  }
                  required
                />
              </div>

              {/* Tombol simpan dan reset */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setUsergroup({
                      id: "",
                      nama: "",
                      level: "",
                      keterangan: "",
                    });
                  }}
                  className="btn btn-error btn-sm text-white"
                  type="reset"
                  disabled={isLoading}
                >
                  <span className="bx bx-refresh" />
                  Reset
                </button>
                <button
                  className="btn btn-success btn-sm text-white"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="bx bx-loader bx-spin"></span> Loading...
                    </>
                  ) : (
                    <>
                      <span className="bx bx-save" />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
