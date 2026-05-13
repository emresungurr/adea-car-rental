# ADEA Luxury Auto Gallery - Project Final Submission

A professional, role-based web application designed for premium vehicle rental management. This project was developed as the Final Project for the MIS2006 Web Programming course.

### 👨‍💻 ADEA Development Team
* Ahmet Gürler
* Deniz Hacıoğulları
* Emre Sungur
* Abdalrahman Abualqare

---

### 🚀 Tech Stack & Requirements
This application is strictly initialized using Vite + React and meets all technical criteria specified in the course guidelines:

* **Database:** Real-time integration with Google Firebase (Cloud Firestore) for fetching and pushing data.
* **State Management:** Global state implementation using Zustand for authentication and search filtering.
* **Unit Testing:** Component logic and pricing algorithms verified via Vitest.
* **Forms:** Advanced validation handled by Formik & Yup.

### ⚙️ Core Operational Features
The prototype demonstrates the transition from conceptual design to technical implementation through several key modules:

* **Role-Based Access Control (RBAC):** Functional Login/Logout system supporting three distinct roles: Admin, Rental Agent, and Customer.
* **Smart Reservation Logic:** A custom "booked dates" algorithm that checks Firestore data to prevent overlapping rentals.
* **Live Fleet Management:** Real-time data mapping from the cloud to dynamic UI components.
* **Revenue Analytics:** Data-driven visualizations using Chart.js for administrative tracking.

### 📁 Professional Project Architecture
The project follows a modular and scalable directory structure:
* `src/components:` Reusable UI elements (e.g., BookingForm).
* `src/pages:` Individual views for each user role and public pages.
* `src/store:` Global state configurations with Zustand.
* `src/utils:` Logical algorithms and helper functions.

---

### 🛠️ How to Run the Project
To run this project locally, ensure you have Node.js installed. Extract the Zip and navigate to the root directory:

1. Install dependencies:
npm install

2. Run the development server:
npm run dev

3. Run unit tests:
npm test
