import { useState } from "react";

const initial = {
  text: "",
  rating: 5,
  channel: "web",
  customerId: "",
  customerName: "",
  customerEmail: "",
  product: "",
  feature: "",
  status: "open",
  tags: "",
};

function FeedbackForm({ onSubmit }) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      rating: Number(form.rating),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    await onSubmit(payload);
    setSubmitting(false);
    setForm(initial);
  };

  return (
    <form
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">New entry</p>
          <h2 className="text-xl font-semibold">Submit Feedback!</h2>
        </div>
        <span className="text-xs text-slate-400">Status: {form.status}</span>
      </div>
      <label className="block space-y-1 text-sm font-semibold text-slate-200">
        <span>Feedback text</span>
        <textarea
          name="text"
          required
          rows="4"
          value={form.text}
          onChange={handleChange}
          placeholder="Share the customer quote or summary..."
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block space-y-1 text-sm font-semibold text-slate-200">
          <span>Rating (1-5)</span>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={form.rating}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="block space-y-1 text-sm font-semibold text-slate-200">
          <span>Channel</span>
          <select
            name="channel"
            value={form.channel}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="web">Web</option>
            <option value="email">Email</option>
            <option value="chat">Chat</option>
            <option value="store">Store</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block space-y-1 text-sm font-semibold text-slate-200">
          <span>Customer name</span>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="block space-y-1 text-sm font-semibold text-slate-200">
          <span>Customer email</span>
          <input
            type="email"
            name="customerEmail"
            value={form.customerEmail}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
      </div>
      <label className="block space-y-1 text-sm font-semibold text-slate-200">
        <span>Customer ID (optional)</span>
        <input
          type="text"
          name="customerId"
          value={form.customerId}
          onChange={handleChange}
          placeholder="e.g. 12345"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block space-y-1 text-sm font-semibold text-slate-200">
          <span>Product / area</span>
          <input
            type="text"
            name="product"
            value={form.product}
            onChange={handleChange}
            placeholder="Mobile app"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="block space-y-1 text-sm font-semibold text-slate-200">
          <span>Feature</span>
          <input
            type="text"
            name="feature"
            value={form.feature}
            onChange={handleChange}
            placeholder="Checkout flow"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block space-y-1 text-sm font-semibold text-slate-200">
          <span>Tags (comma-separated)</span>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="billing, onboarding"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="block space-y-1 text-sm font-semibold text-slate-200">
          <span>Status</span>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 py-3 font-semibold text-white shadow-md disabled:opacity-70"
      >
        {submitting ? "Submitting..." : "Save feedback"}
      </button>
    </form>
  );
}

export default FeedbackForm;

