const STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

function Stats({ applications }) {
  const count = (s) => applications.filter((a) => a.status === s).length;

  // Applications actually sent = everything past "Saved"
  const sent = applications.length - count("Saved");
  // A "response" = interview, offer or rejection
  const responses = count("Interviewing") + count("Offer") + count("Rejected");
  const responseRate = sent === 0 ? 0 : Math.round((responses / sent) * 100);
  const offerRate = sent === 0 ? 0 : Math.round((count("Offer") / sent) * 100);

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="rounded-lg bg-white p-3 shadow-sm">
        <p className="text-2xl font-bold">{applications.length}</p>
        <p className="text-sm text-gray-500">Total tracked</p>
      </div>
      <div className="rounded-lg bg-white p-3 shadow-sm">
        <p className="text-2xl font-bold">{sent}</p>
        <p className="text-sm text-gray-500">Applications sent</p>
      </div>
      <div className="rounded-lg bg-white p-3 shadow-sm">
        <p className="text-2xl font-bold">{responseRate}%</p>
        <p className="text-sm text-gray-500">Response rate</p>
      </div>
      <div className="rounded-lg bg-white p-3 shadow-sm">
        <p className="text-2xl font-bold">{offerRate}%</p>
        <p className="text-sm text-gray-500">Offer rate</p>
      </div>
      <div className="col-span-2 rounded-lg bg-white p-3 shadow-sm md:col-span-4">
        <div className="flex h-3 overflow-hidden rounded bg-gray-200">
          {applications.length > 0 &&
            STATUSES.map((s, i) => (
              <div
                key={s}
                title={`${s}: ${count(s)}`}
                style={{ width: `${(count(s) / applications.length) * 100}%` }}
                className={
                  [
                    "bg-gray-400",
                    "bg-blue-500",
                    "bg-yellow-500",
                    "bg-green-500",
                    "bg-red-500",
                  ][i]
                }
              />
            ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Saved · Applied · Interviewing · Offer · Rejected
        </p>
      </div>
    </div>
  );
}

export default Stats;
