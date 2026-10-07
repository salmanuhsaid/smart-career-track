const STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

function TrackerBoard({ applications, onMove, onDelete }) {
  if (applications.length === 0) {
    return (
      <p className="text-gray-500">
        No applications yet. Save a job from the Job Search tab.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {STATUSES.map((status) => {
        const items = applications.filter((a) => a.status === status);
        return (
          <div key={status} className="rounded-lg bg-gray-100 p-3">
            <h2 className="mb-3 font-semibold text-gray-700">
              {status} ({items.length})
            </h2>
            <div className="flex flex-col gap-3">
              {items.map((app) => (
                <div
                  key={app.id}
                  className="rounded border bg-white p-3 shadow-sm"
                >
                  <p className="font-medium text-gray-900">{app.title}</p>
                  <p className="text-sm text-gray-600">{app.company}</p>
                  <select
                    value={app.status}
                    onChange={(e) => onMove(app.id, e.target.value)}
                    className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TrackerBoard;
