export async function translateToTurkish(text) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|tr`,
  );
  if (!res.ok) throw new Error("Translation failed");
  const data = await res.json();
  return data.responseData.translatedText;
}
