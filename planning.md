# Clinical Intake Portal

**Target Users:**
Doctor offices
Clinics
Referral coordinators
Medical staff

**Purpose:**
Submit clinical documents into ServiceNow for AI review.

## Portal Page 1: Submit Clinical Document

This is your main page.

**Form Fields**

- Patient Name
- Date of Birth
- Provider Name
- Document Type
- Clinical Notes
- Medications
- Allergies
- Upload Document

---

**When the user clicks Submit:**

\Portal
↓
POST /submit
↓
ServiceNow
↓
AI Processing
↓
Record Created\

---

This directly maps to your existing table.

Uses:
**POST /submit**
**POST /attachments/{sys_id}**

## Portal Page 2: Intake Dashboard

Uses:
**GET /records**
**GET /dashboard-stats**

| Patient | Document Type | Status |
| John Doe | Referral | Complete |
| Sarah Smith | Prior Auth | Processing |
| Mike Jones | Lab Results | Review Required |

This immediately shows ServiceNow is the backend system.

**Displays:**
Total Documents
Pending Review
Completed
Recent Clinical Documents

## Portal Page 3: Clinical Document Review

Uses: **GET /records/{sys_id}**

**Displays:**

_Submitted Information_
Patient Name
DOB
Provider Name

_AI Results_
AI Summary
AI Category
AI Confidence
Missing Information

_example_
Summary:
Patient requesting orthopedic referral due to chronic knee pain.

Category:
Referral Request

Confidence:
94%

Missing Information:
Insurance Policy Number
Previous Imaging Reports

---

This is probably the strongest AI demo you can show.

## Portal Page 4: Admin Review

Uses: **PATCH /records/{sys_id}**

**Statuses:**
New
In Progress
Pending Review
Complete
Rejected

Shows in list of dropdown form.

---

Reviewer changes status directly from portal.
The audience immediately sees:

    External web app updated a ServiceNow record through an API.

That's one of the requirements they're looking for.

## NEW API: GET /dashboard-stats

returns:

{
"total_documents": 42,
"pending_review": 8,
"completed": 27,
"avg_ai_confidence": 91
}

## Project App Structure

Clinical Intake Portal

1. Submit Clinical Document
   └── POST /submit

2. Intake Dashboard
   ├── GET /records
   └── GET /dashboard-stats

3. Clinical Document Review
   └── GET /records/{sys_id}

4. Admin Review
   └── PATCH /records/{sys_id}

## Project File Structure

clinical-intake-portal
│
├── app
│ ├── page.tsx
│ ├── submit
│ │ └── page.tsx
│ ├── documents
│ │ ├── page.tsx
│ │ └── [sysid]
│ │ └── page.tsx
│ └── analytics
│ └── page.tsx
│
├── components
│ ├── Navbar.tsx
│ ├── DashboardCards.tsx
│ └── DocumentTable.tsx
│
└── services
└── servicenow.ts

## Connecting External App to ServiceNow instance (PDI)

The Next.js app will simply make HTTP requests to the ServiceNow Scripted REST APIs.

Next.js App
(Localhost:3000)
↓
ServiceNow REST API
(your-instance.service-now.com)
↓
Clinical Documents Table

**Step 1: Create an Integration User in ServiceNow**
Create a dedicated user, for example:

Username:
clinical_portal_api

Password:

---

Give it the roles/ACL access needed to:

Read Clinical Documents
Create Clinical Documents
Update Clinical Documents
Upload Attachments

This follows the API implementation guide's recommendation to use a dedicated integration user.

**Step 2: Get Your API Base URL**

Something like:
https://dev12345.service-now.com

plus your API namespace:
/api/x_your_scope/task4

Result:
https://dev12345.service-now.com/api/x_your_scope/task4

**Step 3: Create an API Service File**

In Next.js:
services/
└── servicenow.ts

Example:
const BASE_URL =
"https://YOUR_INSTANCE.service-now.com/api/x_your_scope/task4";

const USERNAME = process.env.SN_USER!;
const PASSWORD = process.env.SN_PASSWORD!;

const auth = btoa(`${USERNAME}:${PASSWORD}`);

export async function getRecords() {
const response = await fetch(`${BASE_URL}/records`, {
headers: {
Authorization: `Basic ${auth}`,
Accept: "application/json",
},
});

return response.json();
}

**Step 4: Store Credentials**

.env.local

Example:
SN_USER=clinical_portal_api
SN_PASSWORD=yourpassword

SERVICENOW_URL=https://your-instance.service-now.com

**Step 5: Connect Each Page**

**Dashboard**
calls:
GET /dashboard-stats
and
GET /records

**Submit Clinical Document**
Calls: POST /submit

**Clinical Document Review**
Calls: GET /records/{sys_id}

**Admin review**
Calls: PATCH /records/{sys_id}

**STEP 6: Handle CORS**
Create a Next.js API route:
**app/api/records/route.ts**

and proxy requests through Next.js:
Browser
↓
Next.js API Route
↓
ServiceNow

Alternative
Configure CORS in ServiceNow.
Possible, but more annoying.
If this is an intern project, I would absolutely use the Next.js proxy approach.
