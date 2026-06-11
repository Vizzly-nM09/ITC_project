export default function LoadingPermission() {
  return (
    <div>
      <main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl dark:text-gray-100">
            Memeriksa Hak Akses...
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8 dark:text-gray-400">
            Harap tunggu sejenak, kami sedang memverifikasi hak akses Anda.
          </p>
        </div>
      </main>
    </div>
  );
}
