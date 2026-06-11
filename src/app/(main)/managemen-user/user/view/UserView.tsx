"use client";
import { useNotifikasi } from "@/store/useNotifikasi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { columns } from "../columns";
import { UserType } from "@/types/UserTypes";
import { UsergroupType } from "@/types/UsergroupTypes";
import { useUserData } from "@/hooks/user/useUserData";
import { useUsergroupData } from "@/hooks/Usergroup/useUsergroupData";
import { usePegawaiData } from "@/hooks/pegawai/usePegawaiData";
import SelectSearch from "@/components/SelectSearch";
import { PegawaiType } from "@/types/PegawaiTypes";
import { useDebounce } from "use-debounce";
import { useCreateUser } from "@/hooks/user/useCreateUser";
import { useEditUser } from "@/hooks/user/useEditUser";
import { useDeleteUser } from "@/hooks/user/useDeleteUser";
import { useConfirmation } from "@/store/useConfirmationBox";

export default function UserView() {
  const pathname = usePathname();
  const showNotification = useNotifikasi.getState().show;
  const showConfirmation = useConfirmation.getState().show;
  const { data: session, status }: { data: any; status: string } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPegawaiQuery, setSearchPegawaiQuery] = useState("");
  const [debouncedSearchPegawaiQuery] = useDebounce(searchPegawaiQuery, 500);
  const [user, setUser] = useState({
    nama: "",
    email: "",
    nip: "",
    usergroup: "",
    isAktif: "",
  });
  const [pegawaiOptions, setPegawaiOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Get data user
  const { data, isLoading, refetch } = useUserData(
    session.user?.accessToken,
    status
  );
  // Get data usergroup
  const {
    data: dataUsergroup,
    isLoading: isLoadingUsergroup,
    refetch: refetchUsergroup,
  } = useUsergroupData(session.user?.accessToken, status);
  // Get data pegawai
  const {
    data: dataPegawai,
    isLoading: isLoadingPegawai,
    refetch: refetchPegawai,
  } = usePegawaiData(session.user?.accessToken, status);
  // Mutation create user
  const { mutate: createUserMutation } = useCreateUser(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil menambahkan pengguna",
      });
      refetch();
      setUser({ nama: "", email: "", nip: "", usergroup: "", isAktif: "" });
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
  const { mutate: updateUserMutation } = useEditUser(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil mengedit pengguna",
      });
      refetch();
      setUser({ nama: "", email: "", nip: "", usergroup: "", isAktif: "" });
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
  const { mutate: deleteUserMutation } = useDeleteUser(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil menghapus pengguna",
      });
      refetch();
      setUser({ nama: "", email: "", nip: "", usergroup: "", isAktif: "" });
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

    !isEditing
      ? createUserMutation({
          token: session.user?.accessToken,
          user: {
            username: user.nip,
            email: user.email,
            groupId: Number(user.usergroup),
            isAktif: user.isAktif,
          },
        })
      : updateUserMutation({
          token: session.user?.accessToken,
          user: {
            username: user.nip,
            email: user.email,
            groupId: Number(user.usergroup),
            isAktif: user.isAktif,
          },
        });
  };
  // Open editing state
  const handleEdit = (data: UserType) => {
    setIsEditing(true);
    setUser({
      nama: data.PegawaiName,
      email: data.Email,
      nip: data.Username,
      usergroup: String(data.GroupId),
      isAktif: data.IsAktif,
    });
  };
  // Handle delete
  const handleDelete = (data: UserType) => {
    showConfirmation({
      title: "Hapus pengguna?",
      message:
        "Pengguna ini akan dihapus dari sistem dan tidak dapat dikembalikan. Lanjut hapus?",
      icon: "trash",
      confirmButtonText: "Hapus",
      confirmButtonColor: "bg-red-600",
      onConfirm() {
        deleteUserMutation({
          token: session.user?.accessToken,
          userId: data.Username,
        });
      },
    });
  };

  // Filter pegawai
  useEffect(() => {
    if (!dataPegawai) return;

    const search = debouncedSearchPegawaiQuery.toLowerCase();

    const filtered = dataPegawai.filter((peg: PegawaiType) =>
      peg.PegawaiNama.toLowerCase().includes(search)
    );

    setPegawaiOptions(
      filtered.map((peg: PegawaiType) => ({
        value: peg.NipPegawai,
        label: peg.PegawaiNama,
      }))
    );
  }, [dataPegawai, debouncedSearchPegawaiQuery]);

  console.log("user:", user);

  return (
    <div className="px-8 py-4">
      <h1 className="w-full text-4xl font-bold text-black">User</h1>

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
            <Link href={pathname}>User</Link>
          </li>
        </ul>
      </div>

      {/* Search */}
      <div className="mt-2 flex flex-wrap gap-4">
        <span className="font-normal text-black">
          Modul untuk manajemen user internal SIM Admisi
        </span>
        <hr className="my-4" />
        <input
          type="text"
          placeholder="Cari user..."
          className="input w-full bg-white mb-4 input-md shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Content - Table user dan form user */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        {/* Table user */}
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

        {/* Form user */}
        <div className="col-span-1">
          <div className="w-full card h-auto bg-white text-black p-4 shadow">
            <h2 className="text-l font-bold">
              {isEditing ? "Ubah" : "Tambah"} User
            </h2>

            <form id="form" onSubmit={handleSubmit}>
              {/* Nama Pegawai */}
              <div className="form-control">
                <label className="label" htmlFor="namaUser">
                  <span className="label-text  text-black font-medium text-sm">
                    Pegawai <span className="text-red-500">*</span>
                  </span>
                </label>
                <SelectSearch
                  data={pegawaiOptions || []}
                  fieldName="Pegawai"
                  placeholder="Pilih pegawai..."
                  defaultEmptyValue={{ value: "", label: "Pilih pegawai..." }}
                  value={user.nip}
                  setValue={(data) => {
                    setUser((prev) => ({ ...prev, nip: data }));
                    const namaPegawai = pegawaiOptions.find(
                      (option) => option.value === data
                    )?.label;
                    setUser((prev) => ({ ...prev, nama: namaPegawai ?? "" }));
                  }}
                  isLoading={isLoadingPegawai}
                  searchQuery={searchPegawaiQuery}
                  setSearchQuery={(data) => setSearchPegawaiQuery(data)}
                />
              </div>

              {/* Email Pegawai */}
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text text-black font-medium text-sm">
                    Email <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="input input-bordered input-sm bg-white text-black"
                  placeholder="Email user"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>

              {/* Grup Pegawai */}
              <div className="form-control">
                <label className="label" htmlFor="hakAkses">
                  <span className="label-text text-black font-medium text-sm">
                    Usergroup <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  name="hakAkses"
                  id="hakAkses"
                  className="select select-sm select-bordered bg-white text-black"
                  required
                  value={user.usergroup || ""}
                  onChange={(e) =>
                    setUser({ ...user, usergroup: e.target.value })
                  }
                >
                  <option disabled value="">
                    Pilih usergroup
                  </option>
                  {(dataUsergroup || []).map((ug: UsergroupType) => (
                    <option key={ug.group_id} value={ug.group_id}>
                      {ug.group_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Pegawai */}
              <div className="form-control">
                <label className="label" htmlFor="status">
                  <span className="label-text text-black font-medium text-sm">
                    Status <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  name="status"
                  id="status"
                  className="select select-sm select-bordered bg-white text-black"
                  required
                  value={user.isAktif || ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      isAktif: e.target.value,
                    })
                  }
                >
                  <option disabled value="">
                    Pilih status
                  </option>
                  <option value="y">Aktif</option>
                  <option value="n">Tidak aktif</option>
                </select>
              </div>

              {/* Tombol simpan dan reset */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setUser({
                      email: "",
                      isAktif: "",
                      nama: "",
                      nip: "",
                      usergroup: "",
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
