async function searchPapers() {
  const query = document.getElementById("searchInput").value.trim();
  const results = document.getElementById("results");

  if (!query) {
    results.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  results.innerHTML = "<p>Searching scientific papers...</p>";

  try {
    const url =
      "https://api.openalex.org/works?search=" +
      encodeURIComponent(query) +
      "&per-page=10";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("OpenAlex request failed");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      results.innerHTML = "<p>No papers found.</p>";
      return;
    }

    results.innerHTML = data.results.map(paper => {
      const title = paper.title || "Untitled";
      const authors = paper.authorships
        ?.slice(0, 3)
        .map(a => a.author?.display_name)
        .filter(Boolean)
        .join(", ") || "Unknown authors";

      const year = paper.publication_year || "Unknown year";
      const url = paper.primary_location?.landing_page_url ||
                  paper.doi ||
                  "#";

      return `
        <div class="welcome" style="margin-bottom:20px;">
          <h2>${escapeHtml(title)}</h2>
          <p><strong>Authors:</strong> ${escapeHtml(authors)}</p>
          <p><strong>Year:</strong> ${year}</p>
          <a href="${url}" target="_blank" rel="noopener noreferrer">
            View paper
          </a>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error(error);
    results.innerHTML =
      "<p>Something went wrong while searching.</p>";
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
