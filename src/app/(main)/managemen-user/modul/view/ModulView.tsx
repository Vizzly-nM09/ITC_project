"use client";
import { useNotifikasi } from "@/store/useNotifikasi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { columns } from "../columns";
import SelectSearch from "@/components/SelectSearch";
import { useDebounce } from "use-debounce";
import { useConfirmation } from "@/store/useConfirmationBox";
import { useModulData } from "@/hooks/modul/useModulData";
import { ModulAlternateType } from "@/types/ModulAlternateType";
import { useCreateModul } from "@/hooks/modul/useCreateModul";
import { useEditModul } from "@/hooks/modul/useEditModul";
import { useDeleteModul } from "@/hooks/modul/useDeleteModul";

export default function ModulView() {
  const pathname = usePathname();
  const showNotification = useNotifikasi.getState().show;
  const showConfirmation = useConfirmation.getState().show;
  const { data: session, status }: { data: any; status: string } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchModulQuery, setSearchModulQuery] = useState("");
  const [debouncedSearchModulQuery] = useDebounce(searchModulQuery, 500);
  const [modul, setModul] = useState({
    id: "",
    nama: "",
    link: "",
    icon: "",
    jenis: "",
    urutan: "",
  });
  const [modulOptions, setModulOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Get data modul
  const { data, isLoading, refetch } = useModulData(
    session.user?.accessToken,
    status
  );
  // Mutation create user
  const { mutate: createModulMutation } = useCreateModul(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil menambahkan modul",
      });
      refetch();
      setModul({ nama: "", link: "", icon: "", jenis: "", urutan: "", id: "" });
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
  const { mutate: updateModulMutation } = useEditModul(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil mengedit modul",
      });
      refetch();
      setModul({ nama: "", link: "", icon: "", jenis: "", urutan: "", id: "" });
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
  const { mutate: deleteModulMutation } = useDeleteModul(
    () => {
      showNotification({
        status: "text-green-500",
        icon: "bx bx-check text-2xl",
        header: "Berhasil",
        message: "Berhasil menghapus modul",
      });
      refetch();
      setModul({ nama: "", link: "", icon: "", jenis: "", urutan: "", id: "" });
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
      ? createModulMutation({
          token: session.user?.accessToken,
          modul: {
            modul_name: modul.nama,
            modul_link: modul.link,
            modul_icon: modul.icon,
            modul_main_menu: Number(modul.jenis),
            modul_urutan: Number(modul.urutan),
          },
        })
      : updateModulMutation({
          token: session.user?.accessToken,
          modul: {
            modul_id: Number(modul.id),
            modul_name: modul.nama,
            modul_link: modul.link,
            modul_icon: modul.icon,
            modul_main_menu: Number(modul.jenis),
            modul_urutan: Number(modul.urutan),
          },
        });
  };
  // Open editing state
  const handleEdit = (data: ModulAlternateType) => {
    setIsEditing(true);
    setModul({
      id: String(data.modul_id),
      nama: data.modul_name,
      icon: data.modul_icon,
      link: data.modul_link,
      jenis: String(data.modul_main_menu),
      urutan: String(data.modul_urutan),
    });
  };
  // Handle delete
  const handleDelete = (data: ModulAlternateType) => {
    showConfirmation({
      title: "Hapus modul?",
      message:
        "Modul ini akan dihapus dari sistem dan tidak dapat dikembalikan. Lanjut hapus?",
      icon: "trash",
      confirmButtonText: "Hapus",
      confirmButtonColor: "bg-red-600",
      onConfirm() {
        deleteModulMutation({
          token: session.user?.accessToken,
          modulId: data.modul_id,
        });
      },
    });
  };

  // Filter modul
  useEffect(() => {
    if (!data) return;

    const search = debouncedSearchModulQuery.toLowerCase();

    const filtered = (data.mainMenuList || []).filter(
      (modul: ModulAlternateType) =>
        modul.modul_name.toLowerCase().includes(search)
    );

    setModulOptions([
      {
        value: "0",
        label: "Main menu",
      },
      ...filtered.map((modul: ModulAlternateType) => ({
        value: modul.modul_id,
        label: `Sub modul ${modul.modul_name}`,
      })),
    ]);
  }, [data, debouncedSearchModulQuery]);

  console.log("modul:", modul);

  return (
    <div className="px-8 py-4">
      <h1 className="w-full text-4xl font-bold text-black">Modul</h1>

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
            <Link href={pathname}>Modul</Link>
          </li>
        </ul>
      </div>

      {/* Search */}
      <div className="mt-2 flex flex-wrap gap-4">
        <span className="font-normal text-black">
          Modul untuk manajemen modul SIM Admisi
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

      {/* Main Content - Table modul dan form modul */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        {/* Table modul */}
        <div className="col-span-2">
          <DataTable
            columns={columns}
            data={data?.modulData || []}
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
            <h2 className="text-l font-bold mb-4">
              {isEditing ? "Ubah" : "Tambah"} Modul
            </h2>

            <form id="form" onSubmit={handleSubmit}>
              {/* Nama modul */}
              <div className="form-control">
                <label className="label" htmlFor="namaModul">
                  <span className="label-text text-black font-medium text-sm">
                    Nama Modul <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="namaModul"
                  id="namaModul"
                  className="input input-bordered input-sm bg-white text-black"
                  placeholder="Nama modul"
                  value={modul.nama}
                  onChange={(e) => setModul({ ...modul, nama: e.target.value })}
                  required
                />
              </div>

              {/* Link modul */}
              <div className="form-control">
                <label className="label" htmlFor="linkModul">
                  <span className="label-text text-black font-medium text-sm">
                    Link Modul <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="linkModul"
                  id="linkModul"
                  className="input input-bordered input-sm bg-white text-black"
                  placeholder="Link modul"
                  value={modul.link}
                  onChange={(e) => setModul({ ...modul, link: e.target.value })}
                  required
                />
              </div>

              {/* Icon modul */}
              <div className="form-control">
                <label className="label" htmlFor="iconModul">
                  <span className="label-text text-black font-medium text-sm">
                    Icon Modul <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="iconModul"
                  id="iconModul"
                  className="input input-bordered input-sm bg-white text-black"
                  placeholder="Icon modul"
                  value={modul.icon}
                  onChange={(e) => setModul({ ...modul, icon: e.target.value })}
                  required
                />
                <small>
                  Referensi icon dapat dilihat{" "}
                  <Link
                    href="https://v2.boxicons.com/"
                    className="text-yellow-500"
                  >
                    disini
                  </Link>
                  .
                </small>
              </div>

              {/* Urutan modul */}
              <div className="form-control">
                <label className="label" htmlFor="urutanModul">
                  <span className="label-text text-black font-medium text-sm">
                    Urutan Modul <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="urutanModul"
                  id="urutanModul"
                  className="input input-bordered input-sm bg-white text-black"
                  placeholder="Urutan modul"
                  value={modul.urutan}
                  onChange={(e) =>
                    setModul({ ...modul, urutan: e.target.value })
                  }
                  required
                />
              </div>

              {/* Jenis modul */}
              <div className="form-control">
                <label className="label" htmlFor="namaUser">
                  <span className="label-text  text-black font-medium text-sm">
                    Jenis modul <span className="text-red-500">*</span>
                  </span>
                </label>
                <SelectSearch
                  data={modulOptions || []}
                  fieldName="Modul"
                  placeholder="Pilih jenis modul..."
                  defaultEmptyValue={{
                    value: "",
                    label: "Pilih jenis modul...",
                  }}
                  value={modul.jenis}
                  setValue={(data) => {
                    setModul((prev) => ({ ...prev, jenis: data }));
                  }}
                  isLoading={isLoading}
                  searchQuery={searchModulQuery}
                  setSearchQuery={(data) => setSearchModulQuery(data)}
                />
              </div>

              {/* Tombol simpan dan reset */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setModul({
                      id: "",
                      nama: "",
                      link: "",
                      icon: "",
                      jenis: "",
                      urutan: "",
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
