"use client";

import { useActionState } from "react";
import { initialSubmitState, submitClinicalDocumentAction } from "@/app/actions";

// Must exactly match the `document_type` choice list values on the
// Clinical Documents table in ServiceNow (case/spacing included) or
// POST /submit will be rejected. Verify against System Definition >
// Choice Lists if submissions start failing.
const DOCUMENT_TYPES = [
  "referral",
  "lab report",
  "progress note",
  "discharge summary",
  "imaging report",
  "prescription",
  "consultation note",
];

export default function SubmitPage() {
  const [state, formAction, isPending] = useActionState(
    submitClinicalDocumentAction,
    initialSubmitState
  );

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
        Submit Clinical Document
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        This form creates a record in ServiceNow and queues it for AI review.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <Field label="Patient Name" htmlFor="patient_name" required>
          <input
            id="patient_name"
            name="patient_name"
            type="text"
            required
            className={inputClasses}
          />
        </Field>

        <Field label="Date of Birth" htmlFor="date_of_birth" required>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            required
            className={inputClasses}
          />
        </Field>

        <Field label="Provider Name" htmlFor="provider_name" required>
          <input
            id="provider_name"
            name="provider_name"
            type="text"
            required
            className={inputClasses}
          />
        </Field>

        <Field label="Document Type" htmlFor="document_type" required>
          <select
            id="document_type"
            name="document_type"
            required
            defaultValue=""
            className={inputClasses}
          >
            <option value="" disabled>
              Select a document type
            </option>
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Clinical Notes" htmlFor="clinical_notes">
          <textarea
            id="clinical_notes"
            name="clinical_notes"
            rows={4}
            maxLength={4000}
            className={inputClasses}
          />
        </Field>

        <Field label="Medications" htmlFor="medications">
          <textarea
            id="medications"
            name="medications"
            rows={3}
            maxLength={4000}
            className={inputClasses}
          />
        </Field>

        <Field label="Allergies" htmlFor="allergies">
          <textarea
            id="allergies"
            name="allergies"
            rows={3}
            maxLength={1000}
            className={inputClasses}
          />
        </Field>

        <Field label="Upload Document" htmlFor="document">
          <input
            id="document"
            name="document"
            type="file"
            className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800"
          />
        </Field>

        {state.status === "error" && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
        >
          {isPending ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-200";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
