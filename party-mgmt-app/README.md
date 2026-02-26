# Party Management System — React App

A full-featured Political Party Management System built with React.

## Prerequisites
- Node.js v16+ (https://nodejs.org)
- npm v8+

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

The app will open automatically at **http://localhost:3000**

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

## Demo Login Credentials

| Role                    | Email                  | Password  |
|-------------------------|------------------------|-----------|
| Super Admin             | rajiv@party.in         | admin123  |
| State Coordinator       | priya@party.in         | admin123  |
| District Coordinator    | deepa@party.in         | admin123  |
| Booth Worker            | ravi@party.in          | admin123  |

## Project Structure

```
party-mgmt-app/
├── public/
│   └── index.html        # HTML entry point
├── src/
│   ├── index.js          # React DOM root
│   └── App.jsx           # Main app (all components)
├── package.json
└── README.md
```

## Features
- 🔐 Role-based login (5 roles)
- 📊 Dashboard with live stats
- 👥 Worker management
- 📋 Task management
- 📄 Field reports
- 📅 Events & campaigns
- 💬 Communication panel
- 🗺 Area management
- 📈 Analytics
