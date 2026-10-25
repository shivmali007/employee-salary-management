# Employee Salary Management System - Requirements Document

## 1. Goal
The goal is to replace the current manual, Excel-based salary management process at ACME Org with a centralized, web-based software system. The system will allow HR managers to efficiently manage salary data for 10,000 employees across multiple countries and gain insights into the organization's compensation structure.

## 2. Scope & Features

### Core Features (In-Scope)
- **Employee Salary Management**:
  - Create, Read, Update, and Delete (CRUD) employee salary records.
  - Support for multiple currencies and countries.
- **Data Visualization & Analytics**:
  - Dashboard providing high-level summaries (e.g., total payroll cost, average salary per country).
  - Ability to answer key questions: "How does the org pay people?" (e.g., salary distribution by department or country).
- **Data Seeding**:
  - A script to populate the system with 10,000 mock employee records to demonstrate performance and scalability.
- **HR Manager Interface**:
  - A responsive web UI built with React/Next.js for easy data entry and reporting.
- **Backend API**:
  - A robust REST API to handle data operations and analytical queries.
  - Relational database (SQLite) for structured data storage.

### Deliberately Out-of-Scope (and Reasoning)
- **User Authentication & Role-Based Access Control (RBAC)**: While critical for production, the primary focus of this assessment is the data management and analytical capabilities. I will assume a single HR Manager persona for this MVP.
- **Payroll Processing/Payment Integration**: The requirement is to *manage salary data* and *answer questions*, not to execute actual bank transfers or tax filings.
- **Employee Self-Service Portal**: The user persona is specifically the HR Manager. Providing employee access adds significant complexity (auth, privacy) that is secondary to the core management goal.
- **Complex Versioning/Audit Trails**: While tracking salary changes is useful, a full temporal database or audit log is omitted to prioritize core functionality and reporting.
- **Cloud Deployment (Full CI/CD)**: The focus is on a fully functional codebase. While the software will be "deployable," complex cloud infrastructure setup (K8s, etc.) is secondary to the application logic.

## 3. Technical Stack
- **Frontend**: Next.js (React), Tailwind CSS, Lucide React (Icons), Recharts (Visualization).
- **Backend**: Node.js with Express (or Next.js API routes).
- **Database**: SQLite (via Prisma ORM for type safety and easy migrations).
- **Testing**: Jest and React Testing Library.
- **Language**: TypeScript (for maintainability and reduced runtime errors).

## 4. Success Criteria
- Successful seeding of 10,000 records without performance degradation.
- HR Manager can perform CRUD operations on salaries.
- HR Manager can view aggregated salary data by country/department.
- High test coverage for core business logic.
