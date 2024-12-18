import { v4 as uuidv4 } from "uuid";
export const generateUsername = (nom: string, prenom: string): string => {
  const baseId = nom.toLowerCase() + prenom.toLowerCase();
  const uniqueId = `${baseId}${uuidv4().slice(0, 8)}`;
  return uniqueId;
};
