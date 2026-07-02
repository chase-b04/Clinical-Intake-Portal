"use client";

import { useActionState } from "react";
import {
  initialUpdateStatusState,
  updateRecordStatusAction,
} from "@/app/actions";
import type { RecordStatus } from "@/services/servicenow";

const STATUS_OPTIONS: RecordStatus[] = [
  "New",
  "In Progress",
  "Pending Review",
  "Complete",
  "Rejected",
];

interface StatusUpdateFormProps {
  sysId: string;
  currentStatus: RecordStatus;
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
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Status
        <select
          name="status"
          defaultValue={currentStatus}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-zinc-950 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {isPending ? "Updating…" : "Update Status"}
      </button>
      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
      )}
      {state.status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
      )}
    </form>
  );
}
