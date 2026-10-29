import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });  
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading profile">
      <div className="mx-auto h-28 w-28 rounded-full bg-gray-200" />
      <div className="mx-auto mt-5 h-6 w-40 rounded bg-gray-200" />
      <div className="mx-auto mt-2 h-4 w-28 rounded bg-gray-200" />
      <div className="mt-8 space-y-3">
        <div className="h-12 rounded-lg bg-gray-200" />
        <div className="h-12 rounded-lg bg-gray-200" />
        <div className="h-12 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="break-all text-sm font-medium text-gray-900 sm:text-right">
        {value}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarFailed, setAvatarFailed] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Log out
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          {!user ? (
            <ProfileSkeleton />
          ) : (
            <>
              <div className="text-center">
                {user.avatar && !avatarFailed ? (
                  <img
                    src={user.avatar}
                    alt={`${user.fullName}'s avatar`}
                    onError={() => setAvatarFailed(true)}
                    className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-purple-100"
                  />
                ) : (
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-3xl font-bold text-purple-600 ring-4 ring-purple-50">
                    {getInitials(user.fullName)}
                  </div>
                )}

                <h2 className="mt-5 text-xl font-bold text-gray-900">
                  {user.fullName}
                </h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>

              <div className="mt-8 space-y-3">
                <InfoRow label="Full name" value={user.fullName} />
                <InfoRow label="Username" value={user.username} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Member since" value={formatDate(user.createdAt)} />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}