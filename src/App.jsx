import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { translations } from "./translations";
import JobSearch from "./components/JobSearch";
import TrackerBoard from "./components/TrackerBoard";
import ApplicationModal from "./components/ApplicationModal";
import Stats from "./components/Stats";

function App() {
  const [lang, setLang] = useLocalStorage("lang", "tr");
  const t = translations[lang];
  const [tab, setTab] = useState("search");
  const [applications, setApplications] = useLocalStorage("applications", []);
  const [modal, setModal] = useState(null);

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
      setApplications(
        applications.map((a) => (a.id === form.id ? { ...a, ...form } : a)),
      );
    } else {
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
    if (window.confirm(t.confirmDelete)) {
      setApplications(applications.filter((a) => a.id !== id));
    }
  }

  const tabClass = (name) =>
    `px-4 py-2 font-medium ${
      tab === name
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-gray-500"
    }`;

  const langClass = (code) =>
    `rounded px-2 py-1 text-sm font-semibold ${
      lang === code ? "bg-white text-blue-600" : "text-white hover:bg-blue-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 p-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold">{t.appTitle}</h1>
          <div className="flex gap-1">
            <button className={langClass("tr")} onClick={() => setLang("tr")}>
              TR
            </button>
            <button className={langClass("en")} onClick={() => setLang("en")}>
              EN
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <div className="mb-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex">
            <button
              className={tabClass("search")}
              onClick={() => setTab("search")}
            >
              {t.tabSearch}
            </button>
            <button
              className={tabClass("tracker")}
              onClick={() => setTab("tracker")}
            >
              {t.tabTracker} ({applications.length})
            </button>
          </div>
          <button
            onClick={() => setModal({})}
            className="mb-1 rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
          >
            {t.addApplication}
          </button>
        </div>

        <div className={tab === "search" ? "" : "hidden"}>
          <JobSearch
            t={t}
            onSave={saveJob}
            savedIds={applications.map((a) => a.id)}
          />
        </div>

        {tab === "tracker" && (
          <>
            <Stats t={t} applications={applications} />
            <TrackerBoard
              t={t}
              applications={applications}
              onMove={moveApplication}
              onDelete={deleteApplication}
              onEdit={(app) => setModal(app)}
            />
          </>
        )}
      </main>

      {modal && (
        <ApplicationModal
          t={t}
          initial={modal}
          onSave={saveForm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default App;
