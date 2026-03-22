const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const cache = new Map();

export async function findEmbeddableVideoId(query) {
  if (cache.has(query)) return cache.get(query);

  if (!API_KEY) return null;

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&maxResults=1&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const id = data.items?.[0]?.id?.videoId ?? null;
    cache.set(query, id);
    return id;
  } catch {
    return null;
  }
}
