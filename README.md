# Timesheet & Expense WeChat Mini Program

Developed using uni-app (Vue 3) and uniCloud.

## Features

### Employee
- **Log Hours:** Daily/weekly hour logging with project descriptions.
- **Log Expense:** Expense submission with category selection and receipt image upload.
- **Login:** Secure WeChat login.

### Manager
- **Approvals:** Review, approve, or reject pending timesheets and expenses.
- **Reporting:** Generate monthly/weekly CSV reports for accounting.
- **Role-based Access:** Automatic role identification upon login.

## Tech Stack
- **Frontend:** Vue 3, uni-app, uni-ui.
- **Backend:** uniCloud (Serverless), Cloud Functions, Cloud Database.
- **Testing:** Vitest (TDD Approach).

## Development Setup

1.  Install dependencies: `npm install`
2.  Run tests: `npm test`
3.  Run for H5: `npm run dev:h5`
4.  Run for WeChat: `npm run dev:mp-weixin` (Open in WeChat DevTools)

## Project Structure
- `src/utils/`: Core logic and API calls.
- `src/pages/`: UI pages for Employee and Manager.
- `uniCloud-aliyun/`: Cloud functions and database schemas.
- `tests/unit/`: Unit tests following TDD.
