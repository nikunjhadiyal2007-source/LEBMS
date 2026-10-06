# Laboratory Equipment Booking & Maintenance System (LEBMS)

> **Gujarat Technological University (GTU)**  
> **Course:** Advanced Database Management System (ADBMS) — Subject Code: `BE05016031`  
> **Academic Year:** 2026–27 | **Semester:** 5  
> **Two-Student Mini Project Deliverable:** Fully operational, verified Three-Tier prototype with polyglot persistence, XML data exchange, OLAP pattern mining, ACID concurrency control, and automated regression test suite.

---

## 1. Executive Summary & Architecture

The **Laboratory Equipment Booking & Maintenance System (LEBMS)** modernizes institutional laboratory inventory registers across collegiate engineering departments. It replaces cumbersome paper ledgers with a high-integrity, multi-tenant digital platform built upon the **Three-Tier Architecture**:

1. **Presentation Tier (Client Tier):** Static HTML5, responsive CSS3 (Bootstrap 5 CDN), vanilla ECMAScript (`fetch` API), Chart.js data visualization, and pervasive `escapeHtml()` contextual encoding to safeguard against Cross-Site Scripting (XSS).
2. **Application Tier (Server Tier):** Node.js runtime with Express 4 RESTful API routes, stateless session management via `express-session`, cryptographic hashing via `bcryptjs`, declarative input validation via `express-validator`, native XML processing with `xmlbuilder2` / `xpath` / `xmllint-wasm`, and atomic service transactions.
3. **Data Tier (Heterogeneous Polyglot Tier):**
   - **MySQL 8.0 (InnoDB):** Strongly structured, 3NF-normalized operational relational database storing master inventories, department hierarchies, users, booking schedules, checkout registers, and damage reports. Guarantees ACID transactions via row-level locks (`SELECT ... FOR UPDATE`).
   - **MongoDB 8.x (NoSQL Document Store):** Flexible semi-structured document repository persisting diagnostic checklists, technician work order logs, multi-attribute replacement parts arrays, audit trails, and user notification events.

---

## 2. Default Seed Accounts & Role Credentials

The system provides pre-configured role-based credentials initialized during database seeding (`npm run setup`). All test accounts use the password: `Password@123` (or role-specific default):

| Role | Email Address | Password | Permissions & Scope |
|---|---|---|---|
| **ADMIN** | `admin@lab.edu` | `Admin@123` | Full system administration, laboratory CRUD, user provisioning, active toggling, showcase benchmarks, KPI dashboards. |
| **STAFF** | `staff1@lab.edu` | `Staff@123` | Departmental lab operations, equipment inventory CRUD, reservation approvals/rejections, checkout issues, return checkins, maintenance work order completion. |
| **FACULTY** | `faculty1@lab.edu` | `Faculty@123` | Advanced lab equipment reservations, priority project booking, personal booking registers, analytical insights. |
| **STUDENT** | `student1@lab.edu` | `Student@123` | Student mini-project reservations, self-service equipment search, personal booking tracking, activity notifications. |

---

## 3. Technology Stack & Non-Negotiable Specifications

- **Backend:** Node.js (CommonJS), Express 4, `mysql2/promise` (Raw SQL prepared statements only — **No ORM**), official `mongodb` native driver (Raw BSON queries & aggregations — **No Mongoose**).
- **Security & Session:** `express-session` with memory store, `bcryptjs` for salt-hashed passwords, parameter binding for SQL injection immunity, BSON operator sanitization.
- **Frontend:** Semantic HTML5, Bootstrap 5.3.3, Bootstrap Icons 1.11.3, vanilla JavaScript, Chart.js 4.4.4. No client-side build steps or bundlers required.
- **Testing:** Node.js native test runner (`node:test`, `node:assert/strict`) executing 30 end-to-end integration test cases (T01 through T30).

---

## 4. Quick Start & Execution Guide

### 4.1 Prerequisites
- **Node.js:** v18.0.0 or newer (tested on Node v20.18.0)
- **MySQL Server:** 8.0.16 or newer (tested on MySQL 8.0.46 with InnoDB CHECK constraints enforced)
- **MongoDB Server:** 6.0 or newer (tested on MongoDB 8.3.7)

### 4.2 Configuration
Copy the sample environment file and configure local credentials:
```bash
cp .env.example .env
```
Ensure `.env` matches local connection endpoints:
```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=lebms_db
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=lebms_logs
PORT=3000
SESSION_SECRET=c28f1e9488d01fb67a2cb019ad74e14f923b7e
```

### 4.3 Database Setup & Seeding
Execute the database setup script to create all MySQL relational tables, views, stored procedures, triggers, indexes, and MongoDB collections with pristine seed records:
```bash
npm run setup
```

### 4.4 Database Integrity Verification
Verify table row counts, relational foreign keys, CHECK constraints, and quantity arithmetic:
```bash
npm run verify-db
```

### 4.5 Automated Test Suite Execution
Execute the full 30-case integration test suite:
```bash
npm test
```
*Note: `npm test` automatically executes `pretest` (`npm run setup`) and `posttest` (`npm run setup`) to ensure tests run against and leave behind a clean database.*

### 4.6 Start the Web Application
Start the HTTP server:
```bash
npm start
```
Open a browser and navigate to:
**`http://localhost:3000/login.html`**

---

## 5. Web Interface Directory

| Web Page | Target File | Accessible Roles | Description |
|---|---|---|---|
| **Login Portal** | `public/login.html` | Public | Fast credential selection chips and session authentication. |
| **BI Dashboard** | `public/index.html` | ADMIN, STAFF, FACULTY | Real-time utilization KPIs, department usage chart, and monthly trends. |
| **Inventory Catalog** | `public/equipment.html` | All Roles | Multi-attribute search, category/lab filters, and availability badges. |
| **Booking Form** | `public/book.html` | FACULTY, STUDENT | Reservation submission with date validation and duration checks. |
| **My Bookings** | `public/my-bookings.html` | All Roles | Self-service lifecycle tracking (Requested, Approved, Issued, Returned). |
| **Staff Approvals** | `public/approvals.html` | ADMIN, STAFF | Booking triage queue with capacity reservation checks. |
| **Issue & Return Desk** | `public/issue-return.html` | ADMIN, STAFF | Physical checkout register and checkin condition assessment. |
| **Maintenance Log** | `public/maintenance.html` | ADMIN, STAFF | Preventive maintenance scheduler and MongoDB completion work orders. |
| **Damage Triage** | `public/damage.html` | ADMIN, STAFF | Incident reporting and triage with automated `UNDER_MAINTENANCE` trigger. |
| **Institutional Reports** | `public/reports.html` | ADMIN, STAFF | 7 tabular audit registers with RFC-4180 CSV export. |
| **Pattern Mining** | `public/insights.html` | ADMIN, STAFF, FACULTY | 7 SQL-driven data mining insights with interactive "View SQL" toggle. |
| **XML & XPath Console** | `public/xml.html` | ADMIN, STAFF | Live hierarchical XML exports, XSD schema validator, and XPath console. |
| **Curriculum Showcase** | `public/showcase.html` | ADMIN, STAFF | Interactive ACID rollback simulation and row-locking race benchmark. |
| **Notifications Feed** | `public/notifications.html` | All Roles | MongoDB-backed user event alerts and unread status markers. |
| **User Directory** | `public/users.html` | ADMIN | Role-based account provisioning and active account toggling. |
| **Laboratory Facilities** | `public/labs.html` | All Roles (Admin edit) | Departmental laboratory directory and facility location registry. |

---

## 6. Project Documentation Index

All academic documentation, viva guides, and system design artifacts are located in `docs/`:

- [GTU Project Report (`docs/01_project_report.md`)](file:///d:/Antigravity%20projects/lebms/docs/01_project_report.md)
- [System Architecture & UML Diagrams (`docs/02_diagrams.md`)](file:///d:/Antigravity%20projects/lebms/docs/02_diagrams.md)
- [Automated & Manual Test Case Evidence (`docs/03_test_cases.md`)](file:///d:/Antigravity%20projects/lebms/docs/03_test_cases.md)
- [Comprehensive Viva Voce Guide (`docs/04_viva.md`)](file:///d:/Antigravity%20projects/lebms/docs/04_viva.md)
- [Two-Student Work Distribution Matrix (`docs/05_work_distribution.md`)](file:///d:/Antigravity%20projects/lebms/docs/05_work_distribution.md)
- [Faculty Demonstration Script (`docs/06_demo_script.md`)](file:///d:/Antigravity%20projects/lebms/docs/06_demo_script.md)
- [Assumptions & Limitations Specification (`docs/07_assumptions_and_limitations.md`)](file:///d:/Antigravity%20projects/lebms/docs/07_assumptions_and_limitations.md)
- [Interactive Project Presentation Slides (`docs/08_presentation_slides.md`)](file:///d:/Antigravity%20projects/lebms/docs/08_presentation_slides.md)
- [Relational SQL Features Reference (`docs/sql_features.md`)](file:///d:/Antigravity%20projects/lebms/docs/sql_features.md)
- [Security & Threat Mitigation Analysis (`docs/security.md`)](file:///d:/Antigravity%20projects/lebms/docs/security.md)
- [GTU ADBMS Syllabus Mapping (`docs/syllabus_mapping.md`)](file:///d:/Antigravity%20projects/lebms/docs/syllabus_mapping.md)

---
*Developed for Gujarat Technological University (GTU) ADBMS Semester 5 Mini Project.*
