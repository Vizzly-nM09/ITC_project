import { HasilUSMType } from "@/types/HasilUSMTypes";

interface HasilUSMCardProps {
  mahasiswa: HasilUSMType;
}

export default function HasilUSMCard({ mahasiswa }: HasilUSMCardProps) {
  // Status ujian
  const statusUjian = mahasiswa.WaktuSelesai ? "Selesai" : "Sedang Ujian";

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header dengan Nomor Daftar dan Status Badge */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-sm font-medium text-gray-500 block mb-1">
              Nomor Daftar
            </span>
            <h3 className="text-xl font-bold text-gray-900">
              {mahasiswa.NomorDaftar}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                statusUjian === "Selesai"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {statusUjian}
            </span>
            {mahasiswa.CanReset === "y" && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                Dapat Reset
              </span>
            )}
          </div>
        </div>

        {/* Nama Mahasiswa dengan garis pemisah */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-500 block mb-1">
            Nama Mahasiswa
          </span>
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">
            {mahasiswa.NamaMaba}
          </h2>
        </div>

        {/* Informasi Ujian dalam grid 2 kolom */}
        <div className="space-y-4">
          {/* Baris 1: Mulai Ujian */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-4">
              <span className="text-sm font-medium text-gray-500">
                Mulai Ujian
              </span>
            </div>
            <div className="col-span-8">
              {mahasiswa.WaktuMulai ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-gray-900 font-medium">
                    {new Date(mahasiswa.WaktuMulai).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 font-medium">-</p>
              )}
            </div>
          </div>

          {/* Baris 2: Selesai Ujian */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-4">
              <span className="text-sm font-medium text-gray-500">
                Selesai Ujian
              </span>
            </div>
            <div className="col-span-8">
              {mahasiswa.WaktuSelesai ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <p className="text-gray-900 font-medium">
                    {new Date(mahasiswa.WaktuSelesai).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 font-medium">Masih berlangsung</p>
              )}
            </div>
          </div>

          {/* Baris 3: Durasi atau Status Berlangsung */}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-4">
              <span className="text-sm font-medium text-gray-500">
                {mahasiswa.WaktuSelesai ? "Durasi Ujian" : "Status"}
              </span>
            </div>
            <div className="col-span-8">
              {mahasiswa.WaktuSelesai ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                  <p className="text-gray-900 font-medium">
                    {(() => {
                      const start = new Date(mahasiswa.WaktuMulai);
                      const end = new Date(mahasiswa.WaktuSelesai);
                      const diffInMinutes = Math.floor(
                        (end.getTime() - start.getTime()) / (1000 * 60)
                      );

                      if (diffInMinutes < 60) {
                        return `${diffInMinutes} menit`;
                      } else {
                        const jam = Math.floor(diffInMinutes / 60);
                        const menit = diffInMinutes % 60;
                        return `${jam} jam ${menit} menit`;
                      }
                    })()}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <p className="text-blue-600 font-medium">
                    Ujian sedang berlangsung...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tombol Reset Ujian */}
        {mahasiswa.CanReset === "y" && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg">
              Reset Ujian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
