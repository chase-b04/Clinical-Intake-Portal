import Link from "next/link";
import type { ClinicalDocumentRecord, RecordStatus } from "@/services/servicenow";

const STATUS_STYLES: Record<RecordStatus, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  "In Progress":
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "Pending Review":
    "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  Complete:
    "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function statusBadgeClasses(status: RecordStatus): string {
  return STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-800";
}

interface DocumentTableProps {
  records: ClinicalDocumentRecord[];
}

export default function DocumentTable({ records }: DocumentTableProps) {
  if (records.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        No clinical documents have been submitted yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Patient
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Document Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-black">
          {records.map((record) => (
            <tr key={record.sys_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <td className="px-4 py-3 text-sm">
                <Link
                  href={`/documents/${record.sys_id}`}
                  className="font-medium text-zinc-950 hover:underline dark:text-zinc-50"
                >
                  {record.patient_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                {record.document_type}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClasses(
                    record.status
                  )}`}
                >
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
