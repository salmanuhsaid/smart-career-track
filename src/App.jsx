import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import JobSearch from "./components/JobSearch";
import TrackerBoard from "./components/TrackerBoard";
import ApplicationModal from "./components/ApplicationModal";

function App() {
  const [tab, setTab] = useState("search");
  const [applications, setApplications] = useLocalStorage("applications", []);
  const [modal, setModal] = useState(null); // null = closed, {} = add, app = edit

  function saveJob(job) {
    if (applications.some((a) => a.id === job.id)) return;
    setApplications([
      ...applications,
      {
        ...job,
        status: "Saved",
        notes: "",
        salary: "",
        dateAdded: new Date().toISOString(),
      },
    ]);
  }

  function saveForm(form) {
    if (form.id) {
      // editing an existing application
      setApplications(
        applications.map((a) => (a.id === form.id ? { ...a, ...form } : a)),
      );
    } else {
      // adding a new manual application
      setApplications([
        ...applications,
        {
          ...form,
          id: `manual-${Date.now()}`,
          date: new Date().toISOString(),
          dateAdded: new Date().toISOString(),
        },
      ]);
    }
    setModal(null);
  }

  function moveApplication(id, status) {
    setApplications(
      applications.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  }

  function deleteApplication(id) {
    if (window.confirm("Delete this application? This cannot be undone.")) {
      setApplications(applications.filter((a) => a.id !== id));
    }
  }

  const tabClass = (name) =>
    `px-4 py-2 font-medium ${
      tab === name
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-gray-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="mx-auto max-w-6xl text-2xl font-bold">
          Smart Career Track
        </h1>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <div className="mb-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex">
            <button
              className={tabClass("search")}
              onClick={() => setTab("search")}
            >
              Job Search
            </button>
            <button
              className={tabClass("tracker")}
              onClick={() => setTab("tracker")}
            >
              My Tracker ({applications.length})
            </button>
          </div>
          <button
            onClick={() => setModal({})}
            className="mb-1 rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
          >
            + Add application
          </button>
        </div>

        <div className={tab === "search" ? "" : "hidden"}>
          <JobSearch
            onSave={saveJob}
            savedIds={applications.map((a) => a.id)}
          />
        </div>

        {tab === "tracker" && (
          <TrackerBoard
            applications={applications}
            onMove={moveApplication}
            onDelete={deleteApplication}
            onEdit={(app) => setModal(app)}
          />
        )}
      </main>

      {modal && (
        <ApplicationModal
          initial={modal}
          onSave={saveForm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default App;
