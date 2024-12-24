import { v4 as uuidv4 } from "uuid";
export const generateUsername = (nom: string, prenom: string): string => {
  const baseId = nom.toLowerCase() + prenom.toLowerCase();
  const uniqueId = `${baseId}${uuidv4().slice(0, 15)}`;
  return uniqueId;
};

export const getInitials = (nom: string, prenom: string): string => {
  const baseId = nom.toLowerCase()[0] + prenom.toLowerCase()[0];
  return baseId;
};
