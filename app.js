document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("searchInput");
  const results = document.getElementById("results");
  const searchButton = document.getElementById("searchButton");

  const TODAY = "2026-08-13";
  const MIN_DATE = "2020-01-01";

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
      showMessage("Please enter a research topic.");
      return;
    }

    showMessage(
      `Searching for recent research about <strong>${escapeHtml(query)}</strong>...`
    );

    try {

      const url =
        "https://api.openalex.org/works?" +
        "search=" + encodeURIComponent(query) +
        "&filter=" +
        "from_publication_date:" + MIN_DATE +
        ",to_publication_date:" + TODAY +
        "&sort=publication_date:desc" +
        "&per-page=100";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("OpenAlex request failed");
      }

      const data = await response.json();


      // --------------------------------------------------
      // 1. Remove papers with invalid/future dates
      // --------------------------------------------------

      const validPapers = (data.results || []).filter(function (paper) {

        if (!paper.publication_date) {
          return false;
        }

        const date = paper.publication_date;

        return (
          date >= MIN_DATE &&
          date <= TODAY
        );
      });


      // --------------------------------------------------
      // 2. Sort ourselves — newest first
      // --------------------------------------------------

      validPapers.sort(function (a, b) {

        return (
          new Date(b.publication_date) -
          new Date(a.publication_date)
        );

      });


      // --------------------------------------------------
      // 3. Display results
      // --------------------------------------------------

      if (validPapers.length === 0) {

        showMessage(`
          <h2>No valid papers found</h2>
          <p>
            No papers with valid publication dates were found
            for this search.
          </p>
        `);

        return;
      }


      results.innerHTML = `
        <div class="welcome">

          <h2>Latest research</h2>

          <p>
            Search:
            <strong>${escapeHtml(query)}</strong>
          </p>

          <p>
            Showing papers published between
            ${MIN_DATE}
            and
            ${TODAY}.
          </p>

        </div>
      `;


      validPapers.slice(0, 20).forEach(function (paper) {

        const title =
          paper.title || "Untitled";


        const authors =
          paper.authorships
            ?.slice(0, 3)
            .map(function (author) {
              return author.author?.display_name;
            })
            .filter(Boolean)
            .join(", ")
          || "Unknown authors";


        const date =
          paper.publication_date;


        const journal =
          paper.primary_location?.source?.display_name
          || "Unknown source";


        const paperUrl =
          paper.primary_location?.landing_page_url
          || paper.doi
          || "#";


        const abstract =
          getAbstract(paper);


        const paperElement =
          document.createElement("div");


        paperElement.className = "paper";


        paperElement.innerHTML = `

          <h2>
            ${escapeHtml(title)}
          </h2>

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
              ? `
                <p>
                  <strong>Abstract:</strong>
                  ${escapeHtml(abstract)}
                </p>
              `
              : ""
          }

          <p>
            <a
              href="${paperUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >
              View paper →
            </a>
          </p>

        `;


        results.appendChild(paperElement);

      });

    }

    catch (error) {

      console.error(error);

      showMessage(`
        <h2>Search error</h2>

        <p>
          Something went wrong while retrieving
          the papers.
        </p>

        <p>
          Please try again.
        </p>
      `);

    }

  }


  function showMessage(message) {

    results.innerHTML = `
      <div class="welcome">
        ${message}
      </div>
    `;

  }


  function getAbstract(paper) {

    const invertedIndex =
      paper.abstract_inverted_index;

    if (!invertedIndex) {
      return "";
    }

    const words = [];

    for (const word in invertedIndex) {

      const positions =
        invertedIndex[word];

      positions.forEach(function (position) {

        words[position] = word;

      });

    }

    return words.join(" ");

  }


  function escapeHtml(text) {

    const div =
      document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

  }

});
