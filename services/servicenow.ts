// Server-only ServiceNow API client. Import only from Server Components,
// Server Actions, or Route Handlers — never from a "use client" file, since
// it reads the integration user's credentials from the environment.

// Must exactly match the `review_status` choice list values on the
// Clinical Documents table in ServiceNow.
export type RecordStatus = "pending review" | "reviewed" | "approved" | "rejected";

export interface ClinicalDocumentRecord {
  sys_id: string;
  patient_name: string;
  date_of_birth: string;
  provider_name: string;
  document_type: string;
  clinical_notes?: string;
  medications?: string;
  allergies?: string;
  status: RecordStatus | null;
  ai_category?: string;
  ai_confidence?: number;
  missing_information?: string;
  sys_created_on?: string;
}

export interface DashboardStats {
  total_documents: number;
  pending_review: number;
  completed: number;
  avg_ai_confidence: number;
}

export interface NewClinicalDocumentInput {
  patient_name: string;
  date_of_birth: string;
  provider_name: string;
  document_type: string;
  clinical_notes?: string;
  medications?: string;
  allergies?: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". See .env.local.example.`
    );
  }
  return value;
}

function getBaseUrl(): string {
  return requireEnv("SERVICENOW_API_BASE_URL").replace(/\/+$/, "");
}

function getAuthHeader(): string {
  const username = requireEnv("SN_USER");
  const password = requireEnv("SN_PASSWORD");
  const encoded = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${encoded}`;
}

// ServiceNow Scripted REST Resources conventionally wrap payloads in
// `{ result: ... }`, but a custom resource may also return the bare shape
// directly. Handle both so this client isn't brittle to that choice.
function unwrapResult<T>(json: unknown): T {
  if (json && typeof json === "object" && "result" in json) {
    return (json as { result: T }).result;
  }
  return json as T;
}

async function snFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const isFormData = init.body instanceof FormData;

  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `ServiceNow request failed (${response.status} ${response.statusText}): ${path}${
        body ? ` — ${body}` : ""
      }`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();
  return unwrapResult<T>(json);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return snFetch<DashboardStats>("/dashboard-stats");
}

// The /records resource nests the array under `records` (inside the
// `result` envelope already unwrapped by snFetch): { records: [...] }.
export async function getRecords(): Promise<ClinicalDocumentRecord[]> {
  const data = await snFetch<
    ClinicalDocumentRecord[] | { records: ClinicalDocumentRecord[] }
  >("/records");
  return Array.isArray(data) ? data : (data.records ?? []);
}

export async function getRecordById(
  sysId: string
): Promise<ClinicalDocumentRecord | null> {
  try {
    const data = await snFetch<
      ClinicalDocumentRecord | { record: ClinicalDocumentRecord }
    >(`/records/${encodeURIComponent(sysId)}`);
    return "record" in data ? data.record : data;
  } catch (error) {
    if (error instanceof Error && error.message.includes("(404 ")) {
      return null;
    }
    throw error;
  }
}

export async function createClinicalDocument(
  input: NewClinicalDocumentInput
): Promise<{ sys_id: string }> {
  return snFetch<{ sys_id: string }>("/submit", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function uploadAttachment(
  sysId: string,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  await snFetch<void>(`/attachments/${encodeURIComponent(sysId)}`, {
    method: "POST",
    body: formData,
  });
}

export async function updateRecordStatus(
  sysId: string,
  status: RecordStatus
): Promise<void> {
  await snFetch<void>(
    `/records/${encodeURIComponent(sysId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}
