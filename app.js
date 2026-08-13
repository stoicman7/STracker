document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("searchInput");
  const results = document.getElementById("results");
  const searchButton = document.querySelector("button");

  searchButton.addEventListener("click", searchPapers);

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchPapers();
    }
  });

  async function searchPapers() {
    const query = searchInput.value.trim();

    if (!query) {
      results.innerHTML = `
        <div class="welcome">
          <p>Please enter a research topic.</p>
        </div>
      `;
      return;
    }

    results.innerHTML = `
      <div class="welcome">
        <p>Searching for the latest papers about
        <strong>${escapeHtml(query)}</strong>...</p>
      </div>
    `;

    try {
      const url =
        "https://api.openalex.org/works?" +
        "search=" + encodeURIComponent(query) +
        "&filter=from_publication_date:2020-01-01" +
        "&sort=publication_date:desc" +
        "&per-page=20";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("OpenAlex request failed");
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        results.innerHTML = `
          <div class="welcome">
            <h2>No papers found</h2>
            <p>Try another research topic.</p>
          </div>
        `;
        return;
      }

      results.innerHTML = `
        <div class="welcome">
          <h2>Latest papers</h2>
          <p>
            Showing the newest results for
            <strong>${escapeHtml(query)}</strong>.
          </p>
        </div>
      `;

      data.results.forEach(function (paper) {

        const title = paper.title || "Untitled";

        const authors = paper.authorships
          ?.slice(0, 3)
          .map(function (author) {
            return author.author?.display_name;
          })
          .filter(Boolean)
          .join(", ") || "Unknown authors";

        const date = paper.publication_date || "Unknown date";

        const journal =
          paper.primary_location?.source?.display_name ||
          "Unknown journal";

        const paperUrl =
          paper.primary_location?.landing_page_url ||
          paper.doi ||
          "#";

        const abstract = getAbstract(paper);

        const paperElement = document.createElement("div");

        paperElement.className = "paper";

        paperElement.innerHTML = `
          <h2>${escapeHtml(title)}</h2>

          <p>
            <strong>Published:</strong>
            ${escapeHtml(date)}
          </p>

          <p>
            <strong>Authors:</strong>
            ${escapeHtml(authors)}
          </p>

          <p>
            <strong>Source:</strong>
            ${escapeHtml(journal)}
          </p>

          ${
            abstract
              ? `<p><strong>Abstract:</strong>
                 ${escapeHtml(abstract)}</p>`
              : ""
          }

          <a
            href="${paperUrl}"
            target="_blank"
            rel="noopener noreferrer"
          >
            View paper →
          </a>
        `;

        results.appendChild(paperElement);
      });

    } catch (error) {

      console.error(error);

      results.innerHTML = `
        <div class="welcome">
          <h2>Search error</h2>
          <p>
            We couldn't retrieve the papers right now.
            Please try again.
          </p>
        </div>
      `;
    }
  }


  function getAbstract(paper) {

    const invertedIndex = paper.abstract_inverted_index;

    if (!invertedIndex) {
      return "";
    }

    const words = [];

    for (const word in invertedIndex) {

      const positions = invertedIndex[word];

      positions.forEach(function (position) {
        words[position] = word;
      });
    }

    return words.join(" ");
  }


  function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
  }

});
