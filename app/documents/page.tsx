import DashboardCards from "@/components/DashboardCards";
import DocumentTable from "@/components/DocumentTable";
import { getDashboardStats, getRecords } from "@/services/servicenow";

// Always fetch fresh data from ServiceNow; never prerender at build time.
export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const [stats, records] = await Promise.all([
    getDashboardStats(),
    getRecords(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Intake Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Live status of clinical documents submitted for AI review.
        </p>
      </div>

      <DashboardCards stats={stats} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Recent Clinical Documents
        </h2>
        <DocumentTable records={records} />
      </div>
    </div>
  );
}
