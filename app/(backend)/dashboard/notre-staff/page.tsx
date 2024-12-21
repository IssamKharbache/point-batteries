import axios from "axios";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getData } from "@/lib/getData";

export default async function page() {
  const data = await getData("admin/our-staff");
  return (
    <div className="container mx-auto py-10 ">
      <DataTable columns={columns} data={data} name={"Staff"} />
    </div>
  );
}
