import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FilesTable({ url }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const result = await response.text();

        const rows = result.trim().split("\n").map((row) => row.split(","));
        if (rows.length === 0) return;

        const headers = rows[0]; // Extract column headers
        const values = rows.slice(1); // Extract data rows

        setColumns(headers);
        setData(values);
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    }
    fetchData();
  }, [url]);

  const tableColumns = columns.map((colName, index) => ({
    accessorKey: `${index}`, // Use index to avoid undefined keys
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {colName} <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="break-all">{row.getValue(`${index}`)}</div>,
  }));
  

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
  {table.getRowModel().rows.length ? (
    table.getRowModel().rows.map((row, rowIndex) => (
      <TableRow key={`row_${rowIndex}`}> {/* Ensure unique row key */}
        {row.getVisibleCells().map((cell, cellIndex) => (
          <TableCell key={`cell_${rowIndex}_${cellIndex}`}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No files found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
