"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import * as React from "react";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Loader2 } from "lucide-react";
import { useLoadingStore } from "@/context/store";

import { PaginationDataTable } from "@/components/backend/table/PaginationDataTable";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  name: string;
}

export function DataTable<TData>({
  columns,
  data,
  name,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { loading } = useLoadingStore();

  return (
    <div>
      <div className="rounded-md border ">
        <div className="flex items-center justify-between border-b ">
          <h2 className="px-4 py-4 font-semibold text-md md:text-2xl">
            {name}
          </h2>
          <div className="relative flex items-center py-4">
            <Input
              placeholder="Filtrer par ref..."
              value={
                (table.getColumn("refAchat")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("refAchat")?.setFilterValue(event.target.value)
              }
              className="w-36 px-4 mr-8 py-1 h-10 md:h-12 md:w-60  placeholder:text-xs md:placeholder:text-[14px] "
            />
            <Filter size={15} className="absolute text-gray-400 right-12" />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-4 h-52">
            <Loader2 className="text-center animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader className="py-4">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="py-4 px-4" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Aucun résultat
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <PaginationDataTable table={table} />
    </div>
  );
}
