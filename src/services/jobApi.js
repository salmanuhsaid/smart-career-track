export async function fetchRemotiveJobs(search = "", category = "") {
  const params = new URLSearchParams({ limit: 30 });
  if (search) params.append("search", search);
  if (category) params.append("category", category);

  const res = await fetch(`https://remotive.com/api/remote-jobs?${params}`);
  if (!res.ok) throw new Error("Network response failed");
  const data = await res.json();

  return data.jobs.map((job) => ({
    id: `remotive-${job.id}`,
    title: job.title,
    company: job.company_name.trim(),
    category: job.category,
    date: job.publication_date,
    url: job.url,
  }));
}
