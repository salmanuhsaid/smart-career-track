import JobSearch from "./components/JobSearch";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="mx-auto max-w-5xl text-2xl font-bold">
          Smart Career Track
        </h1>
      </header>
      <main className="mx-auto max-w-5xl p-4">
        <JobSearch />
      </main>
    </div>
  );
}

export default App;
