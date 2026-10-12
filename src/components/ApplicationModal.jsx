import { useState } from "react";

const STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

function ApplicationModal({ t, initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    category: "",
    url: "",
    status: "Saved",
    salary: "",
    notes: "",
    followUp: "",
    ...initial,
  });

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  const inputClass = "w-full rounded border border-gray-300 px-3 py-2";

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
      >
        <h2 className="mb-4 text-xl font-bold">
          {initial?.id ? t.editTitle : t.addTitle}
        </h2>

        <label className="mb-3 block text-sm font-medium">
          {t.jobTitle}
          <input
            required
            className={inputClass}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </label>

        <label className="mb-3 block text-sm font-medium">
          {t.company}
          <input
            required
            className={inputClass}
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </label>

        <label className="mb-3 block text-sm font-medium">
          {t.jobLink}
          <input
            className={inputClass}
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
          />
        </label>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">
            {t.status}
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t.statuses[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            {t.salary}
            <input
              className={inputClass}
              value={form.salary}
              onChange={(e) => update("salary", e.target.value)}
            />
          </label>
        </div>

        <label className="mb-3 block text-sm font-medium">
          {t.followUp}
          <input
            type="date"
            className={inputClass}
            value={form.followUp}
            onChange={(e) => update("followUp", e.target.value)}
          />
        </label>

        <label className="mb-4 block text-sm font-medium">
          {t.notes}
          <textarea
            rows="4"
            className={inputClass}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationModal;
