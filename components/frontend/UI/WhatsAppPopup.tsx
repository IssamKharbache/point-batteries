"use client";

import React, { useState } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa"; // WhatsApp and X icons
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion
import { X } from "lucide-react";

const WhatsAppPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  // WhatsApp Click-to-Chat URL
  const phoneNumber = "+212601480488"; 
  const message = "Bonjour, j'ai une question concernant ma commande."; 
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  // Animation variants for the popup
  const popupVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
  };

  // Animation variants for the icon flip
  const iconVariants = {
    whatsapp: { rotate: 0 },
    close: { rotate: 180 },
  };

  return (
    <div
      style={{
        position: "fixed", // Fixed position to stay on screen
        bottom: "20px", // Position at the bottom
        left: "20px", // Position at the left
        zIndex: 1000, // Ensure it's on top of other elements
      }}
    >
      {/* WhatsApp Icon Button with Flip Animation */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          backgroundColor: "#25D366",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={isOpen ? "close" : "whatsapp"}
          variants={iconVariants}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isOpen ? <X size={30} /> : <FaWhatsapp size={30} />}
        </motion.div>
      </motion.div>

      {/* Popup Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              bottom: "80px", // Position above the icon
              left: "0",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "20px",
              width: "300px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1000, // Ensure it's on top of other elements
              border: "1px solid #e0e0e0", // Add a subtle border
            }}
          >
            <h3
              style={{
                marginBottom: "10px",
                color: "#333",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Besoin d'informations ?
            </h3>
            <p
              style={{
                marginBottom: "20px",
                color: "#666",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              Bonjour et bienvenue chez Point Batteries Service, un de nos
              membres répondra à toutes vos questions.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                backgroundColor: "#25D366",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                textDecoration: "none",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#128C7E")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#25D366")
              }
            >
              Envoyer un message
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatsAppPopup;
