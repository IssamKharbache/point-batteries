"use server";

import db from "../db";

export const generateUniqueFactureCode = async () => {
  const currentYear = new Date().getFullYear().toString().slice(-2);

  // 1. Find the highest existing factureCode for current year
  const lastFacture = await db.vente.findFirst({
    where: {
      factureCode: {
        startsWith: "FT-",
        contains: `/${currentYear}`,
      },
    },
    orderBy: {
      factureCode: "desc",
    },
    select: {
      factureCode: true,
    },
  });

  // 2. Determine next number
  let nextNumber = 1;
  if (lastFacture?.factureCode) {
    const lastRef = lastFacture.factureCode;
    const lastNumber = parseInt(lastRef.split("/")[0].split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  // 3. Check for gaps in numbering
  const allFactures = await db.vente.findMany({
    where: {
      factureCode: {
        startsWith: "FT-",
        contains: `/${currentYear}`,
      },
      NOT: {
        factureCode: null,
      },
    },
    select: {
      factureCode: true,
    },
    orderBy: {
      factureCode: "asc",
    },
  });

  // Find the first available gap
  const usedNumbers = allFactures
    .filter((f) => f.factureCode !== null)
    .map((f) => parseInt(f.factureCode!.split("/")[0].split("-")[1]))
    .sort((a, b) => a - b);

  let firstGap = null;
  for (let i = 0; i < usedNumbers.length; i++) {
    if (usedNumbers[i] !== i + 1) {
      firstGap = i + 1;
      break;
    }
  }

  // Use the gap if found, otherwise use nextNumber
  const finalNumber = firstGap || nextNumber;

  return `FT-${finalNumber.toString().padStart(4, "0")}/${currentYear}`;
};
