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
import { useLoadingStore } from "@/context/store";
import TableActions, {
  ProductData,
} from "@/components/backend/table/TableActions";
import Image from "next/image";

interface DataTableProps<TData, ProductData> {
  columns: ColumnDef<TData, ProductData>[];
  data: TData[];
  name: string;
}

export function DataTable<TData extends ProductData>({
  columns,
  data,
  name,
}: DataTableProps<TData, ProductData>) {
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
        <div className="flex items-center justify-between border-b ">
          <h2 className="px-4 py-4 font-semibold text-md md:text-2xl">
            {name}
          </h2>
          <div className="relative flex items-center py-4">
            <Input
              placeholder="Filtrer par reference..."
              value={
                (table.getColumn("refProduct")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("refProduct")
                  ?.setFilterValue(event.target.value)
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
      <div className="md:hidden rounded-md border">
        <div className="flex justify-between items-center border-b">
          <h2 className="px-4 py-4 font-semibold text-xl">{name}</h2>
          <div className="relative flex items-center py-4">
            <Input
              placeholder="Filtrer par titre..."
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="w-36 px-4 mr-8 py-1  placeholder:text-xs md:placeholder:text-[14px] h-10 md:h-12"
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
              <TableHead>Titre</TableHead>
              <TableHead>Image du produit</TableHead>
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
                  <TableCell className="py-4 px-4" key="title">
                    {row.getValue("title")}
                  </TableCell>
                  <TableCell className="py-4 px-4" key="imageUrl">
                    <div>
                      <Image
                        src={row.getValue("imageUrl")}
                        alt="produit image"
                        width={500}
                        height={500}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-4">
                    <TableActions
                      editEndpoint={`produit/modifier/${row.original.slug}`}
                      endpoint={`product/${row.original.slug}`}
                    />
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
