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

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import { PaginationDataTable } from "@/components/backend/table/PaginationDataTable";
import { PaymentType } from "@prisma/client";
import { fr } from "date-fns/locale";

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

  const [globalFilter, setGlobalFilter] = React.useState("");

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
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row) => {
      const venteRef = String(row.getValue("venteRef")).toLowerCase();
      const nomClient = String(row.getValue("clientNom")).toLowerCase();
      const search = globalFilter.toLowerCase().trim();
      const searchWords = search.split(/\s+/);
      return searchWords.every(
        (word: string) => venteRef.includes(word) || nomClient.includes(word)
      );
    },
  });

  const { loading } = useLoadingStore();

  const filterDate = table.getColumn("createdAt")?.getFilterValue() as
    | Date
    | undefined;

  return (
    <div>
      <div className="rounded-md border hidden md:block">
        <div className="flex items-center justify-between border-b ">
          <h2 className="px-4 py-4 font-semibold text-md md:text-2xl">
            {name}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="bg-red-500 w-3 h-3 rounded" />
              <h1 className="text-sm ml-2">A Crédit</h1>
            </div>
            <div className="flex items-center">
              <div className="bg-yellow-200 w-3 h-3 rounded" />
              <h1 className="text-sm ml-2">Avec Retour</h1>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal rounded",
                  !filterDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {filterDate ? (
                  format(filterDate, "PPP", { locale: fr }) // 👈 format with French locale
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filterDate}
                onSelect={(date: Date | undefined) =>
                  table.getColumn("createdAt")?.setFilterValue(date)
                }
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          <div className="relative flex items-center py-4">
            <Input
              placeholder="Filtrer par vente ref ou nom du client..."
              value={globalFilter ?? ""}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
              }}
              className="w-full px-5 mr-8 py-1 placeholder:text-xs md:placeholder:text-[14px] h-10 md:h-12 pr-10"
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
                table.getRowModel().rows.map((row) => {
                  const paymentType = row.getValue(
                    "paymentType"
                  ) as PaymentType;
                  const hasReturns = (row.original as any)?.returns?.length > 0;

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        paymentType === "ACREDIT"
                          ? "bg-red-500 hover:bg-red-400 text-white"
                          : "hover:bg-gray-50",
                        hasReturns && "bg-yellow-50 hover:bg-yellow-100"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell className="py-4 px-4" key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
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
              placeholder="Filtrer par ref ou client..."
              value={globalFilter ?? ""}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
              }}
              className="w-36 px-4 mr-8 py-1 placeholder:text-xs md:placeholder:text-[14px] h-10 md:h-12"
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
              <TableHead>Ref vente</TableHead>
              <TableHead>Servi par</TableHead>
              <TableHead>Client</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  <TableCell className="py-4 px-4" key="venteRef">
                    {row.getValue("venteRef")}
                  </TableCell>
                  <TableCell className="py-4 px-4" key="nomDuCaissier">
                    {row.getValue("nomDuCaissier")}
                  </TableCell>
                  <TableCell className="py-4 px-4" key="clientNom">
                    {row.getValue("clientNom")}
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

      <PaginationDataTable table={table} />
    </div>
  );
}
