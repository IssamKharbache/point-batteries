"use client";

import { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

interface UserCreatingVenteProps {
  rowData: { userId: string }[];
  currentUserId: string;
}

const fetchUsers = async (
  userIds: string[]
): Promise<Record<string, User | null>> => {
  try {
    const users: User[] = await getData(
      `/user/userById?id=${userIds.join("&id=")}`
    );
    return users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as Record<string, User>);
  } catch (error) {
    console.error("Error fetching users:", error);
    return {};
  }
};

export const UserCreatingVente = ({
  currentUserId,
  rowData,
}: UserCreatingVenteProps) => {
  const [usersMap, setUsersMap] = useState<Record<string, User | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIds = Array.from(new Set(rowData.map((row) => row.userId))); // Unique userIds
    fetchUsers(userIds).then((users) => {
      setUsersMap(users);
      setLoading(false);
    });
  }, [rowData]);

  if (loading) {
    return <Skeleton className="h-5 w-24" />;
  }

  const user = usersMap[currentUserId];

  return (
    <span>
      {user ? user.nom : <span className="text-red-500">Inconnu</span>}
    </span>
  );
};
