# MindWeave – EduManage

## AI‑Based Drop‑out Prediction and Counselling Web Application

MindWeave – EduManage is a **full-stack web application** designed to **predict student drop-out risks** and provide **data-driven counselling insights**. It combines AI services with a React frontend to help educational institutions identify at-risk students early and provide actionable recommendations.

---

##  Problem Statement

Student drop-outs are a significant challenge in educational institutions. Early detection allows for timely intervention and personalized counselling. MindWeave – EduManage addresses this problem by integrating AI-driven predictions into an interactive web application.

---

##  Features

* AI-based drop-out prediction using integrated services
* Interactive, user-friendly React frontend
* Dashboard for visualizing student risk scores
* Counselling recommendations for at-risk students
* Easy deployment on local development or AI Studio

---

##  Tech Stack

* **Frontend:** React, TypeScript, HTML, CSS
* **Backend:** Node.js / Express (handles AI API calls)
* **AI Service:** Gemini API or other integrated AI service
* **Database:** (if applicable, e.g., MongoDB / SQLite)
* **Environment Variables:** `.env.local` for API keys

---

##  Project Structure

```
MindWeave_EduManage/
│
├── backend/           # Backend server logic
├── frontend/          # React frontend code
├── components/        # Reusable UI components
├── pages/             # App pages (React routing)
├── services/          # AI / API integration logic
├── public/            # Static assets
├── .env.local          # Environment variables (API keys)
├── package.json        # NPM dependencies
└── README.md           # Project documentation
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/shravanimane05/MindWeave_EduManage.git
cd MindWeave_EduManage
```

2. **Install dependencies**

```bash
npm install
```

3. **Set environment variables**

```bash
# Create .env.local file
GEMINI_API_KEY=your_api_key_here
```

4. **Run the application**

```bash
npm run dev
```

The app should now be accessible at `http://localhost:3000`

---

##  AI Prediction Workflow

* Frontend collects student data through forms or uploads
* Data is sent to the backend via API endpoints
* Backend forwards the data to the AI service (Gemini API)
* AI predicts drop-out probability and returns actionable counselling suggestions
* Results are displayed on the dashboard for educators

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`feature/your-feature-name`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

##  License

This project is licensed under the **MIT License**.

---

##  Acknowledgements

* React and TypeScript documentation
* AI Studio and Gemini API resources
* Open-source frontend and backend libraries
