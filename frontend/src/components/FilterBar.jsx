const sentiments = [
  { label: "All", value: "" },
  { label: "Positive", value: "positive" },
  { label: "Neutral", value: "neutral" },
  { label: "Negative", value: "negative" },
];

const channels = [
  { label: "All", value: "" },
  { label: "Web", value: "web" },
  { label: "Email", value: "email" },
  { label: "Chat", value: "chat" },
  { label: "Store", value: "store" },
  { label: "Phone", value: "phone" },
  { label: "Other", value: "other" },
];

const statuses = [
  { label: "All", value: "" },
  { label: "Open", value: "open" },
  { label: "Resolved", value: "resolved" },
];

function FilterBar({ filters, onChange }) {
  const update = (key, value) => onChange((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Filters & search</h3>
        <button
          onClick={() =>
            onChange({
              search: "",
              sentiment: "",
              channel: "",
              product: "",
              status: "",
              from: "",
              to: "",
              tags: "",
            })
          }
          className="text-xs text-slate-400 hover:text-indigo-200"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Search text..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={filters.tags}
          onChange={(e) => update("tags", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={filters.sentiment}
          onChange={(e) => update("sentiment", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {sentiments.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={filters.channel}
          onChange={(e) => update("channel", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {channels.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Product / area"
          value={filters.product}
          onChange={(e) => update("product", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={filters.from}
          onChange={(e) => update("from", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => update("to", e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}

export default FilterBar;

