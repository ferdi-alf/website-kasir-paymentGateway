/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import NavbarAvatar from "./Avatar";
import { useEffect, useState } from "react";
import { Avatar, Skeleton } from "@mui/material";
import { usePathname } from "next/navigation";

const Active = ["/"];

const Navbar = () => {
  const [session, setSession] = useState<null | { user: any }>(null);
  const [loading, setLoading] = useState(true);
  const pasthName = usePathname();

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setSession(data); // Bisa null kalau belum login
      } catch (error) {
        console.error("Failed to fetch session", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return (
    <div className="w-full bg-white shadow-md">
      <nav className="bg-green-600 border-gray-200 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              height={100}
              width={100}
              className="rounded-full h-10 w-10"
              src={"/images/logo.jpg"}
              alt="logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Bayar.id
            </span>
          </a>

          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium  justify-center items-center flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
              <li>
                <Link
                  href="/"
                  className={`${
                    Active.includes(pasthName) &&
                    "underline decoration-green-300 underline-offset-8"
                  } font-semibold py-2 px-3 text-white  rounded-sm md:bg-transparent  md:p-0 `}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              {loading ? (
                <Skeleton variant="circular">
                  <Avatar />
                </Skeleton>
              ) : !session?.user ? (
                <Link
                  href={"/login"}
                  className="bg-white text-green-500 border border-green-500 font-semibold p-2 rounded-md"
                >
                  Login
                </Link>
              ) : (
                <NavbarAvatar />
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
