import { DetailGelombangType } from "@/types/DetailGelombangTypes";
import { IndonesianCurrency } from "@/utils/IndonesianCurrency";
import { IndonesianDateFormat } from "@/utils/IndonesianDateFormat";
import { ucFirst } from "@/utils/UcFirst";
import { on } from "events";
import {
  BadgeCheck,
  Calendar,
  ChevronDown,
  Clock,
  Info,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

export default function GelombangPendaftaranCard({
  data,
  handleEdit: onEdit,
  handleDelete: onDelete,
}: {
  data: DetailGelombangType;
  handleEdit?: (data: DetailGelombangType) => void;
  handleDelete?: (data: DetailGelombangType) => void;
}) {
  const gelombang = data;

  const [expanded, setExpanded] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
    setTimeout(() => {
      if (!expanded && detailRef.current) {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 200);
  };
  return (
    <>
      <section className="relative rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm hover:shadow-lg transition-shadow">
        {/* Accent Line */}
        <div className="absolute left-0 top-0 h-full w-1 bg-[#151743] rounded-l-xl" />

        {/* Top */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {ucFirst(gelombang.NamaPeriode)} · {gelombang.NamaGelombang}
            </h2>

            <span className="text-sm font-medium text-[#F3B800]">
              {ucFirst(gelombang.jenis_pendaftaran)}
            </span>
          </div>

          <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-1">
            <span className="inline-flex items-center rounded-full bg-amber-100 text-[#F3B800] border border-amber-200 px-3 py-1 text-xs font-semibold">
              {gelombang.jenjang_gelombang}
            </span>

            <span className="text-xs text-slate-500 font-medium">
              {gelombang.IsBeasiswa === "y" ? "Beasiswa" : "Reguler"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-slate-100" />

        {/* Info */}
        <dl className="grid gap-y-2 gap-x-6 text-sm md:grid-cols-2">
          <div className="flex gap-2">
            <dt className="w-28 text-slate-500 font-medium">Pendaftaran</dt>
            <dd className="text-slate-900 font-semibold">
              {IndonesianDateFormat(gelombang.mulai_daftar)}
            </dd>
          </div>

          <div className="flex gap-2">
            <dt className="w-28 text-slate-500 font-medium">USM</dt>
            <dd className="text-slate-900 font-semibold">
              {IndonesianDateFormat(gelombang.tanggal_ujian)}
            </dd>
          </div>

          <div className="flex gap-2">
            <dt className="w-28 text-slate-500 font-medium">Pengumuman</dt>
            <dd className="text-slate-900 font-semibold">
              {IndonesianDateFormat(gelombang.tanggal_pengumuman)}
            </dd>
          </div>

          <div className="flex gap-2">
            <dt className="w-28 text-slate-500 font-medium">Lokasi</dt>
            <dd className="text-slate-900 font-semibold">
              {gelombang.LokasiNama}
            </dd>
          </div>
        </dl>

        {/* Footer */}
        <div className="mt-5 flex justify-between items-center">
          {/* Expand Button */}
          <button
            onClick={toggleExpand}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#F3B800] transition"
          >
            <span>{expanded ? "Sembunyikan detail" : "Lihat detail"}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              className="rounded-md p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-colors focus:ring-2 focus:ring-amber-200"
              onClick={() => onEdit && onEdit(gelombang)}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              className="rounded-md p-2 hover:text-red-600 hover:bg-red-50 transition-colors focus:ring-2 focus:ring-red-200 text-red-500"
              onClick={() => onDelete && onDelete(gelombang)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Expanded Section */}
        <div
          ref={detailRef}
          className={`overflow-hidden transition-all duration-500 ${
            expanded
              ? "max-h-[500px] opacity-100 mt-4 bg-amber-50 p-4 rounded-lg border border-amber-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="text-sm space-y-3">
            {/* Verifikasi */}
            <div className="flex items-start gap-2">
              <BadgeCheck className="h-4 w-4 text-amber-600" />
              <p className="font-medium text-slate-900">
                Verivikasi daftar ulang :
                <span className="ml-1 font-normal text-slate-700">
                  {IndonesianDateFormat(gelombang.mulai_verifikasi)} -
                  {IndonesianDateFormat(gelombang.akhir_verifikasi)}
                </span>
              </p>
            </div>

            {/* Daftar Ulang */}
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <p className="font-medium text-slate-900">
                Tanggal daftar ulang :
                <span className="ml-1 font-normal text-slate-700">
                  {IndonesianDateFormat(gelombang.tanggal_daftar_ulang)}
                </span>
              </p>
            </div>

            {/* Jam Ujian */}
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <p className="font-medium text-slate-900">
                Jam Ujian:
                <span className="ml-1 font-normal text-slate-700">
                  {gelombang.jam_mulai_ujian} - {gelombang.jam_akhir_ujian} WIB
                </span>
              </p>
            </div>

            {/* Lokasi Detail */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-amber-600" />
              <p className="font-medium text-slate-900">
                Lokasi Ujian:
                <span className="ml-1 font-normal text-slate-700">
                  {gelombang.LokasiNama}
                </span>
              </p>
            </div>

            {/* Chip Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {gelombang.IsBeasiswa === "y" && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  Program Beasiswa
                </span>
              )}
              <span className="px-2.5 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-medium">
                {gelombang.jenjang_gelombang}
              </span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-slate-200 text-slate-700 font-medium">
                {gelombang.NamaGelombang}
              </span>
            </div>
          </div>
        </div>

        {/* Biaya Pendaftaran */}
        <div className="flex items-start gap-2 mt-4 border-t pt-4">
          <Info className="h-4 w-4 text-amber-600 mt-1" />
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Biaya Pendaftaran
            </p>

            <p className="text-2xl font-semibold text-slate-900 leading-tight">
              {gelombang.biaya_formulir
                ? IndonesianCurrency(gelombang.biaya_formulir)
                : "Tidak tersedia"}
            </p>

            {gelombang.biaya_formulir !== 0 && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
                Per gelombang
              </span>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
