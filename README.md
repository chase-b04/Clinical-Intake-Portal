# Clinical Intake Portal

**Target Users:**

- Doctor offices
- Clinics
- Referral coordinators
- Medical staff

**Purpose:**
Submit clinical documents into ServiceNow for AI review.

## Tech Stack:

- Original Clinical Document Intake:
- ServiceNow (ServiceNow Studio, Record Producer/Catalog Builder, now assist skill kit, now assist document intelligence)
- JavaScript
- REST APIs

Clinical Intake Portal:

- TypeScript
- next.js
- Tailwind CSS
- ESLint
- App Router

## How to run:

1. Clone the repo
2. npm run dev
3. App is available at: http://localhost:3000

## PAGES

1. Submit Clinical Document
   APIs used: POST /submit & POST /attachments/{sys_id}

2. Intake Dashboard
   APIs used: GET /records & GET /dashboard-stats

3. Clinical Document Review
   APIs used: GET /records/{sys_id}

4. Admin Review
   APIs used: PATCH /records/{sys_id}

## NEW SEPERATE API: GET /dashboard-stats

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
