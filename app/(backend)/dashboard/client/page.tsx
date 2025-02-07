export const dynamic = "force-dynamic";

import { getData } from "@/lib/getData";
import { columns, User } from "./columns";
import { DataTable } from "./data-table";
import PageHeader from "@/components/backend/UI/PageHeader";

const page = async () => {
  const data = await getData("/user");
  const execludeStaff = await data.filter((user: User) => user.role === "USER");
  return (
    <section>
      <PageHeader name="Clients" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={execludeStaff} name={"Clients"} />
      </div>
    </section>
  );
};

export default page;
