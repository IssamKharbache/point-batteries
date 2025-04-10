import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import db from "../db";

export const generateUsername = (nom: string, prenom: string): string => {
  const baseId = nom.toLowerCase() + prenom.toLowerCase();
  const uniqueId = `${baseId}${uuidv4().slice(0, 15)}`;
  return uniqueId;
};

export const getInitials = (nom: string, prenom: string): string => {
  const baseId = nom.toLowerCase()[0] + prenom.toLowerCase()[0];
  return baseId;
};

export const createSlug = (title: string) => {
  // Convert the title to lowercase and replace spaces and special characters
  const slugBase = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens

  // Generate a unique identifier (e.g., a short hash)
  const uniqueId = crypto.randomBytes(4).toString("hex"); // 8-character hex string

  // Combine the slug base and unique identifier
  return `${slugBase}-${uniqueId}`;
};

export const generateOrderNumber = (length: number) => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let orderNumber = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderNumber += characters.charAt(randomIndex);
  }

  return orderNumber;
};

export const generateProductReference = (marque: string): string => {
  const prefix = "PB";
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
  const uniqueId = `${randomString}`;
  const formattedMarque = marque.replace(/\s+/g, "-").toUpperCase();
  return `${prefix}-${formattedMarque}-${uniqueId}`;
};

export const generateReferenceAchat = () => {
  const prefix = "ACHAT";
  const uniqueId = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${uniqueId}`;
};

export const formatDate = (inputDate: string | Date): string => {
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"; // 1M, 1.2M
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k"; // 10k, 15.6k
  }
  return num.toString(); // Return as-is if less than 1k
};

export async function generateUniqueVenteRef() {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  // 1. Find the highest existing venteRef for current year
  const lastVente = await db.vente.findFirst({
    where: {
      venteRef: {
        startsWith: "VT-",
        contains: `/${currentYear}`,
      },
    },
    orderBy: {
      venteRef: "desc",
    },
    select: {
      venteRef: true,
    },
  });

  // 2. Determine next number
  let nextNumber = 1;
  if (lastVente) {
    const lastRef = lastVente.venteRef;
    const lastNumber = parseInt(lastRef.split("/")[0].split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  // 3. Update counter (for tracking only)
  await db.venteCounter.upsert({
    where: { year: currentYear },
    update: { counter: nextNumber },
    create: { year: currentYear, counter: nextNumber },
  });

  return `VT-${nextNumber.toString().padStart(4, "0")}/${currentYear}`;
}

export async function generateUniqueDevisRef() {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  const lastDevis = await db.devis.findFirst({
    where: {
      devisRef: {
        startsWith: "DV-",
        contains: `/${currentYear}`,
      },
    },
    orderBy: {
      devisRef: "desc",
    },
    select: {
      devisRef: true,
    },
  });

  let nextNumber = 1;
  if (lastDevis) {
    const lastRef = lastDevis.devisRef;
    const lastNumber = parseInt(lastRef.split("/")[0].split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  return `DV-${nextNumber.toString().padStart(4, "0")}/${currentYear}`;
}

export async function generateReturnReference(
  returnFrom: "vente" | "stock" = "vente"
): Promise<string> {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const prefix = returnFrom === "vente" ? "RV" : "RS";

  // Find the last return with the same prefix and year
  const lastReturn = await db.return.findFirst({
    where: {
      returnRef: {
        startsWith: prefix,
        contains: `/${currentYear}`,
      },
    },
    orderBy: {
      returnRef: "desc",
    },
    select: {
      returnRef: true,
    },
  });

  let nextNumber = 1;
  if (lastReturn) {
    const lastRef = lastReturn.returnRef;
    // Extract the number part (after prefix and before slash)
    const numberPart = lastRef.split("-")[1].split("/")[0];
    const lastNumber = parseInt(numberPart);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // Format the reference with 4-digit number and current year
  return `${prefix}-${nextNumber.toString().padStart(4, "0")}/${currentYear}`;
}

export function formatFrenchDate(isoDate: Date) {
  const days = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const date = new Date(isoDate);
  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek} ${dayOfMonth} ${month} ${year}`;
}
