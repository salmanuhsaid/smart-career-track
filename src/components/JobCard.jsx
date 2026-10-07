function JobCard({ job, onSave, isSaved }) {
  const date = new Date(job.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
      <p className="text-gray-700">{job.company}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700">
          {job.category}
        </span>
        <span>Posted {date}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <a
          href={job.url}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Apply
        </a>
        <button
          onClick={() => onSave(job)}
          disabled={isSaved}
          className="rounded border border-blue-600 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400"
        >
          {isSaved ? "Saved ✓" : "Save to Tracker"}
        </button>
      </div>
    </div>
  );
}

export default JobCard;
