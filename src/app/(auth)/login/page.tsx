"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useNotifikasi } from "@/store/useNotifikasi";
import TopNavbarLogin from "@/components/layout/TopNavbarLogin";
import ContactUsLogin from "@/components/layout/ContactUsLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const { replace } = useRouter();
  const showNotification = useNotifikasi.getState().show;
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "" || password === "") {
      showNotification({
        status: "text-yellow-500",
        icon: "bx bx-error text-2xl",
        header: "Data tidak lengkap",
        message: "Email dan password harus diisi",
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
        asal_sistem: "it_center",
      });
      setIsLoading(false);
      if (!res?.error) {
        setSuccess(true);
        showNotification({
          status: "text-green-500",
          icon: "bx bx-check text-2xl",
          header: "Login berhasil",
          message: "Mengarahkan ke dashboard...",
        });

        if (callbackUrl) {
          replace(callbackUrl);
        } else {
          replace(`/dashboard`);
        }
      } else {
        showNotification({
          status: "text-red-500",
          icon: "bx bx-error text-2xl",
          header: "Login gagal",
          message: res.error || "Email atau password salah",
        });
      }
    } catch (error) {
      setIsLoading(false);
      showNotification({
        status: "text-red-500",
        icon: "bx bx-error text-2xl",
        header: "Terjadi kesalahan",
        message: "Silahkan coba lagi nanti",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] dark:bg-[#212121] px-4 md:px-10 py-6">
      <div className="w-full">
        <TopNavbarLogin />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="rounded-2xl shadow-xl p-6 md:p-8 bg-white dark:bg-[#171717] w-full max-w-md relative">
          <div className="flex flex-row items-center justify-between mb-8">
            <h1 className="font-bold text-2xl text-neutral-900 dark:text-white">
              Masuk
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Masukkan email Anda"
                type="text"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-8">
              <Label htmlFor="password">Password</Label>
              <div className="relative w-full">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'} text-xl`}></i>
                </button>
              </div>
            </LabelInputContainer>

            
            <button
              className={`flex flex-row items-center border-none justify-center btn btn-block rounded-lg bg-[#2A3955] text-[#F8B600] ${
                isLoading ? "cursor-not-allowed" : ""
              } hover:bg-[#1f2a40] hover:text-white py-3`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="bx bx-loader bx-spin mr-2 text-lg"></span>{" "}
                  Memuat...
                </>
              ) : (
                <>
                  {!isSuccess ? (
                    <span className="font-semibold text-base">
                      Masuk &rarr;
                    </span>
                  ) : (
                    <>
                      <span className="bx bx-loader bx-spin mr-2 text-lg"></span>{" "}
                      Berhasil
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-10 border-t border-gray-100 dark:border-gray-800 pt-6">
            <ContactUsLogin />
          </div>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
