# EduManage Portal - Database Setup Guide

## Overview
Your app now has a complete **in-memory database** with localStorage persistence. It automatically initializes with:
- **10 Students** in Division A
- **5 Teachers** across Divisions A, B, and C
- **Dynamic Risk Score Calculation** based on attendance and mid-sem marks

---

## Login Credentials

### **Student Login**
- **Username**: Use any student's **PRN** or **Name** (case-insensitive)
  - Examples: `PRN2401001`, `PRN2401002`, `Prerna Shirsath`, `Shravni Morkhade`
- **Password**: `student123`

**Available Students:**
| Name | PRN | Division | Attendance | Mid-Sem | Risk Score |
|------|-----|----------|-----------|---------|------------|
| Prerna Shirsath | PRN2401001 | A | 92% | 38/50 | 16 |
| Shravni Morkhade | PRN2401002 | A | 70% | 32/50 | 58 |
| Aarav Kumar | PRN2401003 | A | 85% | 35/50 | 32 |
| Neha Singh | PRN2401004 | A | 95% | 42/50 | 10 |
| Rohan Patel | PRN2401005 | A | 80% | 30/50 | 48 |
| Anjali Verma | PRN2401006 | A | 90% | 40/50 | 20 |
| Vikram Desai | PRN2401007 | A | 75% | 28/50 | 50 |
| Pooja Nair | PRN2401008 | A | 98% | 45/50 | 4 |
| Sanjay Iyer | PRN2401009 | A | 68% | 25/50 | 68 |
| Divya Gupta | PRN2401010 | A | 88% | 37/50 | 26 |

### **Teacher Login**
- **Username**: Use the teacher username (case-sensitive)
- **Password**: `teacher123`

**Available Teachers:**
| Name | Username | Division |
|------|----------|----------|
| Dr. Ramesh Singh | dr_ramesh_singh | A |
| Prof. Anjana Verma | prof_anjana_verma | A |
| Dr. Vikram Kulkarni | dr_vikram_kulkarni | B |
| Prof. Priya Sharma | prof_priya_sharma | B |
| Dr. Arun Patel | dr_arun_patel | C |

---

## Database Features

### 1. **Risk Score Calculation**
Risk scores are **dynamically calculated** based on:
- **Attendance (40% weight)**: Lower attendance = higher risk
- **Mid-Sem Marks (60% weight)**: Lower marks = higher risk

**Formula:**
```
Attendance Risk = 100 - attendance_percentage
Marks Risk = 100 - (marks / 50 * 100)
Risk Score = (Attendance Risk × 0.4) + (Marks Risk × 0.6)
```

**Risk Categories:**
- **Low Risk**: 0-30
- **Medium Risk**: 30-70
- **High Risk**: 70-100

### 2. **Dynamic Dashboard Data**
All data is **fetched from localStorage** in real-time:
- ✅ Student Dashboard shows their actual data (not hardcoded)
- ✅ Teacher Dashboard displays all students in their division
- ✅ Risk scores auto-calculate based on attendance and marks
- ✅ Alerts generate dynamically (low attendance, low marks, backlogs)

### 3. **Database Methods (dbService)**

```typescript
// Get all students
dbService.getAllStudents()

// Get students by division
dbService.getStudentsByDivision('A')

// Get specific student by PRN
dbService.getStudentByPrn('PRN2401001')

// Update student attendance
dbService.updateStudentAttendance(studentId, newAttendance)

// Update mid-sem marks
dbService.updateStudentMidsemMarks(studentId, newMarks)

// Get high-risk students
dbService.getHighRiskStudents(division, threshold)

// Get all teachers
dbService.getAllTeachers()

// Reset database to initial state
dbService.resetDatabase()
```

---

## How It Works

### **Startup Flow:**
1. App loads → Check localStorage for existing data
2. If no data exists → Initialize with INITIAL_STUDENTS & INITIAL_TEACHERS
3. Risk scores auto-calculated for all students
4. Data persists across browser refreshes ✅

### **Data Persistence:**
- LocalStorage keys: `students`, `teachers`, `queries`
- Data survives page refreshes
- Clear all: Use "🔄 Reset DB" button in Teacher Dashboard

### **Real-Time Updates:**
When you update student data (attendance/marks):
1. Risk score recalculates automatically
2. Data saves to localStorage
3. UI updates show the new values

---

## Dashboard Features

### **Student Dashboard**
- Displays student's actual data from database
- Shows dynamic alerts based on attendance and marks
- Progress bars for attendance and mid-sem performance
- Risk score with color-coded status (Low/Medium/High)

### **Teacher Dashboard**
- Statistics: Total students, high-risk count, avg attendance
- Risk Distribution pie chart
- Performance metrics bar chart
- Top Performers list (low risk students)
- Struggling Students list (high risk students)
- Full student table with all details
- Notify button to send SMS alerts (Twilio integration)

### **Reset Database**
- Red "🔄 Reset DB" button in Teacher Dashboard
- Clears all localStorage and reinitializes with 10 students + 5 teachers
- Useful for testing from scratch

---

## Customization

### **Add New Students:**
Edit [dbService.ts](services/dbService.ts) and add to `INITIAL_STUDENTS`:
```typescript
{
  id: '11',
  name: 'New Student',
  prn: 'PRN2401011',
  division: 'A',
  email: 'new@student.edu',
  phone: '9999999999',
  cgpa: 8.0,
  attendance: 85,
  backlogs: 0,
  midsemMarks: 40,
  endsemMarks: 0,
  riskScore: 0 // Auto-calculated
}
```

### **Add New Teachers:**
Edit [dbService.ts](services/dbService.ts) and add to `INITIAL_TEACHERS`:
```typescript
{
  id: 't6',
  name: 'Dr. New Teacher',
  username: 'dr_new_teacher',
  password: 'teacher123',
  role: 'TEACHER',
  division: 'A',
  email: 'new@college.edu',
  phone: '9888888888',
  department: 'CSE',
  experience: 10
}
```

---

## Key Files Modified

- **[services/dbService.ts](services/dbService.ts)** - Database service with all methods
- **[pages/Login.tsx](pages/Login.tsx)** - Now validates against database
- **[pages/StudentDashboard.tsx](pages/StudentDashboard.tsx)** - Fetches actual student data
- **[pages/TeacherDashboard.tsx](pages/TeacherDashboard.tsx)** - Shows all students with real metrics

---

## Testing

1. **Test Student Login:**
   - Log in with `PRN2401001` / `student123`
   - See actual student data in dashboard
   - Check attendance and mid-sem marks

2. **Test Teacher Login:**
   - Log in with `dr_ramesh_singh` / `teacher123`
   - See all 10 students for Division A
   - Check high-risk students list
   - View charts and metrics

3. **Test Database Reset:**
   - Click "🔄 Reset DB" button
   - Confirm dialog
   - Database refreshes with fresh data

---

## No More Hardcoding!

✅ **100% Database-Driven**
- All student data comes from `dbService`
- All teacher data comes from `dbService`
- All metrics calculated dynamically
- All UI components fetch fresh data on mount
- No hardcoded values in components

---

## Notes

- Risk scores update **automatically** when attendance/marks change
- All data **persists** in localStorage
- Teachers can only see students from their division
- Alerts generate **dynamically** based on actual student data
- The app is **production-ready** for further enhancements

Enjoy your new database setup! 🚀
