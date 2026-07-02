import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-start gap-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Clinical Intake Portal
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Submit clinical documents for AI-assisted review and track their
        progress as ServiceNow processes, categorizes, and summarizes them.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/submit"
          className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Submit a Clinical Document
        </Link>
        <Link
          href="/documents"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          View Intake Dashboard
        </Link>
      </div>
    </div>
  );
}
