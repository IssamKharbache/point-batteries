import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center  container mx-auto p-8 space-y-12 rounded ">
      <Image
        src="/access-denied.png"
        alt="No access"
        width={500}
        height={500}
        className="w-36"
      />
      <h1 className="text-6xl font-semibold justify-start mt-4 ">Désolé</h1>
      <p className="text-center text-md">
        Vous n&apos;avez pas les autorisations nécessaires pour accéder à cette
        page
      </p>
      <Link href="/" className="">
        <Button className="text-xl p-6">Accueil</Button>
      </Link>
    </div>
  );
};

export default Unauthorized;
