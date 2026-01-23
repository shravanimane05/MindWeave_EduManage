# MongoDB Setup Guide for MindWeave EduManage

## Quick Setup (Recommended)

### Option 1: MongoDB Community Server (Local Installation)

1. **Download MongoDB Community Server**
   - Go to https://www.mongodb.com/try/download/community
   - Download for Windows
   - Install with default settings

2. **Start MongoDB Service**
   - MongoDB should start automatically after installation
   - If not, run: `net start MongoDB` in Command Prompt as Administrator

3. **Verify Connection**
   - Open Command Prompt
   - Run: `mongosh` (if installed) or `mongo`
   - You should see MongoDB shell

### Option 2: MongoDB Atlas (Cloud - Free Tier)

1. **Create Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to you

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Update `.env.local` with your connection string

## Database Structure

The application will automatically create:

### Collections:
- **students**: Student data with PRN, name, division, marks, attendance
- **teachers**: Teacher data with username, password, division
- **queries**: Student queries and teacher responses

### Sample Data:
- **Students**: 10 students across divisions A and B
- **Teachers**: 3 teachers for different divisions
- **Default Passwords**: 
  - Students: `student123`
  - Teachers: `teacher123`

## Environment Variables

Make sure your `.env.local` contains:
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=edumanage
SERVER_PORT=4000
```

## Troubleshooting

1. **Connection Error**: Make sure MongoDB service is running
2. **Port 27017 in use**: Check if MongoDB is already running
3. **Permission Error**: Run Command Prompt as Administrator

## Login Credentials

### Students (Division A):
- PRN2401001 / student123 (Prerna Shirsath)
- PRN2401002 / student123 (Shravni Morkhade)
- PRN2401003 / student123 (Aarav Kumar)
- PRN2401004 / student123 (Neha Singh)
- PRN2401005 / student123 (Rohan Patel)

### Students (Division B):
- PRN2401006 / student123 (Anjali Verma)
- PRN2401007 / student123 (Vikram Desai)
- PRN2401008 / student123 (Pooja Nair)
- PRN2401009 / student123 (Sanjay Iyer)
- PRN2401010 / student123 (Divya Gupta)

### Teachers:
- dr_ramesh_singh / teacher123 (Division A)
- prof_anjana_verma / teacher123 (Division B)
- dr_vikram_kulkarni / teacher123 (Division C)