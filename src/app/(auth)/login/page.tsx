"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Highlight } from "@/components/ui/hero-highlight";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useNotifikasi } from "@/store/useNotifikasi";
import TopNavbarLogin from "@/components/layout/TopNavbarLogin";
import WelcomeSectionLogin from "@/components/layout/WelcomeSectionLogin";
import ContactUsLogin from "@/components/layout/ContactUsLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const { replace } = useRouter();
  const showNotification = useNotifikasi.getState().show;
  const pathname = usePathname();
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
        asal_sistem: "admisi",
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
    <>
      <div className="flex flex-row flex-wrap items-start min-h-screen bg-[#F9F9F9] dark:bg-[#212121] pb-1 px-10 pt-10">
        <TopNavbarLogin />

        <WelcomeSectionLogin />

        <div className="md:-mt-24 rounded-2xl shadow-xl p-4 md:p-8 bg-white dark:bg-[#171717] w-full lg:w-96 relative">
          <div className="flex flex-row items-center justify-between">
            <h1 className="font-bold text-xl text-neutral-900 dark:text-white">
              Masuk
            </h1>
          </div>
          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
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
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                name="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white"
              />
            </LabelInputContainer>
            <div>
              <p className="text-sm text-neutral-900 dark:text-white text-end"></p>
            </div>
            <button
              className={`flex flex-row items-center border-none justify-center btn btn-block btn-sm rounded-lg bg-[#2A3955] text-[#F8B600] mb-3 ${
                isLoading ? "cursor-not-allowed" : ""
              } hover:bg-[#1f2a40] hover:text-white`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="bx bx-loader bx-spin"></span> Memuat...
                </>
              ) : (
                <>
                  {!isSuccess ? (
                    <>Masuk &rarr;</>
                  ) : (
                    <>
                      <span className="bx bx-loader bx-spin"></span> Berhasil
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <ContactUsLogin />
        </div>
      </div>
    </>
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
