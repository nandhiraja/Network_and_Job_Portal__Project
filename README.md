# Job Networking Portal with AI & Blockchain Integration

A modern job networking platform featuring AI-powered resume summarization and job recommendations, alongside blockchain-verified job postings via MetaMask.

---

##  Key Features

### Dashboard Sections
- **Feed**  
  Create, like, and comment on posts to engage with the community.

- **Jobs**  
  Post and browse job opportunities. Every new job post is recorded immutably on the blockchain using MetaMask, ensuring transparency and trust.

- **Profile**  
  Manage your personal information, role, skills, and resume. AI-powered resume summarization (via Groq) extracts key insights to enhance your profile and job recommendations.

### AI-Powered Resume Summarization & Job Recommendations
- Extracts summary from uploaded resumes using Groq AI.
- Matches user skills with job requirements using a keyword-based algorithm.
- Provides personalized job suggestions tailored to your profile.

### Blockchain Integration
- Job postings are sent to the blockchain through MetaMask wallet connection.
- Ensures tamper-proof, verifiable job data.
- Increases user trust and platform security.

---


##  Quick Setup & Usage

1. Clone the repository and install backend and frontend dependencies.
2. Start MongoDB locally or configure a cloud instance.
3. Run backend and frontend servers.
4. Connect your MetaMask wallet to enable blockchain features.
5. Sign up and log in to access your dashboard.
6. Upload resumes for AI summarization.
7. Engage with posts, browse/apply for jobs, and update your profile.

---

## 📁 Project Structure
```
File Structure
.
├── client
│   ├── package.json
│   ├── public
│   │   └── index.html
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── components
│       │   ├── CommentList.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Feed.jsx
│       │   ├── JobCard.jsx
│       │   ├── JobPostForm.jsx
│       │   ├── Jobs.jsx
│       │   ├── Login.jsx
│       │   ├── Navbar.jsx
│       │   ├── PostForm.jsx
│       │   ├── Profile.jsx
│       │   └── Signup.jsx
│       ├── index.css
│       └── index.js
├── models
│   ├── Job.js
│   ├── Post.js
│   └── User.js
├── package.json
├── routes
│   ├── auth.js
│   ├── blockchain.js
│   ├── feed.js
│   ├── jobs.js
│   └── profile.js
├── server.js
├── uploads
│   
└── utils    
    └── simpleBlockchain.js

```

---

## 🔧 Technologies Used

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, React Hooks, React Icons
- **Blockchain:** MetaMask integration for job posting verification
- **AI Integration:** Groq for resume summarization and keyword extraction
- **Other:** RESTful APIs, CORS, dotenv for environment management

---




