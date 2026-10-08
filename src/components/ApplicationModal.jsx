import { useState } from "react";

const STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

function ApplicationModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    category: "",
    url: "",
    status: "Saved",
    salary: "",
    notes: "",
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
          {initial?.id ? "Edit application" : "Add application"}
        </h2>

        <label className="mb-3 block text-sm font-medium">
          Job title *
          <input
            required
            className={inputClass}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </label>

        <label className="mb-3 block text-sm font-medium">
          Company *
          <input
            required
            className={inputClass}
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </label>

        <label className="mb-3 block text-sm font-medium">
          Job link (optional)
          <input
            className={inputClass}
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
          />
        </label>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">
            Status
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Salary
            <input
              className={inputClass}
              value={form.salary}
              onChange={(e) => update("salary", e.target.value)}
            />
          </label>
        </div>

        <label className="mb-4 block text-sm font-medium">
          Notes (interview date, contact info...)
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
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationModal;
