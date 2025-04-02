# SQL Query Runner - Atlan Frontend Internship Task 2025

## 🚀 Project Overview
This project is a **web-based SQL query runner** that allows users to write and execute **SQL-like queries** on mock data. It provides a **CodeMirror-based editor** for query input, a **dynamic result table**, and interactive features like **click-to-generate queries**, **fullscreen toggle**, and **chunk-based loading** for large datasets.

---

## 🎯 Features

### ✅ **Core Features**
- **Space-Separated SQL Queries**: Allows users to type SQL-like queries with suggestions.
- **CodeMirror Integration**: Provides syntax highlighting and query suggestions.
- **Query Execution**: Parses and processes SQL-like queries on JSON data.
- **Dynamic Table Rendering**: Displays query results in an interactive table.

### ⚡ **Advanced Features**
- **Click-to-Generate SQL Queries**: Clicking on a cell auto-generates a SQL query.
- **Chunk-Based Data Loading**: Renders large datasets in chunks of **50-300 rows**.
- **Fullscreen Toggle**: Three sections (Editor, Table, Terminal) support fullscreen mode.
- **LocalStorage State Persistence**: Retains fullscreen state after page reload.
- **Error Handling**: Displays error messages for invalid queries.
- **Terminal Clear Button**: Clears console output with one click.

---

## 🛠️ Tech Stack
- **Frontend**: React.js
- **UI Libraries**: CodeMirror for query editor
- **State Management**: React Hooks & LocalStorage
- **Data Handling**: JSON processing (converted from CSV)
- **Deployment**: Netlify/Vercel

---

## 📊 Performance Optimizations
- **Efficient JSON Query Execution**: Queries are executed in-memory without a backend.
- **Lazy Rendering for Large Data**: Prevents performance issues with chunk-based loading.
- **Reduced Re-renders**: Optimized component updates using React's `useMemo` and `useCallback`.
- **Minimized DOM Updates**: Virtualized table rendering for faster UI updates.

---

## 🏆 Challenges & Learnings
### 🔴 **Challenges Faced:**
1. Handling large datasets efficiently without freezing the browser.
2. Implementing space-separated SQL parsing without a backend.
3. Ensuring seamless UI interactions while handling state across multiple sections.

### ✅ **Solutions Implemented:**
1. **Chunk-based Rendering**: Only **50-300 rows** are displayed at a time.
2. **String Parsing for SQL-Like Queries**: Used regex and JavaScript methods to extract conditions.
3. **LocalStorage for State Persistence**: Maintains fullscreen state across reloads.

---

## 🔗 Deployment & Submission Details
- **GitHub Repository**: [Project Repo](#) *(Replace with actual link)*
- **Live Demo**: [Deployed Link](#) *(Replace with actual link)*
- **Video Walkthrough**: [Video Link](#) *(Replace with actual link)*
- **ER Diagram & System Design**: [Diagrams](#) *(Replace with actual link)*

---

## 📜 How to Run Locally
```bash
# Clone the repository
git clone https://github.com/your-repo-link.git
cd your-repo

# Install dependencies
npm install

# Start the development server
npm start
```

---

## 📌 Future Improvements
- **Add Previous Button for Pagination**
- **Enhance Query Parsing with SQL Parser Library**
- **Improve UI for Large Table Display**

---

### 📬 Contact
For any queries, feel free to reach out!

