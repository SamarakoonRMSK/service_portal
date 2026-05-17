import Link from "next/link";
import StatusBadge from "./StatusBadge";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function JobCard({ job }) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-800 line-clamp-2">
        {job.title}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {job.category}
        </span>
        <StatusBadge status={job.status} />
      </div>
      {job.location && (
        <p className="mt-2 text-sm text-gray-500">{job.location}</p>
      )}
      {job.contactName && (
        <p className="mt-1 text-sm text-gray-600">{job.contactName}</p>
      )}
      <p className="mt-1 text-xs text-gray-400">{formatDate(job.createdAt)}</p>
      <div className="mt-4 pt-4 border-t border-gray-100 mt-auto">
        <Link
          href={`/jobs/${job._id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
