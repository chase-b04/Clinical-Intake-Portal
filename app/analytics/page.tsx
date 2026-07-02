import DashboardCards from "@/components/DashboardCards";
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
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {data.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No data yet.</p>
        )}
        {data.map((item) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {item.count} ({percent}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-950 dark:bg-zinc-50"
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

  const byStatus = countBy(records, (record) => record.status);
  const byDocumentType = countBy(records, (record) => record.document_type);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
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
