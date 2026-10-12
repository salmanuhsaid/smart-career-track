import { useState } from "react";

import { translateToTurkish } from "../utils/translate";

function JobCard({ t, job, onSave, isSaved }) {
  const [translated, setTranslated] = useState("");
  const [showTranslated, setShowTranslated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const date = new Date(job.date).toLocaleDateString(t.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const category = t.categoryNames?.[job.category] || job.category;
  const title = showTranslated && translated ? translated : job.title;

  async function handleTranslate() {
    if (translated) {
      setShowTranslated(!showTranslated);
      return;
    }
    setBusy(true);
    setFailed(false);
    try {
      setTranslated(await translateToTurkish(job.title));
      setShowTranslated(true);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-700">{job.company}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700">
          {category}
        </span>
        <span>
          {t.posted} {date}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={job.url}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          {t.apply}
        </a>
        <button
          onClick={() =>
            onSave(translated ? { ...job, titleTr: translated } : job)
          }
          disabled={isSaved}
          className="rounded border border-blue-600 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400"
        >
          {isSaved ? t.saved : t.saveToTracker}
        </button>
        {t.translateBtn && (
          <button
            onClick={handleTranslate}
            disabled={busy}
            className="text-sm text-gray-600 hover:underline disabled:text-gray-400"
          >
            {busy
              ? t.translating
              : showTranslated
                ? t.showOriginal
                : t.translateBtn}
          </button>
        )}
      </div>
      {failed && <p className="mt-2 text-xs text-red-600">{t.translateFail}</p>}
    </div>
  );
}

export default JobCard;
