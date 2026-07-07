import Link from "next/link";
import type { ClinicalDocumentRecord, RecordStatus } from "@/services/servicenow";

const STATUS_STYLES: Record<RecordStatus, string> = {
  "pending review": "bg-orange-100 text-orange-800",
  reviewed: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function statusBadgeClasses(status: RecordStatus | null): string {
  if (!status) {
    return "bg-zinc-100 text-zinc-600";
  }
  return STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-800";
}

export function formatStatusLabel(status: RecordStatus | null): string {
  if (!status) return "Unknown";
  return status.replace(/\b\w/g, (char) => char.toUpperCase());
}

interface DocumentTableProps {
  records: ClinicalDocumentRecord[];
}

export default function DocumentTable({ records }: DocumentTableProps) {
  if (records.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
        No clinical documents have been submitted yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-zinc-100">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Patient
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Document Type
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {records.map((record) => (
            <tr key={record.sys_id} className="transition-colors hover:bg-zinc-50">
              <td className="px-5 py-3.5 text-sm">
                <Link
                  href={`/documents/${record.sys_id}`}
                  className="font-medium text-zinc-950 hover:underline"
                >
                  {record.patient_name}
                </Link>
              </td>
              <td className="px-5 py-3.5 text-sm text-zinc-600">
                {record.document_type}
              </td>
              <td className="px-5 py-3.5 text-sm">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClasses(
                    record.status
                  )}`}
                >
                  {formatStatusLabel(record.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
