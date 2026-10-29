import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validateUsername,
} from "../utils/validation";

const FIELDS = [
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    placeholder: "Jane Doe",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    autoComplete: "username",
    placeholder: "jane_doe",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "jane@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "At least 6 characters",
  },
];

const inputStyles = {
  neutral:
    "border-gray-300 focus:border-purple-500 focus:ring-purple-200",
  error: "border-red-500 focus:border-red-500 focus:ring-red-200",
  valid: "border-green-500 focus:border-green-500 focus:ring-green-200",
};

export default function RegisterPage() {
  const { register, checkUsername } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // "idle" | "checking" | "available" | "taken" | "error"
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format errors, recalculated on every keystroke.
  const messages = {
    fullName: validateFullName(values.fullName),
    username: validateUsername(values.username),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };

  // Add the server-side username result on top of the format check.
  if (!messages.username) {
    if (usernameStatus === "taken") {
      messages.username = "That username is already taken.";
    } else if (usernameStatus === "error") {
      messages.username = "Could not check the username right now.";
    }
  }

  // Check if the username exists, 400ms after the user stops typing.
  useEffect(() => {
    if (validateUsername(values.username)) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const taken = await checkUsername(values.username);
        if (!cancelled) setUsernameStatus(taken ? "taken" : "available");
      } catch {
        if (!cancelled) setUsernameStatus("error");
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [values.username, checkUsername]);

  function getFieldState(name) {
    if (!touched[name]) return "neutral";
    if (messages[name]) return "error";
    if (name === "username" && usernameStatus !== "available") {
      return "neutral";
    }
    return "valid";
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Show every error, even on fields the user never touched.
    setTouched({
      fullName: true,
      username: true,
      email: true,
      password: true,
    });

    const hasErrors = Object.values(messages).some(Boolean);
    if (hasErrors || usernameStatus !== "available") return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await register(values);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="mt-1 text-sm text-gray-500">
          Join us in a few seconds.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          {FIELDS.map((field) => {
            const state = getFieldState(field.name);
            const isPassword = field.name === "password";

            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>

                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type={isPassword && showPassword ? "text" : field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={values[field.name]}
                    onChange={handleChange}
                    aria-invalid={state === "error"}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${inputStyles[state]} ${
                      isPassword ? "pr-16" : ""
                    }`}
                  />

                  {isPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((show) => !show)}
                      className="absolute inset-y-0 right-3 text-xs font-semibold text-purple-600 hover:text-purple-800"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                </div>

                {state === "error" && (
                  <p className="mt-1 text-xs text-red-600">
                    {messages[field.name]}
                  </p>
                )}

                {field.name === "username" &&
                  touched.username &&
                  !messages.username &&
                  usernameStatus === "checking" && (
                    <p className="mt-1 text-xs text-gray-500">
                      Checking availability...
                    </p>
                  )}

                {field.name === "username" &&
                  touched.username &&
                  usernameStatus === "available" && (
                    <p className="mt-1 text-xs text-green-600">
                      Username is available.
                    </p>
                  )}
              </div>
            );
          })}

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
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-600 hover:text-purple-800"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}