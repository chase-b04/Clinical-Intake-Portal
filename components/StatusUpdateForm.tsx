"use client";

import { useActionState } from "react";
import {
  initialUpdateStatusState,
  updateRecordStatusAction,
} from "@/app/actions";
import { formatStatusLabel } from "@/components/DocumentTable";
import type { RecordStatus } from "@/services/servicenow";

const STATUS_OPTIONS: RecordStatus[] = [
  "pending review",
  "reviewed",
  "approved",
  "rejected",
];

interface StatusUpdateFormProps {
  sysId: string;
  currentStatus: RecordStatus | null;
}

export default function StatusUpdateForm({
  sysId,
  currentStatus,
}: StatusUpdateFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateRecordStatusAction,
    initialUpdateStatusState
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input type="hidden" name="sys_id" value={sysId} />
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
        Status
        <select
          name="status"
          defaultValue={currentStatus ?? STATUS_OPTIONS[0]}
          className="rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm text-zinc-950"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {formatStatusLabel(option)}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-zinc-950 px-5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Updating…" : "Update Status"}
      </button>
      {state.status === "error" && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      {state.status === "success" && (
        <p className="text-sm text-green-600">{state.message}</p>
      )}
    </form>
  );
}
