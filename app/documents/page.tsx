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
        <p className="text-sm font-medium text-lime-600">Overview</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
          Intake Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Live status of clinical documents submitted for AI review.
        </p>
      </div>

      <DashboardCards stats={stats} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-950">
          Recent Clinical Documents
        </h2>
        <DocumentTable records={records} />
      </div>
    </div>
  );
}
