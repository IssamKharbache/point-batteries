"use client";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center justify-center m-auto w-full h-26 border-t border-slate-800 hover:bg-slate-800 py-5 duration-300"
    >
      Deconnexion
    </button>
  );
};

export default LogoutButton;
