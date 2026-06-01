import { useMemo, useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { useResourceList } from "../hooks/useResourceList";
import { getResourceConfig } from "../resources/registry";
import { Loading } from "./Loading";
import { ErrorState } from "./ErrorState";
import { Empty } from "./Empty";
import type { ResourceType } from "../api/types";

interface ResourceListProps {
  resource: ResourceType;
  page: number;
  searchQuery: string;
  onPageChange: (page: number) => void;
  onSearchChange: (query: string) => void;
}

type RowData = Record<string, unknown>;

export function ResourceList({
  resource,
  page,
  searchQuery,
  onPageChange,
  onSearchChange,
}: ResourceListProps) {
  const [input, setInput] = useState(searchQuery);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (input !== searchQuery) onSearchChange(input);
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [input]);

  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  const { data, isLoading, error } = useResourceList(resource, page, searchQuery);
  const config = getResourceConfig(resource);

  const columns = useMemo(() => {
    const colHelper = createColumnHelper<RowData>();
    return config.listColumns.map((col) =>
      colHelper.accessor(col.key, {
        header: col.header,
        cell: (info) => {
          const value = info.getValue();
          if (col.key === config.displayField) {
            const id = (info.row.original.url as string).split("/").filter(Boolean).pop();
            return (
              <Link
                to="/$resource/$id"
                params={{ resource, id: id ?? "" }}
              >
                {String(value)}
              </Link>
            );
          }
          return String(value ?? "");
        },
      }),
    ) as ColumnDef<RowData>[];
  }, [config, resource]);

  const table = useReactTable({
    data: (data?.results ?? []) as unknown as RowData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorState message={(error as Error).message} />;
  if (!data || data.results.length === 0) return <Empty />;

  const totalPages = Math.ceil(data.count / 10);

  return (
    <section>
      <hgroup>
        <h2>{config.label}</h2>
        <p>{data.count} results</p>
      </hgroup>

      <input
        type="search"
        placeholder="Search..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Search"
      />

      <figure>
        <table>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      {totalPages > 1 && (
        <nav>
          <ul>
            <li>
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                Previous
              </button>
            </li>
            <li>
              <small>
                Page {page} of {totalPages}
              </small>
            </li>
            <li>
              <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </section>
  );
}
