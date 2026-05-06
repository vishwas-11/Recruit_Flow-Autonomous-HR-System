# RecruitFlow

RecruitFlow is an AI-assisted hiring workflow platform with a Next.js frontend and a FastAPI backend. It supports role-based authentication, chat-driven hiring workflows, interview scheduling, admin-only research and onboarding flows, and employee record lookup from MongoDB.

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- Axios for API calls
- `react-hot-toast` for notifications
- Tailwind CSS 4 and custom CSS

### Backend
- FastAPI
- Uvicorn
- MongoDB with Motor (async driver)
- JWT authentication with `python-jose`
- Password hashing with `passlib[bcrypt]`
- LangChain and LangGraph for agent orchestration
- OpenAI via `langchain-openai`
- Tavily for web search
- Firecrawl for web scraping
- Playwright for browser automation support
- Pydantic / Pydantic Settings

## What The App Does

- User registration and login with JWT-based sessions
- Role-based access control for `user` and `admin`
- AI chat workflows for interview prep, scheduling, research, and onboarding
- Admin dashboard to review employees, candidate conversations, and research logs
- Employee onboarding record lookup, including a welcome document
- Calendar view backed by MongoDB event records

## Architecture Overview

The project is split into two applications:

- `frontend/` is the customer-facing web app built with Next.js.
- `backend/` is the API server that handles auth, chat, admin data, calendar data, and employee records.

The frontend stores the JWT in `localStorage`, sends it as a Bearer token, and uses it to access protected routes.

The backend loads environment variables with `python-dotenv`, verifies JWTs on protected routes, and persists data in MongoDB.

## Implementation Details

### Authentication
- Users register and log in through the FastAPI auth routes.
- Passwords are hashed with bcrypt before being stored.
- Login returns a signed JWT with `user_id`, `username`, and `role`.
- Protected API routes read the Bearer token and reject invalid or missing tokens.

### Chat System
- Chat requests are routed through LangGraph.
- The graph chooses between interview, research, onboarding, scheduler, unauthorized, and tech nodes.
- The router also considers the logged-in user role, so admin-only actions are blocked for normal users.
- Messages are stored in MongoDB so chat history can be restored per user.
- The frontend groups history by agent and renders structured responses when JSON is returned.

### Admin Tools
- Admin endpoints expose:
  - employee records
  - candidate conversations
  - research logs
- These endpoints are guarded by role checks on the backend.

### Employee Records
- Employee data is stored in MongoDB.
- The frontend can show the signed-in employee’s onboarding record and welcome document.

### Calendar
- Calendar events are read from the `events` collection in MongoDB.
- The chat UI refreshes the calendar after scheduling-related responses.

### External AI and Research Services
- OpenAI powers the LLM used by the agents.
- Tavily is used for search-driven research.
- Firecrawl scrapes web pages and returns markdown for research workflows.

## Folder Structure

```text
recruit_flow/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── graph.py
│   │   │   ├── state.py
│   │   │   └── nodes/
│   │   │       ├── interview_node.py
│   │   │       ├── tech_node.py
│   │   │       ├── research_node.py
│   │   │       ├── onboarding_node.py
│   │   │       ├── scheduler_node.py
│   │   │       ├── unauthorized_node.py
│   │   │       └── llm.py
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── admin.py
│   │   │   ├── chat.py
│   │   │   ├── calendar.py
│   │   │   └── employee.py
│   │   ├── db/
│   │   │   └── connection.py
│   │   ├── models/
│   │   │   ├── auth.py
│   │   │   └── chat.py
│   │   ├── services/
│   │   │   ├── memory_service.py
│   │   │   ├── skill_extractor.py
│   │   │   ├── summarizer.py
│   │   │   ├── text_processor.py
│   │   │   ├── web_search.py
│   │   │   └── web_scraper.py
│   │   ├── tools/
│   │   │   ├── bash_tool.py
│   │   │   ├── calendar_tools.py
│   │   │   ├── file_tool.py
│   │   │   └── tool_search.py
│   │   └── utils/
│   │       ├── auth.py
│   │       └── id_generator.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── admin/
│   │   └── calendar/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── ProtectedRoute.jsx
│   │   ├── ShapeGrid.js
│   │   └── StructuredResponse.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── auth.js
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
└── README.md
```

## Environment Variables

Create a `.env` file for each app.

### Backend `.env`

```env
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Setup

### 1. Backend

Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Run the web app:

```bash
npm run dev
```

## Useful API Routes

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Chat
- `GET /chat/history`
- `POST /chat`

### Admin
- `GET /admin/employees`
- `GET /admin/candidates`
- `GET /admin/research`

### Employee
- `GET /employee/me`

### Calendar
- `GET /calendar`

## Notes

- The backend uses MongoDB database name `recruit_flow`.
- The frontend expects the backend API URL to be available through `NEXT_PUBLIC_API_URL`.
- Admin-only chat flows and admin dashboard pages depend on the JWT `role` claim.

## License

No license file is currently included.
