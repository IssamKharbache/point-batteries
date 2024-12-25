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
import { Button } from "@/components/ui/button";
import { Filter, Loader2 } from "lucide-react";
import TableActions, {
  UserData,
} from "@/components/backend/table/TableActions";
import { useLoadingStore } from "@/context/store";

interface DataTableProps<TData, UserData> {
  columns: ColumnDef<TData, UserData>[];
  data: TData[];
  name: string;
}

export function DataTable<TData extends UserData>({
  columns,
  data,
  name,
}: DataTableProps<TData, UserData>) {
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

  const { loading, setLoading } = useLoadingStore();

  return (
    <div>
      <div className="rounded-md border hidden md:block">
        <div className="flex flex-col md:flex-row justify-between md:items-center  border-b ">
          <h2 className="md:px-4 md:py-4 font-semibold text-md md:text-2xl">
            {name}
          </h2>
          <div className="relative flex items-center py-4">
            <Input
              placeholder="Filtrer par nom..."
              value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("nom")?.setFilterValue(event.target.value)
              }
              className="max-w-sm px-4 mr-8 py-1  placeholder:text-xs md:placeholder:text-[14px]"
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
      {/* responsive table */}
      <div className="md:hidden rounded-md border">
        <div className="flex justify-between items-center border-b">
          <h2 className="px-4 py-4 font-semibold text-xl">{name}</h2>
          <div className="relative flex items-center py-4">
            <Input
              placeholder="Filtrer par nom..."
              value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("nom")?.setFilterValue(event.target.value)
              }
              className="w-36 px-4 mr-8 py-1  placeholder:text-xs md:placeholder:text-[14px] h-8 md:h-10"
            />
            <Filter
              size={15}
              className="absolute text-gray-400 right-10 md:right-12"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="py-4 px-4">
              <TableHead>Nom</TableHead>
              <TableHead>Prenom</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  <TableCell className="py-4 px-4" key="nom">
                    {row.getValue("nom")}
                  </TableCell>
                  <TableCell className="py-4 px-4" key="prenom">
                    {row.getValue("prenom")}
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <TableActions userData={row.original} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Aucun résultat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
