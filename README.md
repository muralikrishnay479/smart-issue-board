# Smart Issue Board

A full-stack, production-ready issue tracking application tracking internal problems. Built with React (Vite) and Firebase.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Project Overview

The Smart Issue Board is a Jira-style issue tracker that allows teams to log, assign, and track issues efficiently. It features real-time updates, similar issue detection to prevent duplicates, and a robust status workflow.

## 🛠 Tech Stack & Decisions

### Why React + Firebase?
- **React (Vite)**: Chosen for its component-based architecture and performance. Vite ensures ultra-fast build times and hot module replacement, crucial for a smooth developer experience.
- **Firebase Authentication**: Provides secure, managed authentication (Email/Password) without the need to maintain a separate auth server.
- **Firebase Firestore**: A NoSQL document database chosen for its flexibility and real-time capabilities (`onSnapshot`), allowing team members to see updates instantly without refreshing.
- **Tailwind CSS**: Utility-first CSS framework enabling rapid UI development with a consistent, premium design system.
- **Vercel**: Selected for zero-config global deployment and seamless integration with front-end frameworks.

## 📂 Project Structure

```bash
src/
├── components/          # Reusable UI components
│   ├── CreateIssueForm.jsx  # Form with autocomplete
│   ├── IssueCard.jsx        # Individual issue display
│   ├── Layout.jsx           # Main app shell & nav
│   └── PrivateRoute.jsx     # Route protection
├── context/
│   └── AuthContext.jsx  # Authentication state management
├── pages/
│   ├── Dashboard.jsx    # Main board view
│   ├── Login.jsx        # Login page
│   └── Signup.jsx       # Registration page
├── services/
│   ├── issueService.js  # Firestore CRUD for issues
│   └── userService.js   # User management
└── utils/
    └── issueUtils.js    # Helper logic (duplicates, status)
```

## 📂 Data Structure (Firestore)

The application uses a single collection `issues` with the following document schema:

```json
{
  "id": "auto-generated-id",
  "title": "Fix login page responsive layout",
  "description": "The login form overflows on mobile screens...",
  "priority": "High",     // Enum: Low, Medium, High
  "status": "Open",       // Enum: Open, In Progress, Done
  "assignedTo": "dev@company.com",
  "createdBy": "manager@company.com",
  "createdAt": "Timestamp"
}
```

## 🧠 Smart Features

### Similar Issue Detection
To prevent duplicate work, the system analyzes issues before creation:
1.  **Tokenization**: The new title and existing titles are split into lowercase words.
2.  **Filtration**: Common words and punctuation are removed.
3.  **Intersection**: The algorithm counts matching keywords between the new title and existing ones.
4.  **Threshold**: If **2 or more words** match, the user is warned about a potential duplicate.

### Status Business Rules
Strict workflow enforcement ensures data integrity:
- **Rule**: An issue cannot skip steps. It must progress from `Open` → `In Progress` → `Done`.
- **Validation**: Attempting to move `Open` → `Done` immediately triggers an error toast.

## 🚧 Challenges & Solutions

### Real-time Synchronization
**Challenge**: ensuring all users see the same board state without manual refreshing.
**Solution**: Implemented Firestore `onSnapshot` listeners in a `useEffect` hook to keep the local state in sync with the server automatically.

### Duplicate Prevention
**Challenge**: Detecting "similar" issues isn't just string equality.
**Solution**: Implemented a keyword intersection algorithm purely on the client-side to provide instant feedback without heavy server-side search costs for this scale.

### Enhanced Assignment Logic
- **Goal**: Simplify assigning issues to team members.
- **Solution**:
    - **User Directory**: Automatically maintains a collection of all signed-up users in Firestore.
    - **Smart Autocomplete**: The "Assigned To" field offers a dropdown of existing users but **also allows free-text entry** for external emails. This hybrid approach ensures flexibility while speeding up daily workflows.
    - **Future-Proof**: Designed to be easily updated with more robust user profiles (avatars, roles) later.

## 🔮 Future Improvements
1.  **Search**: Implement Algolia or Firestore Indexing for full-text search as the dataset grows.
2.  **Comments**: Add a sub-collection for comments on each issue.
3.  **DnD**: Implement Drag-and-Drop (Kanban view) for status changes.

## 📦 Deployment Guide (Vercel)

1.  **Push to GitHub**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    # Add remote and push
    ```

2.  **Import to Vercel**:
    - Go to [Vercel Dashboard](https://vercel.com).
    - Click "Add New Project" -> Import from GitHub.
    - Select your repository.

3.  **Environment Variables**:
    - In the project settings on Vercel, copy the contents of your `.env` file into the "Environment Variables" section.
    - **Keys**: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.

4.  **Deploy**:
    - Click "Deploy". Vercel will build and host the application.

---

## 💻 Local Development

1.  Clone the repo.
2.  Install dependencies: `npm install`
3.  Setup `.env` with Firebase keys.
4.  Run dev server: `npm run dev`
