export const dynamic = "force-dynamic";

import PageHeader from "@/components/backend/UI/PageHeader";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function page() {
  const data = await getData("/admin/our-staff");
  const caissierData = await getData("/caissier");

  const session = await getServerSession(authOptions);

  return (
    <section>
      {session?.user.role === "ADMIN" && (
        <>
          <PageHeader name="Staff" href="notre-staff/ajouter-admin" />
          <div className="container mx-auto py-10 ">
            <DataTable columns={columns} data={data} name={"Staff"} />
          </div>
          <PageHeader name="Caissier" href="notre-staff/ajouter-caissier" />
          <div className="container mx-auto py-10 ">
            <DataTable
              columns={columns}
              data={caissierData}
              name={"Caissier"}
            />
          </div>
        </>
      )}
      {session?.user.role === "STAFF" && (
        <>
          <PageHeader name="Caissier" href="notre-staff/ajouter-caissier" />
          <div className="container mx-auto py-10 ">
            <DataTable
              columns={columns}
              data={caissierData}
              name={"Caissier"}
            />
          </div>
        </>
      )}
    </section>
  );
}
