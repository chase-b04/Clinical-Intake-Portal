import DashboardCards from "@/components/DashboardCards";
import { formatStatusLabel } from "@/components/DocumentTable";
import {
  getDashboardStats,
  getRecords,
  type ClinicalDocumentRecord,
} from "@/services/servicenow";

// Always fetch fresh data from ServiceNow; never prerender at build time.
export const dynamic = "force-dynamic";

function countBy<T extends string>(
  records: ClinicalDocumentRecord[],
  key: (record: ClinicalDocumentRecord) => T
): { label: T; count: number }[] {
  const counts = new Map<T, number>();
  for (const record of records) {
    const value = key(record);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function BreakdownList({
  title,
  data,
  total,
}: {
  title: string;
  data: { label: string; count: number }[];
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {data.length === 0 && (
          <p className="text-sm text-zinc-500">No data yet.</p>
        )}
        {data.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">{item.label}</span>
                <span className="text-zinc-500">
                  {item.count} ({percent}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-lime-400"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const [stats, records] = await Promise.all([
    getDashboardStats(),
    getRecords(),
  ]);

  const byStatus = countBy(records, (record) => formatStatusLabel(record.status));
  const byDocumentType = countBy(records, (record) => record.document_type);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-lime-600">Insights</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Aggregate trends across all clinical documents processed by ServiceNow AI.
        </p>
      </div>

      <DashboardCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BreakdownList title="By Status" data={byStatus} total={records.length} />
        <BreakdownList
          title="By Document Type"
          data={byDocumentType}
          total={records.length}
        />
      </div>
    </div>
  );
}
