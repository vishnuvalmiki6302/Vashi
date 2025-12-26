import { useState } from "react";

const API_BASE = "";

async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `Request failed: ${res.status}`);
  return text ? JSON.parse(text) : {};
}

function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup | otp
  const [form, setForm] = useState({ email: "", password: "", code: "", phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await postJson("/api/auth/signup", {
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      setMessage("Account created. Please login to receive an OTP.");
      setMode("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await postJson("/api/auth/login", { email: form.email, password: form.password });
      setMessage("OTP sent to your email.");
      setMode("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await postJson("/api/auth/verify-otp", { email: form.email, code: form.code });
      onAuth?.(data.access);
      setMessage("Authenticated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center gap-3">
        <Tab active={mode === "login"} onClick={() => setMode("login")} label="Login" />
        <Tab active={mode === "signup"} onClick={() => setMode("signup")} label="Sign up" />
        <Tab active={mode === "otp"} onClick={() => setMode("otp")} label="Verify OTP" />
      </div>

      {mode === "signup" && (
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleSignup}>
          <Input label="Email" name="email" type="email" value={form.email} onChange={update} required />
          <Input label="Password" name="password" type="password" value={form.password} onChange={update} required />
          <Input
            label="Phone (optional)"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={update}
            placeholder="+1..."
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 py-3 font-semibold text-white shadow-md disabled:opacity-70"
            >
              {loading ? "Working..." : "Create account"}
            </button>
          </div>
        </form>
      )}

      {mode === "login" && (
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleLogin}>
          <Input label="Email" name="email" type="email" value={form.email} onChange={update} required />
          <Input label="Password" name="password" type="password" value={form.password} onChange={update} required />
          <div className="sm:col-span-2 flex items-center justify-between text-xs text-slate-400">
            <span>After password check, an OTP will be emailed.</span>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 py-3 font-semibold text-white shadow-md disabled:opacity-70"
            >
              {loading ? "Working..." : "Send OTP"}
            </button>
          </div>
        </form>
      )}

      {mode === "otp" && (
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleVerify}>
          <Input label="Email" name="email" type="email" value={form.email} onChange={update} required />
          <Input label="OTP code" name="code" type="text" value={form.code} onChange={update} required />
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 py-3 font-semibold text-white shadow-md disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      )}

      {message && <div className="text-sm text-emerald-300">{message}</div>}
      {error && <div className="text-sm text-rose-400">Error: {error}</div>}
    </div>
  );
}

function Tab({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-semibold px-3 py-1 rounded-lg border ${
        active ? "border-indigo-500 text-indigo-200" : "border-slate-700 text-slate-400"
      }`}
    >
      {label}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block space-y-1 text-sm font-semibold text-slate-200">
      <span>{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </label>
  );
}

export default AuthPanel;

