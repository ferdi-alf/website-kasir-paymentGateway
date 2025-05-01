"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

const NavbarAvatar = () => {
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    role: string;
    image: string;
  } | null>(null);
  const toggleDropdown = () => setDropdown((prev) => !prev);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/user/me", { method: "GET" }); // Lebih baik endpoint user sendiri
      const data = await res.json();
      setUser(data);
    };

    getUser();
  }, []);

  console.log("user", user);

  return (
    <div className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded={dropdown}
      >
        <span className="sr-only">Open user menu</span>
        <Image
          height={80}
          width={80}
          src={user?.image || "/default-avatar.png"} // ganti dengan gambar asli kamu
          className="w-8 h-8 rounded-full"
          alt="user photo"
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 top-12 z-50 ${
          dropdown ? "block" : "hidden"
        } w-56 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600`}
      >
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white">
            {user?.username}
          </span>
        </div>
        <ul className="py-2" aria-labelledby="user-menu-button">
          <li>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarAvatar;
