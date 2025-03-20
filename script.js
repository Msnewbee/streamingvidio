async function fetchEpisodes(seasonPath) {
  const url = `https://streamingnime.pages.dev/Anime/${seasonPath}/episodes.json`;
  console.log(`Fetching from URL: ${url}`);

  // Retry logic for fetch request
  const retryFetch = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
      }
    }
  };

  try {
    const response = await retryFetch(url);

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON:", text);
      throw new Error("Response is not JSON, possible server error.");
    }

    const data = JSON.parse(text);

    // Validate JSON data
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON data format");
    }

    console.log(`Episode data (${seasonPath}):`, data);
  } catch (error) {
    console.error(`Failed to fetch data for ${seasonPath}:`, error);
  }
}

async function fetchAllEpisodes() {
  const seasons = ["sololevelingseason1", "sololevelingseason2"];
  for (const season of seasons) {
    await fetchEpisodes(season);
  }
}

fetchAllEpisodes();

// Lazy loading using Intersection Observer
document.addEventListener("DOMContentLoaded", function () {
  let lazyImages = document.querySelectorAll("img.lazy");
  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => observer.observe(img));
});
