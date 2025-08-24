<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6&height=200&section=header&text=Network%20and%20Job%20Portal&fontSize=42&fontColor=fff"/>
  <h1>Professional Career & Networking Platform</h1>
  <p><em>Full-Stack Architecture • Web3 Technology • AI Intelligence</em></p>
  
  <table align="center">
    <tr>
      <td><b>Architecture</b></td>
      <td>Full-Stack Development</td>
    </tr>
    <tr>
      <td><b>Blockchain</b></td>
      <td>Web3 Integration</td>
    </tr>
    <tr>
      <td><b>Intelligence</b></td>
      <td>AI-Powered Features</td>
    </tr>
  </table>
  <br/>
  
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Web3-F16822?style=for-the-badge&logo=web3.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Groq%20AI-FF6F00?style=for-the-badge&logo=artificial-intelligence&logoColor=white"/>
  
  <br/><br/>
  
  <img src="https://img.shields.io/badge/Status-Ready-success?style=flat-square"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square"/>
 
</div>

---

## Overview

**Job Portal** is a comprehensive career and networking platform that integrates the functionality of LinkedIn, Upwork, and AngelList into a unified application. The platform leverages modern web technologies, blockchain integration, and artificial intelligence to provide a sophisticated job posting and networking experience.

### Core Capabilities
- **Professional Networking**: Social feed with posts, likes, and comments
- **Job Marketplace**: Advanced job posting and application system
- **Blockchain Integration**: MetaMask wallet integration with secure job posting
- **AI-Powered Features**: Resume parsing and intelligent job recommendations
- **Scalable Architecture**: Enterprise-grade deployment on cloud platforms

---

<h2>
  LINK : 
  </h2>
 <h3>Click Below</h3>

<h3>
 <p></p></P><a href="https://www.network-job-portal.netlify.app/"> Network_and_Job_portal </a></p>   
</h3>

---

## Features

### Authentication & Profile Management
- Secure user authentication with session management
- Comprehensive profile creation and editing capabilities
- LinkedIn URL integration
- Skills management (manual input or AI-extracted)
- Public wallet address integration via MetaMask

### Social Networking
- Post creation and sharing functionality
- Interactive engagement system (likes and comments)
- Professional networking feed
- Real-time content updates
- User interaction tracking

### Job Management System
- Advanced job posting with payment verification
- Comprehensive job listing and search capabilities
- AI-powered job recommendations based on user skills
- Streamlined job application process
- Blockchain-verified payment system for job postings

### Web3 Integration
- MetaMask wallet connectivity
- Polygon/Ethereum testnet transaction support
- Smart contract integration for payments
- Blockchain transaction verification
- Secure cryptocurrency payment processing

### AI-Powered Features
- Resume upload and parsing via Groq API
- Automated skills extraction from documents
- Professional summary generation
- Intelligent job matching algorithms
- Skills-based recommendation engine

---

## Technology Stack

### Frontend Development
- **Framework**: React.js
- **Styling**: Custom CSS
- **State Management**: React Hooks
- **Deployment**: Netlify

### Backend Development
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Session-based authentication
- **File Processing**: Multer for resume uploads
- **Deployment**: Render

### Database
- **Primary Database**: MongoDB Atlas
- **Data Modeling**: Mongoose ODM
- **Cloud Storage**: MongoDB Atlas Cloud

### Blockchain Integration
- **Wallet Integration**: MetaMask
- **Web3 Library**: Ethers.js
- **Network**: Polygon/Ethereum Testnet
- **Smart Contracts**: Custom payment verification

### AI/Machine Learning
- **AI Provider**: Groq API
- **Natural Language Processing**: Resume parsing and analysis
- **Recommendation Engine**: Skills-based job matching
- **Data Processing**: Automated content extraction

---

<img width="1591" height="891" alt="Image" src="https://github.com/user-attachments/assets/480e8f85-fdf6-412d-a12d-b12a38941604" />





<img width="1200" height="891" alt="Image" src="https://github.com/user-attachments/assets/b232fba6-8235-4b50-afcb-7fc62df14f1d" />

---

## Project Structure

```
project-root/
├── client/                     # Frontend React Application
│   ├── public/                # Static assets
│   └── src/                   # Source code
│       ├── components/        # React components
│       ├── App.js            # Main application component
│       ├── App.css           # Application styles
│       ├── index.js          # Application entry point
│       └── index.css         # Global styles
|
├── models/                    # MongoDB Data Models
│   ├── Job.js                # Job posting schema
│   ├── Post.js               # Social post schema
│   └── User.js               # User profile schema
|
├── routes/                    # API Route Handlers
│   ├── auth.js               # Authentication endpoints
│   ├── feed.js               # Social feed endpoints
│   ├── jobs.js               # Job management endpoints
│   └── profile.js            # Profile management endpoints
|
├── uploads/                   # File upload directory
├── server.js                 # Backend server entry point
└── package.json              # Project dependencies
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Groq API key
- MetaMask browser extension

### Backend Configuration

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/job-networking-portal.git
   cd job-networking-portal
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment configuration**
   Create a `.env` file in the backend directory:
   ```ini
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   GROQ_API_KEY=your_groq_api_key
   SESSION_SECRET=your_session_secret
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

### Frontend Configuration

1. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```


2. **Start the development server**
   ```bash
   npm start
   ```

---

## API Documentation

### Authentication Routes (`/api/auth`)
- `POST /login` - User authentication
- `POST /signup` - New user registration
- `POST /logout` - User session termination

### Social Feed Routes (`/api/feed`)
- `GET /` - Retrieve all posts
- `POST /` - Create new post
- `POST /:postId/like` - Toggle post like
- `POST /:postId/comment` - Add comment to post

### Job Management Routes (`/api/jobs`)
- `GET /` - Retrieve all job listings
- `POST /` - Create new job posting
- `GET /recommended/:userId` - Get personalized job recommendations
- `POST /:jobId/apply` - Submit job application
- `POST /pay-and-post` - Process blockchain payment for job posting

### Profile Management Routes (`/api/profile`)
- `GET /:userId` - Retrieve user profile
- `PUT /:userId` - Update user profile
- `POST /upload-resume` - Process resume upload with AI analysis

---

## AI Integration Workflow

### Resume Processing Pipeline
1. **File Upload**: User uploads resume through the web interface
2. **Content Extraction**: Server processes the uploaded file
3. **AI Analysis**: Content is sent to Groq API for analysis
4. **Skills Extraction**: AI identifies and extracts relevant skills
5. **Summary Generation**: Professional summary is automatically generated
6. **Data Storage**: Results are stored in MongoDB for future reference
7. **Recommendation Engine**: Extracted skills power job recommendation algorithms

---

## Blockchain Integration Workflow

### Payment Processing System
1. **Wallet Connection**: User connects MetaMask wallet
2. **Job Posting Initiation**: User attempts to create a job posting
3. **Payment Request**: System prompts for blockchain payment
4. **Transaction Processing**: Payment is processed via Ethers.js
5. **Verification**: Transaction is confirmed on Polygon/Ethereum testnet
6. **Job Creation**: Job posting is created only after successful payment verification

---

## Deployment Architecture

### Production Environment
- **Frontend Hosting**: Netlify with continuous deployment
- **Backend Hosting**: Render with automatic scaling
- **Database**: MongoDB Atlas with global clusters
- **CDN**: Integrated content delivery for optimal performance

### Development Environment
- **Local Development**: React development server and Node.js
- **Testing**: Polygon Amoy testnet for blockchain testing
- **API Testing**: Postman collection for endpoint testing




---



<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6&height=100&section=footer"/>
</div>
