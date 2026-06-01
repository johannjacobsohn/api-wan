import { Link } from "@tanstack/react-router";
import { useResourceDetail, useUrl } from "../hooks/useResourceDetail";
import { getResourceConfig } from "../resources/registry";
import { parseUrl } from "../api/parseUrl";
import { Loading } from "./Loading";
import { ErrorState } from "./ErrorState";
import type { ResourceType, SwapiResource } from "../api/types";

interface ResourceDetailProps {
  resource: ResourceType;
  id: string;
}

function ResolvedLink({ url }: { url: string }) {
  const { data, isLoading } = useUrl<SwapiResource>(url);
  const parsed = parseUrl(url);

  if (isLoading) return <span>...</span>;
  if (!data || !parsed) return <span>{url}</span>;

  const config = getResourceConfig(parsed.resource);
  const label = String(data[config.displayField as keyof typeof data] ?? "");

  return (
    <Link to="/$resource/$id" params={{ resource: parsed.resource, id: parsed.id }}>
      {label}
    </Link>
  );
}

function LinkList({ urls }: { urls: string[] }) {
  if (urls.length === 0) return <span>—</span>;
  return (
    <ul style={{ margin: 0 }}>
      {urls.map((url) => (
        <li key={url}>
          <ResolvedLink url={url} />
        </li>
      ))}
    </ul>
  );
}

export function ResourceDetail({ resource, id }: ResourceDetailProps) {
  const { data, isLoading, error } = useResourceDetail(resource, id);
  const config = getResourceConfig(resource);

  if (isLoading) return <Loading />;
  if (error) return <ErrorState message={(error as Error).message} />;
  if (!data) return <ErrorState message="No data found" />;

  const linkFieldsSet = new Set(config.linkFields);

  return (
    <article>
      <h2>{String(data[config.displayField as keyof typeof data] ?? "")}</h2>
      <table>
        <tbody>
          {config.detailFields.map((field) => {
            if (linkFieldsSet.has(field.key)) return null;
            const value = data[field.key as keyof typeof data];
            return (
              <tr key={field.key}>
                <th>{field.label}</th>
                <td>{String(value ?? "")}</td>
              </tr>
            );
          })}
          {config.linkFields.map((field) => {
            const value = data[field as keyof typeof data];
            if (typeof value === "string") {
              return (
                <tr key={field}>
                  <th>{field}</th>
                  <td>
                    <ResolvedLink url={value} />
                  </td>
                </tr>
              );
            }
            if (Array.isArray(value)) {
              return (
                <tr key={field}>
                  <th>{field}</th>
                  <td>
                    <LinkList urls={value as string[]} />
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
      <Link to="/$resource" params={{ resource }}>
        &larr; Back to {config.label}
      </Link>
    </article>
  );
}
