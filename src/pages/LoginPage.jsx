import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail, validateLoginPassword } from "../utils/validation";

const inputStyles = {
  neutral: "border-gray-300 focus:border-purple-500 focus:ring-purple-200",
  error: "border-red-500 focus:border-red-500 focus:ring-red-200",
  valid: "border-green-500 focus:border-green-500 focus:ring-green-200",
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already logged in: skip the login page.
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const messages = {
    email: validateEmail(values.email),
    password: validateLoginPassword(values.password),
  };

  function getFieldState(name) {
    if (!touched[name]) return "neutral";
    return messages[name] ? "error" : "valid";
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (messages.email || messages.password) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await login(values);
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">
          Log in to see your dashboard.
        </p>

        {location.state?.registered && (
          <div
            role="status"
            className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
          >
            Account created! You can log in now.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={getFieldState("email") === "error"}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${inputStyles[getFieldState("email")]}`}
            />
            {getFieldState("email") === "error" && (
              <p className="mt-1 text-xs text-red-600">{messages.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={getFieldState("password") === "error"}
                className={`w-full rounded-lg border px-3 py-2.5 pr-16 text-sm outline-none transition focus:ring-2 ${inputStyles[getFieldState("password")]}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                className="absolute inset-y-0 right-3 text-xs font-semibold text-purple-600 hover:text-purple-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {getFieldState("password") === "error" && (
              <p className="mt-1 text-xs text-red-600">{messages.password}</p>
            )}
          </div>

          {submitError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-purple-600 hover:text-purple-800"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}