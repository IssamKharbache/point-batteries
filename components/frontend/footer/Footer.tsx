import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  return (
    <section className="min-h-[430px] py-10 bg-black sm:pt-16 lg:pt-24 relative ">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <Image
              src="/logopbslight.png"
              alt="Logo"
              width={384}
              height={384}
              className="w-96"
            />

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
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Notre Société
            </p>

            <ul className="mt-6 space-y-4">
              {/* links */}
              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Contactez-nous
            </p>

            <p className="text-sm font-semibold tracking-widest text-gray-400">
              Bonjour, nous sommes toujours ouverts à la coopération et aux
              suggestions, contactez-nous de l'une des manières ci-dessous:
            </p>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base text-white transition-all duration-200 600"
                >
                  {" "}
                  Customer Support{" "}
                </Link>
              </li>
            </ul>
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
