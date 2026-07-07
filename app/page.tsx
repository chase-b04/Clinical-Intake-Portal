import Link from "next/link";

export default function Home() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
      <p className="text-sm font-medium text-lime-600">Welcome</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
        Clinical Intake Portal
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
        Submit clinical documents for AI-assisted review and track their
        progress as ServiceNow processes, categorizes, and summarizes them.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/submit"
          className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Submit a Clinical Document
        </Link>
        <Link
          href="/documents"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
        >
          View Intake Dashboard
        </Link>
      </div>
    </div>
  );
}
