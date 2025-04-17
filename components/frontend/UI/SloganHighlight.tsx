// PremiumSloganBanner.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
// Import appropriate icons from react-icons
import { FaRegGem, FaAward, FaTools, FaShieldAlt } from "react-icons/fa";

const PremiumSloganBanner = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const words = [
    { text: "Prix", color: "#e63946", icon: FaRegGem }, // Diamond/gem for price/value
    { text: "Qualité", color: "#457b9d", icon: FaAward }, // Award/medal for quality
    { text: "Services", color: "#1d3557", icon: FaTools }, // Tools for services
    { text: "Garantie", color: "#2a9d8f", icon: FaShieldAlt }, // Shield for guarantee/warranty
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] },
    },
  };

  const glowVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.4, opacity: 0.7, transition: { duration: 0.3 } },
  };

  return (
    <div ref={ref} className="w-full py-10 my-8 overflow-hidden relative">
      {/* Background with gradient and texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_70%)]"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600"></div>

      {/* Animated pulsing circles in background */}
      <div className="absolute left-10 top-1/3 w-32 h-32 rounded-full bg-blue-200 opacity-20 blur-xl"></div>
      <motion.div
        className="absolute right-10 bottom-1/3 w-24 h-24 rounded-full bg-teal-200 opacity-20 blur-xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      {/* Content container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Main slogan */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={controls}
          className="flex flex-col items-center justify-center"
        >
          {/* 3D ribbon banner */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-2xl mx-auto mb-8"
          >
            <div className="relative h-16 md:h-20 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.1)_100%)]"></div>
              <div className="h-full flex items-center justify-center">
                <h2 className="text-2xl md:text-3xl text-white font-extrabold tracking-wider uppercase text-center">
                  Notre Promesse
                </h2>
              </div>
              {/* Ribbon ends */}
              <div className="absolute -left-4 top-0 h-full w-8 bg-blue-800 skew-x-12 origin-top"></div>
              <div className="absolute -right-4 top-0 h-full w-8 bg-blue-800 -skew-x-12 origin-top"></div>
            </div>
          </motion.div>

          {/* Words with icons in cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 px-4 md:px-0">
            {words.map((word, index) => {
              const IconComponent = word.icon;
              return (
                <motion.div
                  key={word.text}
                  variants={itemVariants}
                  className="relative"
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/50 to-white/80 blur-sm"
                    variants={glowVariants}
                    animate={hovered === index ? "hover" : "initial"}
                    style={{ backgroundColor: word.color + "20" }}
                  ></motion.div>

                  <motion.div
                    className="relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    whileHover={{
                      y: -5,
                      boxShadow: `0 10px 25px -5px ${word.color}40`,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <motion.div
                      className="mb-2 text-4xl md:text-5xl"
                      style={{ color: word.color }}
                      animate={
                        hovered === index
                          ? { scale: 1.2, y: -5 }
                          : { scale: 1, y: 0 }
                      }
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <IconComponent />
                    </motion.div>
                    <h3
                      className="text-xl md:text-2xl font-bold"
                      style={{ color: word.color }}
                    >
                      {word.text}
                    </h3>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Tagline */}
          <motion.div
            variants={itemVariants}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-full shadow-lg"
          >
            <motion.p
              className="text-sm md:text-base text-white font-medium text-center"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={controls}
              variants={{
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: { delay: 1.6, duration: 0.8 },
                },
              }}
            >
              <span className="italic">L'excellence à votre portée</span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumSloganBanner;
