# ACME Employee Salary Management System

A high-performance, web-based salary management portal designed for HR Managers to handle data for 10,000+ employees across multiple countries.

## 🚀 Features
- **Executive Dashboard**: Real-time KPI cards for total payroll, average salary, and employee count.
- **Salary Analytics**: Visual distribution of payroll by country and department using interactive charts.
- **Employee Directory**: A searchable, paginated table with server-side filtering for instant performance.
- **Employee Management**: Full CRUD capabilities to create, update, and delete employee records.
- **Enterprise Scale**: Optimized SQLite database with indexing to handle large datasets without lag.

## 🛠️ Technical Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Next.js API Routes (Edge-ready).
- **Database**: SQLite with Prisma ORM.
- **Seeding**: Faker.js for generating 10,000 realistic records.

## 📦 Getting Started

### 1. Clone and Install
```bash
git clone <repository-url>
cd employee-salary-mgmt
npm install
```

### 2. Setup Database
```bash
# Install dependencies
npm install

# Run migrations to create the database
npx prisma migrate dev --name init

# Seed the database with 10,000 employees
npx ts-node prisma/seed.ts
```

### 3. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📐 Architecture Decisions
- **Server-Side Pagination**: To prevent browser crashes, employees are fetched in batches of 50.
- **SQL Aggregations**: Payroll totals are calculated via `SUM` and `AVG` in SQLite, ensuring O(1) response time regardless of dataset size.
- **Type Safety**: End-to-end TypeScript ensures that data flowing from the database to the UI is consistent and error-free.
