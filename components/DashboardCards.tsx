import type { DashboardStats } from "@/services/servicenow";

interface DashboardCardsProps {
  stats: DashboardStats;
}

export default function DashboardCards({ stats }: DashboardCardsProps) {
  const cards = [
    { label: "Total Documents", value: stats.total_documents },
    { label: "Pending Review", value: stats.pending_review },
    { label: "Completed", value: stats.completed },
    { label: "Avg AI Confidence", value: `${stats.avg_ai_confidence}%` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
