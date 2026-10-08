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

const JOBICY_INDUSTRY = {
  "software-dev": "dev",
  data: "data-science",
  design: "design-multimedia",
  marketing: "marketing",
  "customer-support": "supporting",
};

export async function fetchJobicyJobs(search = "", category = "") {
  const params = new URLSearchParams({ count: 30 });
  if (search) params.append("tag", search);
  if (JOBICY_INDUSTRY[category])
    params.append("industry", JOBICY_INDUSTRY[category]);

  const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?${params}`);
  if (!res.ok) throw new Error("Network response failed");
  const data = await res.json();

  return (data.jobs || []).map((job) => ({
    id: `jobicy-${job.id}`,
    title: job.jobTitle,
    company: job.companyName,
    category: Array.isArray(job.jobIndustry)
      ? job.jobIndustry[0]
      : job.jobIndustry,
    date: job.pubDate,
    url: job.url,
  }));
}

// Tries Remotive first, then Jobicy if Remotive fails
export async function fetchJobs(search, category) {
  try {
    const jobs = await fetchRemotiveJobs(search, category);
    return { jobs, source: "Remotive" };
  } catch (err) {
    console.warn("Remotive failed, trying Jobicy", err);
    const jobs = await fetchJobicyJobs(search, category);
    return { jobs, source: "Jobicy" };
  }
}
