import UpdateUserForm from "@/components/backend/forms/UpdateUserForm";
import { getData } from "@/lib/getData";

interface PageProps {
  params: {
    id: string;
  };
}
const page = async ({ params }: PageProps) => {
  const { id } = await params;

  const userData = await getData(`/user/${id}`);

  return (
    <section className="flex flex-col items-center justify-center h-full mt-8">
      <h1 className="text-4xl mb-8 font-semibold">Mon compte</h1>
      <UpdateUserForm userData={userData} />
    </section>
  );
};

export default page;