import type { DashboardStats } from "@/services/servicenow";

interface DashboardCardsProps {
  stats: DashboardStats;
}

function DocumentsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
    </svg>
  );
}

const CARD_META = [
  { key: "total_documents", label: "Total Documents", icon: DocumentsIcon, tint: "bg-lime-300 text-zinc-950" },
  { key: "pending_review", label: "Pending Review", icon: ClockIcon, tint: "bg-orange-100 text-orange-700" },
  { key: "completed", label: "Completed", icon: CheckIcon, tint: "bg-green-100 text-green-700" },
  { key: "avg_ai_confidence", label: "Avg AI Confidence", icon: SparkleIcon, tint: "bg-blue-100 text-blue-700" },
] as const;

export default function DashboardCards({ stats }: DashboardCardsProps) {
  const values: Record<string, string | number> = {
    total_documents: stats.total_documents,
    pending_review: stats.pending_review,
    completed: stats.completed,
    avg_ai_confidence: `${stats.avg_ai_confidence}%`,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARD_META.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${card.tint}`}>
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-4 text-sm font-medium text-zinc-500">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-950">
              {values[card.key]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
