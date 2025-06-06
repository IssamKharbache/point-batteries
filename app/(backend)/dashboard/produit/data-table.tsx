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
import TableActions, {
  ProductData,
} from "@/components/backend/table/TableActions";

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

  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row) => {
      const rowValue = row.getValue("designationProduit") as string;
      const search = globalFilter.toLowerCase().trim();
      // Split search into words
      const searchWords = search.split(/\s+/);

      // Check if every word is found somewhere in the row value
      return searchWords.every((word: string) =>
        rowValue.toLowerCase().includes(word)
      );
    },
  });

  const { loading } = useLoadingStore();

  return (
    <div>
      <div className="rounded-md border hidden md:block">
        <div className="flex items-center justify-between border-b ">
          <h2 className="px-4 py-4 font-semibold text-md md:text-2xl">
            {name}
          </h2>
          <div className="relative flex items-center py-4 mr-8">
            <Input
              placeholder="Filtrer par designation..."
              value={globalFilter ?? ""}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
              }}
              className="w-52 px-4 pr-10 py-1 h-10 md:h-12 md:w-60 placeholder:text-xs md:placeholder:text-[14px] "
            />
            <Filter size={15} className="absolute text-gray-400 right-2" />
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
        <div className="flex flex-col justify-between md:items-center border-b m-2 md:m-0">
          <h2 className="px-4 py-4 font-semibold text-xl">{name}</h2>
          <div className="relative flex  items-center py-4 mr-8">
            <Input
              placeholder="Filtrer par designation..."
              value={globalFilter ?? ""}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
              }}
              className="w-52 px-4 pr-10 py-1 h-10 md:h-12 md:w-60 placeholder:text-xs md:placeholder:text-[14px] "
            />
            <Filter
              size={15}
              className="absolute text-gray-400 right-2 hidden md:block"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="py-4 px-4">
              <TableHead>Designation</TableHead>
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
                  <TableCell className="py-4 px-4" key="designationProduit">
                    {row.getValue("designationProduit")}
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
    </div>
  );
}
