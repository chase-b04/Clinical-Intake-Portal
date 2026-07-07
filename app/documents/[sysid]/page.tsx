import { notFound } from "next/navigation";
import { formatStatusLabel, statusBadgeClasses } from "@/components/DocumentTable";
import StatusUpdateForm from "@/components/StatusUpdateForm";
import { getRecordById } from "@/services/servicenow";

// Always fetch fresh data from ServiceNow; never prerender at build time.
export const dynamic = "force-dynamic";

function normalizeMissingInformation(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function DocumentReviewPage({
  params,
}: {
  params: Promise<{ sysid: string }>;
}) {
  const { sysid } = await params;
  const record = await getRecordById(sysid);

  if (!record) {
    notFound();
  }

  const missingInformation = normalizeMissingInformation(
    record.missing_information
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-lime-600">Document Review</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
            {record.patient_name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{record.document_type}</p>
        </div>
        <span
          className={`inline-flex h-fit rounded-full px-3 py-1 text-sm font-medium ${statusBadgeClasses(
            record.status
          )}`}
        >
          {formatStatusLabel(record.status)}
        </span>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-950">
          Submitted Information
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoItem label="Patient Name" value={record.patient_name} />
          <InfoItem label="Date of Birth" value={record.date_of_birth} />
          <InfoItem label="Provider Name" value={record.provider_name} />
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-950">AI Results</h2>
        <dl className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem label="Category" value={record.ai_category ?? "—"} />
            <InfoItem
              label="Confidence"
              value={
                record.ai_confidence != null ? `${record.ai_confidence}%` : "—"
              }
            />
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-500">
              Missing Information
            </dt>
            <dd className="mt-1">
              {missingInformation.length > 0 ? (
                <ul className="list-inside list-disc text-sm text-zinc-950">
                  {missingInformation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-zinc-950">None</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-950">Admin Review</h2>
        <p className="mt-1 mb-4 text-sm text-zinc-500">
          Update this record&apos;s status directly. This writes back to
          ServiceNow through the portal&apos;s API.
        </p>
        <StatusUpdateForm sysId={record.sys_id} currentStatus={record.status} />
      </section>
    </div>
  );
}

function InfoItem({
  label,
  value,
  block,
}: {
  label: string;
  value: string;
  block?: boolean;
}) {
  return (
    <div className={block ? "col-span-full" : undefined}>
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-950">{value}</dd>
    </div>
  );
}
