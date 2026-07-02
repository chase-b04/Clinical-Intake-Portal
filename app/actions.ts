"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createClinicalDocument,
  updateRecordStatus,
  uploadAttachment,
  type RecordStatus,
} from "@/services/servicenow";

export interface SubmitState {
  status: "idle" | "error";
  message?: string;
}

export const initialSubmitState: SubmitState = { status: "idle" };

export async function submitClinicalDocumentAction(
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const patient_name = String(formData.get("patient_name") ?? "").trim();
  const date_of_birth = String(formData.get("date_of_birth") ?? "").trim();
  const provider_name = String(formData.get("provider_name") ?? "").trim();
  const document_type = String(formData.get("document_type") ?? "").trim();
  const clinical_notes = String(formData.get("clinical_notes") ?? "").trim();
  const medications = String(formData.get("medications") ?? "").trim();
  const allergies = String(formData.get("allergies") ?? "").trim();
  const file = formData.get("document");

  if (!patient_name || !date_of_birth || !provider_name || !document_type) {
    return {
      status: "error",
      message:
        "Patient name, date of birth, provider name, and document type are required.",
    };
  }

  let sysId: string;
  try {
    const created = await createClinicalDocument({
      patient_name,
      date_of_birth,
      provider_name,
      document_type,
      clinical_notes,
      medications,
      allergies,
    });
    sysId = created.sys_id;

    if (file instanceof File && file.size > 0) {
      await uploadAttachment(sysId, file);
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong submitting the document.",
    };
  }

  revalidatePath("/documents");
  redirect(`/documents/${sysId}`);
}

export interface UpdateStatusState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const initialUpdateStatusState: UpdateStatusState = { status: "idle" };

export async function updateRecordStatusAction(
  _prevState: UpdateStatusState,
  formData: FormData
): Promise<UpdateStatusState> {
  const sysId = String(formData.get("sys_id") ?? "");
  const status = String(formData.get("status") ?? "") as RecordStatus;

  if (!sysId || !status) {
    return { status: "error", message: "Missing record or status." };
  }

  try {
    await updateRecordStatus(sysId, status);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to update status.",
    };
  }

  revalidatePath(`/documents/${sysId}`);
  revalidatePath("/documents");
  return { status: "success", message: "Status updated." };
}
