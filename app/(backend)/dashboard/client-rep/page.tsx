export const dynamic = "force-dynamic";

import { getData } from "@/lib/getData";

import PageHeader from "@/components/backend/UI/PageHeader";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const page = async () => {
  const data = await getData("/user/companyClient");

  return (
    <section>
      <PageHeader name="Clients" href="/dashboard/client-rep/ajouter" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name={"Clients Repititive"} />
      </div>
    </section>
  );
};

export default page;
