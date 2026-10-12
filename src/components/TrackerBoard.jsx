import { useState } from "react";
import { exportApplicationsCsv } from "../utils/exportCsv";
import { translateToTurkish } from "../utils/translate";

const STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];
const CLOSED = ["Offer", "Rejected"];

function TrackerBoard({ t, applications, onMove, onUpdate, onDelete, onEdit }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dragOver, setDragOver] = useState(null);

  const [busyId, setBusyId] = useState(null);

  async function handleTranslate(app) {
    setBusyId(app.id);
    try {
      const titleTr = await translateToTurkish(app.title);
      onUpdate(app.id, { titleTr });
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  }

  if (applications.length === 0) {
    return <p className="text-gray-500">{t.noApps}</p>;
  }

  // Today as YYYY-MM-DD in local time, to compare with the date inputs
  const today = new Date().toLocaleDateString("en-CA");

  const q = query.trim().toLowerCase();
  const filtered = applications.filter((a) => {
    const textMatch =
      !q ||
      [a.title, a.company, a.notes].some((f) =>
        (f || "").toLowerCase().includes(q),
      );
    const statusMatch = !statusFilter || a.status === statusFilter;
    return textMatch && statusMatch;
  });

  function formatDate(value) {
    return new Date(value + "T00:00:00").toLocaleDateString(t.locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function handleDrop(e, status) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) onMove(id, status);
    setDragOver(null);
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchTracker}
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="">{t.allStatuses}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t.statuses[s]}
            </option>
          ))}
        </select>
        <button
          onClick={() => exportApplicationsCsv(applications, t)}
          className="rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
        >
          {t.exportCsv}
        </button>
      </div>

      <p className="mb-3 text-xs text-gray-500">{t.dragHint}</p>

      {filtered.length === 0 && (
        <p className="mb-3 text-gray-500">{t.noMatches}</p>
      )}

      <div className="grid gap-4 md:grid-cols-5">
        {STATUSES.map((status) => {
          const items = filtered.filter((a) => a.status === status);
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(status);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setDragOver(null);
              }}
              onDrop={(e) => handleDrop(e, status)}
              className={`min-h-32 rounded-lg p-3 transition-colors ${
                dragOver === status
                  ? "bg-blue-100 ring-2 ring-blue-500"
                  : "bg-gray-100"
              }`}
            >
              <h2 className="mb-3 font-semibold text-gray-700">
                {t.statuses[status]} ({items.length})
              </h2>
              <div className="flex flex-col gap-3">
                {items.map((app) => {
                  const overdue =
                    app.followUp &&
                    app.followUp < today &&
                    !CLOSED.includes(app.status);
                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/plain", app.id)
                      }
                      onDragEnd={() => setDragOver(null)}
                      className="cursor-grab rounded border bg-white p-3 shadow-sm active:cursor-grabbing"
                    >
                      <p className="font-medium text-gray-900">
                        {t.locale === "tr-TR" && app.titleTr
                          ? app.titleTr
                          : app.title}
                      </p>
                      <p className="text-sm text-gray-600">{app.company}</p>
                      {t.translateBtn &&
                        !app.titleTr &&
                        !String(app.id).startsWith("manual-") && (
                          <button
                            onClick={() => handleTranslate(app)}
                            disabled={busyId === app.id}
                            className="mt-1 text-xs text-gray-600 hover:underline disabled:text-gray-400"
                          >
                            {busyId === app.id ? t.translating : t.translateBtn}
                          </button>
                        )}
                      {app.salary && (
                        <p className="mt-1 text-xs text-green-700">
                          💰 {app.salary}
                        </p>
                      )}
                      {app.followUp && (
                        <p
                          className={`mt-1 text-xs ${
                            overdue
                              ? "font-semibold text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          📅 {formatDate(app.followUp)}
                          {overdue && ` · ${t.overdue}`}
                        </p>
                      )}
                      {app.notes && (
                        <p className="mt-1 line-clamp-3 text-xs text-gray-500">
                          📝 {app.notes}
                        </p>
                      )}
                      <select
                        value={app.status}
                        onChange={(e) => onMove(app.id, e.target.value)}
                        className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {t.statuses[s]}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 flex gap-3 text-sm">
                        <button
                          onClick={() => onEdit(app)}
                          className="text-blue-600 hover:underline"
                        >
                          {t.edit}
                        </button>
                        <button
                          onClick={() => onDelete(app.id)}
                          className="text-red-600 hover:underline"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrackerBoard;
