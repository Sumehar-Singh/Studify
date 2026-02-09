# Smart Study Planner

A modern, vanilla JavaScript web application to help students monitor their study schedules, manage subjects, and track tasks.

## 🌐 Live Demo

**[View Live Application](https://sumehar-studify.vercel.app/)**

## 📖 Description

Smart Study Planner is a comprehensive student productivity tool built with vanilla JavaScript, HTML5, and CSS3. It helps students organize their academic life by managing subjects, creating weekly schedules, tracking assignments, and visualizing progress through interactive analytics. All data is stored locally in the browser using LocalStorage, ensuring privacy and offline functionality.

## Features

- **Dashboard**: Quick overview of total subjects, pending tasks, and today's schedule.
- **Subject Management**: Add, edit, and delete subjects with priority levels.
- **Schedule Planner**: Weekly timetable management with conflict prevention.
- **Task Manager**: Track assignments and exams with deadlines and status.
- **Analytics**: Visual breakdown of task completion rates using CSS-only charts.
- **Settings**:

  - Data Persistence via LocalStorage.
  - Data Export/Backup (JSON).
  - Data Reset.

## Technology Stack

- **HTML5**: Semantic structure.
- **CSS3**: Responsive design, CSS Variables, Flexbox/Grid.
- **Vanilla JavaScript**: ES6 Modules, DOM Manipulation.
- **LocalStorage**: Client-side data persistence.

## Project Structure

```
PepProject/
├── index.html              # Main Entry Point
├── styles/                 # CSS Stylesheets
│   ├── main.css            # Global Styles
│   ├── dashboard.css       # Dashboard View Styles
│   ├── subjects.css        # Subject Management Styles
│   ├── schedule.css        # Schedule Planner Styles
│   ├── tasks.css           # Task Manager Styles
│   └── analytics.css       # Analytics and Charts Styles
└── scripts/                # JavaScript Logic
    ├── app.js              # Main Controller
    ├── storage.js          # LocalStorage Wrapper
    └── modules/            # Feature Modules
        ├── dashboard.js
        ├── subjects.js
        ├── schedule.js
        ├── tasks.js
        ├── analytics.js
        └── settings.js
```

## How to Run

1.  Open the `PepProject` folder.
2.  Open `index.html` in any modern web browser to start the application.
3.  No server installation or build step required.

## Usage Guide

1.  **Start**: Go to "Subjects" and add your courses.
2.  **Plan**: Go to "Schedule" and assign subjects to time slots.
3.  **Track**: Go to "Tasks" to add assignments and deadlines.
4.  **Monitor**: Check "Dashboard" and "Analytics" for progress.


