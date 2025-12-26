function InsightCards({ insights, loading, topTags = [], topKeywords = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card title="Total" loading={loading}>
        <div className="text-3xl font-semibold">{loading ? "..." : insights.total}</div>
        <p className="text-xs text-slate-400">All feedback records</p>
      </Card>
      <Card title="Avg rating" loading={loading}>
        <div className="text-3xl font-semibold">{loading ? "..." : insights.avgRating}</div>
        <p className="text-xs text-slate-400">Across submitted feedback</p>
      </Card>
      <Card title="Sentiment" loading={loading}>
        {loading ? (
          <div className="text-2xl font-semibold">...</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(insights.sentiments).map(([label, count]) => (
              <span
                key={label}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                  label === "positive"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : label === "negative"
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                    : "border-sky-500/40 bg-sky-500/10 text-sky-300"
                }`}
              >
                {label}: {count}
              </span>
            ))}
          </div>
        )}
      </Card>

      <Card title="Top tags" loading={loading} className="sm:col-span-2">
        <div className="flex flex-wrap gap-2">
          {topTags?.length ? (
            topTags.map((tag) => (
              <span
                key={tag._id}
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border border-slate-700 bg-slate-800/80 text-slate-200"
              >
                {tag._id} · {tag.count}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No tag data yet.</span>
          )}
        </div>
      </Card>

      <Card title="Top keywords" loading={loading}>
        <div className="flex flex-wrap gap-2">
          {topKeywords?.length ? (
            topKeywords.map((kw) => (
              <span
                key={kw._id}
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border border-slate-700 bg-slate-800/80 text-slate-200"
              >
                {kw._id} · {kw.count}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No keyword data yet.</span>
          )}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children, loading, className = "" }) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2 ${className}`}
    >
      <p className="text-sm text-slate-400">{title}</p>
      {loading ? <div className="text-sm text-slate-500">...</div> : children}
    </div>
  );
}

export default InsightCards;

