
# 🚀 Expense Tracker API

A secure and scalable backend API for managing personal income and expenses, supporting export to Excel and built with CI/CD-first deployment principles.


## Tech Stack


- **Server:** Node.js, Express.js
- **Database:** MySQL(hosted on TiDB)
- **ORM:** Sequelize
- **Containerization:** Docker
- **Deployment:** Railway
- **CI/CD:** Github Actions
- **API Testing:** Postman



## CI/CD Flow
```
Push to Main Branch -> GitHub Actions builds and pushes Docker image (tagged) to DockerHub → 
Railway manual redeploy of container on Railway
```
## CI/CD Demo  

https://github.com/user-attachments/assets/23e6aaf8-2331-40bb-a262-414735e0c220
##  📝Deployment Notes
❗️Note: Railway does not currently support **Auto-Deploy** for external Docker images. This project uses GitHub Actions to build and push Docker images to DockerHub. Railway must be manually triggered to pull the updated image tagged :v1  
❕If any possible way to be found in future I'll implement it.
### 🔍 Public Demo Links

These links are open to test without authentication and showcase real-time data:

- [Expenses](https://expense-tracker-production-c40a.up.railway.app/api/v1/demo/expense) – View mock expense data
- [Incomes](https://expense-tracker-production-c40a.up.railway.app/api/v1/demo/income) – View mock income data
- [Dashboard](https://expense-tracker-production-c40a.up.railway.app/api/v1/mock-public-dashboard) – View a sample dashboard structure

## ⚡API Endpoints 

### 🔐Authentication Endpoints

| Method | Endpoint                | Description                                  |
| ------ | ----------------------- | -------------------------------------------- |
| GET    | `/api/v1/auth/register` | Register a new user *(likely a placeholder)* |
| GET    | `/api/v1/auth/login`    | Login and get JWT token *(placeholder)*      |
| GET    | `/api/v1/auth/me`       | Get user info (protected)                    |
| GET    | `/api/v1/auth/upload`   | Upload user image (placeholder)              |


### 💰 Income Endpoints

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| GET    | `/api/v1/income/get`           | Get all income records (protected) |
| POST   | `/api/v1/income/add`           | Add a new income entry             |
| DELETE | `/api/v1/income/delete/:id`    | Delete a specific income entry     |
| GET    | `/api/v1/income/downloadexcel` | Download income data as Excel file |


### 💸 Expense Endpoints

| Method | Endpoint                        | Description                     |
| ------ | ------------------------------- | ------------------------------- |
| GET    | `/api/v1/expense/get`           | Get all expenses (protected)    |
| POST   | `/api/v1/expense/add`           | Add a new expense entry         |
| DELETE | `/api/v1/expense/delete/:id`    | Delete an expense entry by ID   |
| GET    | `/api/v1/expense/downloadexcel` | Download expenses as Excel file |


### 📊 Dashboard (Placeholder)

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| GET    | `/api/v1/dashboard/` | *(Not fully implemented)* |

## ⭐Conclusion 
This api will still be in development. I plan to make it a FullStack Application soon 😊.