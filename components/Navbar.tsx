"use client";

import { login, logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({ session }: { session: Session | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 relative z-50">
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link href={"/"} className="flex items-center">
          <Image src={"/logo.png"} alt="logo" width={40} height={40} />
          <span className="ml-2 text-xl font-bold text-gray-800">
            Travel Planner
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          {session ? (
            <>
              <Link
                href={"/trips"}
                className="text-slate-900 hover:text-sky-500"
              >
                My Trips
              </Link>
              <Link
                href={"/globe"}
                className="text-slate-900 hover:text-sky-500"
              >
                Globe
              </Link>
              <button
                className="flex items-center bg-red-600 hover:bg-red-800 text-sm text-white px-3 py-2 rounded-sm cursor-pointer"
                onClick={logout}
              >
                <LogOut width={18} className="mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="flex items-center border-2 hover:bg-gray-200 px-3 py-2 rounded-sm cursor-pointer"
              onClick={login}
            >
              Sign In
              {/* Google SVG */}
              <svg
                className="w-6 h-6 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="#4285F4"
                  d="M488 261.8c0-17.5-1.4-34.1-4.1-50.4H249v95.3h134.4c-5.8 31.1-23.2 57.4-49.6 75v62.5h80.1c46.9-43.2 73.1-106.9 73.1-182.4z"
                />
                <path
                  fill="#34A853"
                  d="M249 492c66.9 0 123-22.1 164-60l-80.1-62.5c-22.2 15-50.5 24-83.9 24-64.6 0-119.3-43.6-138.9-102.1H29v64.2C70 445 152.6 492 249 492z"
                />
                <path
                  fill="#FBBC05"
                  d="M110.1 291.4c-4.7-15-7.4-30.9-7.4-47.4s2.7-32.4 7.4-47.4V132.4H29C10.5 170.3 0 209.8 0 249s10.5 78.7 29 116.6l81.1-62.2z"
                />
                <path
                  fill="#EA4335"
                  d="M249 97.2c36.4 0 69.2 12.5 95.1 36.9l71.2-71.2C372 24.5 315.9 0 249 0 152.6 0 70 47 29 132.4l81.1 62.2c19.6-58.5 74.3-97.4 138.9-97.4z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-sm hover:bg-gray-100"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile side drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            className="p-2 rounded-sm hover:bg-gray-200"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu links */}
        <div className="flex flex-col space-y-4 px-6">
          {session ? (
            <>
              <Link
                href={"/trips"}
                className="text-slate-900 hover:text-sky-500"
                onClick={() => setMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link
                href={"/globe"}
                className="text-slate-900 hover:text-sky-500"
                onClick={() => setMenuOpen(false)}
              >
                Globe
              </Link>
              <button
                className="flex items-center bg-red-600 hover:bg-red-800 text-sm text-white px-3 py-2 rounded-sm cursor-pointer"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                <LogOut width={18} className="mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="flex items-center border-2 hover:bg-gray-200 px-3 py-2 rounded-sm cursor-pointer"
              onClick={() => {
                login();
                setMenuOpen(false);
              }}
            >
              Sign In
              <svg
                className="w-6 h-6 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="#4285F4"
                  d="M488 261.8c0-17.5-1.4-34.1-4.1-50.4H249v95.3h134.4c-5.8 31.1-23.2 57.4-49.6 75v62.5h80.1c46.9-43.2 73.1-106.9 73.1-182.4z"
                />
                <path
                  fill="#34A853"
                  d="M249 492c66.9 0 123-22.1 164-60l-80.1-62.5c-22.2 15-50.5 24-83.9 24-64.6 0-119.3-43.6-138.9-102.1H29v64.2C70 445 152.6 492 249 492z"
                />
                <path
                  fill="#FBBC05"
                  d="M110.1 291.4c-4.7-15-7.4-30.9-7.4-47.4s2.7-32.4 7.4-47.4V132.4H29C10.5 170.3 0 209.8 0 249s10.5 78.7 29 116.6l81.1-62.2z"
                />
                <path
                  fill="#EA4335"
                  d="M249 97.2c36.4 0 69.2 12.5 95.1 36.9l71.2-71.2C372 24.5 315.9 0 249 0 152.6 0 70 47 29 132.4l81.1 62.2c19.6-58.5 74.3-97.4 138.9-97.4z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Overlay behind drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}
