"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar from "../components/FilterBar";
import JobCard from "../components/JobCard";
import { getErrorMessage, getJobs } from "../lib/api";

function HomeContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs({ category, status, search });
      setJobs(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchParams.get("created") === "true") {
      setSuccessMessage("Job posted successfully!");
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Service Requests</h1>
        <p className="mt-1 text-gray-600">
          Browse local trade jobs or post your own request.
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <FilterBar
        category={category}
        status={status}
        search={search}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
        onSearch={fetchJobs}
        loading={loading}
      />

      <p className="mt-6 text-sm text-gray-600">
        {loading ? "Loading..." : `${jobs.length} job${jobs.length === 1 ? "" : "s"} found`}
      </p>

      {loading ? (
        <div className="mt-8 text-center text-gray-500">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="mt-12 text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
          <p className="text-lg font-medium text-gray-700">No jobs found</p>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or post a new job request.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
