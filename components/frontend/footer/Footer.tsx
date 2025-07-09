import React from "react";
import Link from "next/link";
import Image from "next/image";

import LogoWhite from "@/public//logo_white.svg";
interface FooterProps {
  username: string;
}
const Footer = ({ username }: FooterProps) => {
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  return (
    <section className="min-h-[430px] py-10 bg-black sm:pt-16 lg:pt-24 relative ">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-[1500px]">
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="">
            <Link href="/">
              <LogoWhite />
            </Link>

            <p className="text-sm leading-relaxed text-gray-600 mt-7">
              Bienvenue sur Point Batteries Services, votre partenaire de
              confiance pour la vente de batteries de haute qualité. Nous
              proposons une large gamme de batteries adaptées à divers besoins.
            </p>

            <ul className="flex items-center space-x-3 mt-9">
              <li>{/* icon */}</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-widest text-white uppercase">
              Notre Société
            </p>

            <ul className="mt-6 space-y-4">
              {/* links */}
              <li>
                <Link
                  href="#"
                  title=""
                  className="flex  text-gray-400 hover:text-white transition-all duration-200 font-semibold "
                >
                  Qui sommes nous
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  title=""
                  className="flex  text-gray-400 hover:text-white transition-all duration-200 font-semibold "
                >
                  Nos Marques
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest text-white uppercase">
              Mon Compte
            </p>

            <ul className="mt-6 space-y-4">
              {/* links */}
              <li>
                <Link
                  href={`/mon-compte/${username}`}
                  title=""
                  className="flex  text-gray-400 hover:text-white transition-all duration-200 font-semibold "
                >
                  Votre compte
                </Link>
              </li>
              <li>
                <Link
                  href="/mes-commandes"
                  title=""
                  className="flex  text-gray-400 hover:text-white transition-all duration-200 font-semibold "
                >
                  Historique de mes commandes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest text-white uppercase">
              Contactez-nous
            </p>

            <p className="text-sm  tracking-widest text-gray-400 mt-6 ">
              Bonjour, nous sommes toujours ouverts à la coopération et aux
              suggestions, contactez-nous de l'une des manières ci-dessous:
            </p>

            <div className="flex justify-between mt-8 text-sm font-semibold">
              {/* left part */}
              <div className="flex flex-col space-y-8">
                <div className="text-white">
                  <p className="text-gray-400">Numéro de Téléphone</p>
                  <p className="text-white">
                   +212 601-480488 / +212 531 510 011
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Notre Adresse</p>
                  <p className="text-white">
                    R Lots Azahra, B 94 Av. Hafid Ibn Abdelbar, Tanger 90060
                  </p>
                </div>
                <div className="flex flex-col space-y-8">
                  <div>
                    <p className="text-gray-400">Horaires de Travail</p>
                    <p className="text-white">Lun-Sam 09:00 - 20:00</p>
                    <p className="text-white">Dim 09:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        <p className="text-sm text-center text-gray-400">
          Développé par{" "}
          <Link
            target="_blank"
            href="https://kharbache.vercel.app/"
            className="font-bold text-white "
          >
            Issam Kharbache
          </Link>{" "}
          - Copyright © {year}{" "}
          <Link href="/" className="font-bold text-white ">
            PointsBatterieServices
          </Link>{" "}
          - All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
