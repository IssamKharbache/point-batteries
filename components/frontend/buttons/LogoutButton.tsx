"use client";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center justify-center m-auto w-full h-26 border-t border-gray-400 hover:bg-lightBlack py-5"
    >
      Deconnexion
    </button>
  );
};

export default LogoutButton;
