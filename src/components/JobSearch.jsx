import { useState, useEffect } from "react";
import { fetchJobs } from "../services/jobApi";
import JobCard from "./JobCard";

const CATEGORY_VALUES = [
  "",
  "software-dev",
  "data",
  "design",
  "marketing",
  "product",
  "customer-support",
];

function JobSearch({ t, onSave, savedIds }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [source, setSource] = useState("Remotive");

  async function handleSearch() {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchJobs(keyword, category);
      setJobs(result.jobs);
      setSource(result.source);
    } catch (err) {
      console.error(err);
      setError(true);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

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
          placeholder={t.searchPlaceholder}
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        >
          {CATEGORY_VALUES.map((value) => (
            <option key={value} value={value}>
              {t.categories[value]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {t.search}
        </button>
      </form>

      {!loading && !error && source === "Jobicy" && (
        <p className="mb-3 rounded bg-yellow-50 p-2 text-sm text-yellow-800">
          {t.backup}
        </p>
      )}

      {loading && <p className="text-gray-500">{t.loading}</p>}

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{t.error}</p>
          <button
            onClick={handleSearch}
            className="mt-2 rounded bg-red-600 px-3 py-1 text-white"
          >
            {t.retry}
          </button>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-gray-500">{t.noJobs}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {!loading &&
          jobs.map((job) => (
            <JobCard
              key={job.id}
              t={t}
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
