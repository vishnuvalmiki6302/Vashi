# Customer Feedback Insights (React + Express + MongoDB)

End-to-end starter for reading and analyzing customer feedback. Backend offers REST endpoints with a lightweight sentiment/keyword heuristic; frontend lets you submit feedback and view insights.

## Quick start

Prereqs: Node 18+, MongoDB running locally.

1) Backend
```
cd backend
cp env.example .env   # adjust if needed
npm install
npm run dev           # listens on 4000 by default
```

2) Frontend
```
cd frontend
npm install
npm run dev           # Vite dev server on 5173, proxies to backend
```

Open http://localhost:5173.

## API
- `GET /health`
- `GET /api/feedback` – optional `channel`, `sentiment` query params
- `POST /api/feedback` – body: `{ text, rating?, channel?, customerId?, tags? }`

## Notes
- `analysisService` is a placeholder; swap with a real NLP pipeline or LLM call.
- CORS is limited by `ALLOWED_ORIGINS` in `env.example`.
- `keywords` are naive; replace with a better extractor for production use.
- TailwindCSS is wired for the frontend; see `frontend/tailwind.config.js`.

