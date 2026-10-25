# Project Design & Architecture

## 1. High-Level Architecture
The system follows a classic Client-Server architecture:
- **Frontend**: Next.js (App Router) providing a single-page application (SPA) experience.
- **Backend**: Next.js API routes acting as the REST layer.
- **Database**: SQLite, chosen for its zero-config nature and sufficient performance for 10k records.
- **ORM**: Prisma, providing a type-safe interface between the TypeScript code and the SQLite database.

## 2. Data Model
The core entity is the `Employee`.

### Employee Schema
| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Primary Key |
| `name` | String | Employee full name |
| `email` | String | Unique employee email |
| `phone` | String | Employee contact number |
| `department` | String | Department (e.g., Engineering, Sales, HR) |
| `country` | String | Country of employment |
| `salary` | Decimal/Float | Annual salary in local currency |
| `currency` | String | ISO Currency code (e.g., USD, EUR, GBP) |
| `hireDate` | DateTime | Date of joining |
| `updatedAt` | DateTime | Last update timestamp |

## 3. API Design
| Endpoint | Method | Description |
|---|---|---|
| `/api/employees` | GET | List employees (with pagination/filtering) |
| `/api/employees` | POST | Create a new employee record |
| `/api/employees/[id]` | GET | Get detailed info for one employee |
| `/api/employees/[id]` | PATCH | Update salary or details |
| `/api/employees/[id]` | DELETE | Remove an employee record |
| `/api/analytics/summary` | GET | Get aggregated totals, averages, and counts |
| `/api/analytics/distribution` | GET | Get salary distribution by country/department |

## 4. Performance Considerations
- **Indexing**: Add indexes on `country` and `department` to ensure analytical queries remain fast as the dataset grows.
- **Pagination**: Implement cursor-based or offset pagination for the employee list to avoid loading 10,000 records into the DOM at once.
- **Aggregation**: Perform calculations (SUM, AVG) at the database level rather than in-memory in the Node.js process.

## 5. Implementation Plan
1. **Project Initialization**: Setup Next.js, TypeScript, and Tailwind.
2. **Database Layer**: Configure Prisma and SQLite; define the schema.
3. **Seeding**: Implement the 10k employee generator.
4. **API Implementation**: Build the CRUD and Analytics endpoints.
5. **UI Development**: 
   - Dashboard with summary cards and charts.
   - Employee table with search and pagination.
   - Salary edit forms.
6. **Testing**: Unit tests for backend logic and integration tests for key UI flows.
7. **Verification**: Run seeding, check performance, and verify requirements.
