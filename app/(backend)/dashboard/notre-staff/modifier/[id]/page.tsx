import UpdateUserForm from "@/components/backend/forms/UpdateUserForm";
import { getData } from "@/lib/getData";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  const userData = await getData(`/user/${id}`);
  if (!userData) {
    return (
      <section className="flex flex-col items-center justify-center h-full mt-8">
        <p className="text-4xl">Utilisateur non trouvé</p>
      </section>
    );
  }
  return (
    <section className="flex flex-col items-center justify-center h-full mt-8">
      <h1 className="text-4xl mb-8 font-semibold capitalize">
        {userData?.nom} Compte
      </h1>
      <UpdateUserForm userData={userData} />
    </section>
  );
};

export default page;
