import React from "react";

import { getData } from "@/lib/getData";
import { columns, User } from "./columns";
import { DataTable } from "./data-table";

const page = async () => {
  const data = await getData("/user");
  const execludeStaff = await data.filter((user: User) => user.role === "USER");
  return (
    <div className="container mx-auto py-10 ">
      <DataTable columns={columns} data={execludeStaff} name={"Clients"} />
    </div>
  );
};

export default page;
