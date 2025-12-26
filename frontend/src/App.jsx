import { useEffect, useMemo, useState } from "react";
import FeedbackForm from "./components/FeedbackForm.jsx";
import FeedbackList from "./components/FeedbackList.jsx";
import InsightCards from "./components/InsightCards.jsx";
import FilterBar from "./components/FilterBar.jsx";
import AuthPanel from "./components/AuthPanel.jsx";

const API_BASE = "";

async function fetchJson(path, options = {}, accessToken) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

function buildQuery(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return params.toString();
}

function App() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("access") || "");
  const [filters, setFilters] = useState({
    search: "",
    sentiment: "",
    channel: "",
    product: "",
    status: "",
    from: "",
    to: "",
    tags: "",
  });

  const loadFeedback = async (opts = {}) => {
    setLoading(true);
    setError("");
    try {
      const query = buildQuery({ ...filters, ...opts });
      const data = await fetchJson(`/api/feedback${query ? `?${query}` : ""}`, {}, accessToken);
      setFeedback(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const data = await fetchJson("/api/feedback/stats", {}, accessToken);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    loadFeedback();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    loadFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const insights = useMemo(() => {
    if (stats) {
      return {
        avgRating: stats.avgRating,
        total: stats.total,
        sentiments: stats.sentiments || {},
      };
    }
    if (!feedback.length) return { avgRating: 0, total: 0, sentiments: {} };
    const total = feedback.length;
    const avgRating =
      feedback.reduce((sum, item) => sum + (item.rating || 0), 0) / Math.max(total, 1);
    const sentiments = feedback.reduce((map, item) => {
      map[item.sentiment] = (map[item.sentiment] || 0) + 1;
      return map;
    }, {});
    return { avgRating: Number(avgRating.toFixed(2)), total, sentiments };
  }, [feedback, stats]);

  const handleSubmit = async (payload) => {
    setError("");
    try {
      await fetchJson(
        "/api/feedback",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        accessToken
      );
      await Promise.all([loadFeedback(), loadStats()]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = () => {
    window.open("/api/feedback/export", "_blank");
  };

  const handleAuthSuccess = (token) => {
    setAccessToken(token);
    localStorage.setItem("access", token);
  };

  const handleLogout = () => {
    setAccessToken("");
    localStorage.removeItem("access");
    setFeedback([]);
    setStats(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Dashboard</p>
            <h1 className="text-2xl font-bold">Customer Feedback Intelligence</h1>
          </div>
          <div className="flex items-center gap-2">
            {accessToken ? (
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-rose-500 hover:text-rose-200 transition-colors"
              >
                Logout
              </button>
            ) : null}
            <button
              onClick={handleExport}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-indigo-500 hover:text-indigo-200 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {!accessToken ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Please log in or sign up to access the feedback dashboard.
            </p>
            <AuthPanel onAuth={handleAuthSuccess} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-4">
              <div className="space-y-3">
                <FeedbackForm onSubmit={handleSubmit} />
                {error && (
                  <div className="text-sm text-rose-400 bg-rose-950/50 border border-rose-800 px-3 py-2 rounded-md">
                    Error: {error}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <InsightCards
                  insights={insights}
                  loading={loading || statsLoading}
                  topTags={stats?.topTags}
                  topKeywords={stats?.topKeywords}
                />
                <FilterBar filters={filters} onChange={setFilters} />
              </div>
            </div>

            <FeedbackList items={feedback} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

