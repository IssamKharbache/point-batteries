import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

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
  return `${prefix}-${marque.toUpperCase()}-${uniqueId}`;
};
