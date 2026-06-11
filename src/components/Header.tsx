"use client";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTheme } from "@/app/ThemeContext";
const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { data: session, status }: { data: any; status: string } = useSession();
  const { toggleTheme } = useTheme();
  return (
    <div>
      <header className="text-gray-600 body-font">
        <div className="flex flex-wrap px-5 py-2 flex-row items-center justify-end">
          <button
            className="block md:hidden order-first"
            onClick={toggleSidebar}
          >
            <span className="bx bx-menu text-3xl text-black dark:text-white"></span>
          </button>
          <a className="flex flex-1 flex-row space-x-10 title-font font-medium items-center text-gray-900items-center justify-center mb-4 md:mb-0 md:hidden dark:hidden">
            <Image
              className="h-7 w-auto"
              src="/logo/logo-uib.png"
              width={25}
              height={25}
              alt="UIB"
              unoptimized
            />
          </a>
          <a className="flex flex-1 hidden dark:flex dark:sm:hidden flex-row space-x-10 title-font font-medium items-center text-gray-900items-center justify-center mb-4 sm:mb-0 sm:hidden">
            <Image
              className="h-7 w-auto"
              src="/logo/logo-uib-putih.png"
              width={25}
              height={25}
              alt="UIB"
              unoptimized
            />
          </a>
          <div className="inline-flex flex-row items-center justify-end end ml-5 lg:ml-0">
            <div className="relative inline-block dropdown">
              <button
                role="button"
                className="relative z-10 block p-2 text-gray-700 bg-transparent border border-transparent rounded-md dark:text-white"
              >
                <svg
                  className="h-7 w-auto text-gray-800 dark:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C10.8954 22 10 21.1046 10 20H14C14 21.1046 13.1046 22 12 22ZM20 19H4V17L6 16V10.5C6 7.038 7.421 4.793 10 4.18V2H13C12.3479 2.86394 11.9967 3.91762 12 5C12 5.25138 12.0187 5.50241 12.056 5.751H12C10.7799 5.67197 9.60301 6.21765 8.875 7.2C8.25255 8.18456 7.94714 9.33638 8 10.5V17H16V10.5C16 10.289 15.993 10.086 15.979 9.9C16.6405 10.0366 17.3226 10.039 17.985 9.907C17.996 10.118 18 10.319 18 10.507V16L20 17V19ZM17 8C16.3958 8.00073 15.8055 7.81839 15.307 7.477C14.1288 6.67158 13.6811 5.14761 14.2365 3.8329C14.7919 2.5182 16.1966 1.77678 17.5954 2.06004C18.9942 2.34329 19.9998 3.5728 20 5C20 6.65685 18.6569 8 17 8Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
              <NotificationDropdown />
            </div>
            <span className="text-neutral-900 dark:text-white font-normal hidden sm:flex">
              {session?.user?.nama == null ? (
                <>
                  <div className="skeleton h-5 w-36"></div>
                </>
              ) : (
                session?.user?.nama || "Nama tidak diketahui"
              )}
            </span>
            <div className="relative inline-block dropdown">
              <button
                role="button"
                className="relative z-10 block p-2 text-gray-700 bg-transparent border border-transparent rounded-md dark:text-white"
              >
                <div className="flex items-center gap-x-6">
                  <Image
                    className="object-cover h-8 w-8 rounded-full"
                    src={session?.user?.avatar || "/logo/user.png"}
                    alt="Staf UIB"
                    width={300}
                    height={300}
                    unoptimized
                  />
                </div>
              </button>
              <ProfileDropdown />
            </div>
            {/* <label className="swap swap-rotate">
              <input type="checkbox" onClick={toggleTheme} />

              <svg
                className="swap-off h-8 w-8 fill-black dark:fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              <svg
                className="swap-on h-8 w-8 fill-black dark:fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label> */}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
