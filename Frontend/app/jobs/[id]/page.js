"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "../../../components/StatusBadge";
import { useAuth } from "../../../contexts/AuthContext";
import {
  deleteJob,
  getErrorMessage,
  getJob,
  updateJobStatus,
} from "../../../lib/api";

const STATUSES = ["Open", "In Progress", "Closed"];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJob = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await getJob(id);
      setJob(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchJob();
  }, [id, fetchJob]);

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    if (!job || newStatus === job.status) return;

    setStatusUpdating(true);
    setError(null);
    try {
      const updated = await updateJobStatus(id, newStatus);
      setJob(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleDelete() {
    if (!isAuthenticated) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteJob(id);
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading job details...</p>;
  }

  if (notFound) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-slate-800">Job not found</h1>
        <p className="mt-2 text-gray-600">
          This job may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
        {error || "Unable to load job."}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
        ← Back to jobs
      </Link>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <article className="mt-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
          <StatusBadge status={job.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {job.category}
          </span>
        </div>

        <section className="mt-6 space-y-4">
          <DetailRow label="Description" value={job.description} multiline />
          <DetailRow label="Location" value={job.location} />
          <DetailRow label="Contact Name" value={job.contactName} />
          <DetailRow label="Contact Email" value={job.contactEmail} />
          <DetailRow label="Posted" value={formatDate(job.createdAt)} />
        </section>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-end gap-4 justify-between">
          {isAuthenticated ? (
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Update status
            </label>
            <select
              id="status"
              value={job.status}
              onChange={handleStatusChange}
              disabled={statusUpdating}
                className="field-select disabled:opacity-60"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {statusUpdating && (
              <p className="mt-1 text-xs text-gray-500">Updating...</p>
            )}
          </div>
          ) : (
            !authLoading && (
              <p className="text-sm text-gray-600">
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Log in
                </Link>{" "}
                to update or delete this job.
              </p>
            )
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? "Deleting..." : "Delete Job"}
            </button>
          )}
        </div>
      </article>
    </div>
  );
}

function DetailRow({ label, value, multiline }) {
  if (!value) return null;
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-500">{label}</h2>
      {multiline ? (
        <p className="mt-1 text-slate-800 whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="mt-1 text-slate-800">{value}</p>
      )}
    </div>
  );
}
