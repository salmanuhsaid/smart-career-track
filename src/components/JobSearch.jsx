import { useState, useEffect } from "react";
import { fetchJobs } from "../services/jobApi";
import JobCard from "./JobCard";

const CATEGORIES = [
  { label: "All categories", value: "" },
  { label: "Software", value: "software-dev" },
  { label: "Data", value: "data" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Product", value: "product" },
  { label: "Customer Support", value: "customer-support" },
];

function JobSearch({ onSave, savedIds }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("Remotive");

  async function handleSearch() {
    setLoading(true);
    setError("");
    try {
      const result = await fetchJobs(keyword, category);
      setJobs(result.jobs);
      setSource(result.source);
    } catch (err) {
      console.error(err);
      setError(
        "Could not load jobs from any source. Check your internet connection and try again.",
      );
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  // Load some jobs when the page first opens
  useEffect(() => {
    handleSearch();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    handleSearch();
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search jobs, e.g. react, python..."
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {!loading && !error && source === "Jobicy" && (
        <p className="mb-3 rounded bg-yellow-50 p-2 text-sm text-yellow-800">
          Remotive is unavailable, showing results from the backup source
          (Jobicy).
        </p>
      )}

      {loading && <p className="text-gray-500">Loading jobs...</p>}

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error}</p>
          <button
            onClick={handleSearch}
            className="mt-2 rounded bg-red-600 px-3 py-1 text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-gray-500">No jobs found. Try another keyword.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {!loading &&
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSave={onSave}
              isSaved={savedIds.includes(job.id)}
            />
          ))}
      </div>
    </div>
  );
}

export default JobSearch;
