document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  const results = document.getElementById("results");
  const trackedTopics = document.getElementById("trackedTopics");

  const keywordContainer = document.getElementById("keywordContainer");
  const excludeContainer = document.getElementById("excludeContainer");

  const addKeywordButton = document.getElementById("addKeywordButton");
  const addExcludeButton = document.getElementById("addExcludeButton");

  const authorInput = document.getElementById("authorInput");
  const journalInput = document.getElementById("journalInput");
  const fieldInput = document.getElementById("fieldInput");
  const dateRangeInput = document.getElementById("dateRangeInput");
  const documentTypeInput = document.getElementById("documentTypeInput");

  const accuracyInput = document.getElementById("accuracyInput");
  const accuracyValue = document.getElementById("accuracyValue");

  const previewButton = document.getElementById("previewButton");
  const advancedTrackButton =
    document.getElementById("advancedTrackButton");

  let currentResults = [];
  let currentVisible = 10;


  // ==========================================
  // QUICK SEARCH
  // ==========================================

  searchButton.addEventListener("click", quickSearch);

  searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
      event.preventDefault();
      quickSearch();
    }

  });


  async function quickSearch() {

    const query = searchInput.value.trim();

    if (!query) {
      showMessage(
        "<h2>Please enter a search term.</h2>"
      );
      return;
    }

    results.innerHTML = `
      <div class="card">
        <h2>🔎 Searching...</h2>
        <p>Searching for <strong>${escapeHtml(query)}</strong></p>
      </div>
    `;

    try {

      const url =
        "https://api.openalex.org/works" +
        "?search=" +
        encodeURIComponent(query) +
        "&sort=publication_date:desc" +
        "&per-page=100";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("OpenAlex returned an error.");
      }

      const data = await response.json();

      let papers = data.results || [];

      papers = papers.filter(isValidDate);

      papers.sort((a, b) => {
        return new Date(b.publication_date) -
               new Date(a.publication_date);
      });

      displayResults(
        papers,
        `Latest papers for "${query}"`
      );

    } catch (error) {

      console.error(error);

      showMessage(`
        <h2>❌ Search failed</h2>
        <p>${escapeHtml(error.message)}</p>
        <p>Please try again.</p>
      `);

    }

  }


  // ==========================================
  // ACCURACY
  // ==========================================

  accuracyInput.addEventListener("input", () => {

    accuracyValue.textContent =
      accuracyInput.value + "%";

  });


  // ==========================================
  // ADD KEYWORD
  // ==========================================

  addKeywordButton.addEventListener("click", () => {

    createInputRow(
      keywordContainer,
      "required-keyword",
      "Example: memory formation"
    );

  });


  // ==========================================
  // ADD EXCLUSION
  // ==========================================

  addExcludeButton.addEventListener("click", () => {

    createInputRow(
      excludeContainer,
      "excluded-keyword",
      "Example: animal studies"
    );

  });


  function createInputRow(
    container,
    className,
    placeholder
  ) {

    const row = document.createElement("div");

    row.className = "keyword-row";

    const input = document.createElement("input");

    input.type = "text";
    input.className = className;
    input.placeholder = placeholder;

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = "×";
    button.className = "danger";

    button.addEventListener("click", () => {
      row.remove();
    });

    row.appendChild(input);
    row.appendChild(button);

    container.appendChild(row);

  }


  // ==========================================
  // GET CRITERIA
  // ==========================================

  function getCriteria() {

    const keywords =
      [...document.querySelectorAll(".required-keyword")]
        .map(input => input.value.trim())
        .filter(Boolean);

    const excluded =
      [...document.querySelectorAll(".excluded-keyword")]
        .map(input => input.value.trim())
        .filter(Boolean);

    return {

      keywords,

      excluded,

      author:
        authorInput.value.trim(),

      journal:
        journalInput.value.trim(),

      field:
        fieldInput.value,

      dateRange:
        dateRangeInput.value,

      documentType:
        documentTypeInput.value,

      accuracy:
        Number(accuracyInput.value)

    };

  }


  // ==========================================
  // PREVIEW
  // ==========================================

  previewButton.addEventListener(
    "click",
    () => runAdvancedSearch(false)
  );


  // ==========================================
  // TRACK
  // ==========================================

  advancedTrackButton.addEventListener(
    "click",
    () => runAdvancedSearch(true)
  );


  async function runAdvancedSearch(shouldTrack) {

    const criteria = getCriteria();

    if (
      criteria.keywords.length === 0 &&
      !criteria.author &&
      !criteria.journal &&
      !criteria.field
    ) {

      showMessage(`
        <h2>🔬 Add some criteria first</h2>

        <p>
          Add at least one keyword, author,
          journal, or research field.
        </p>
      `);

      return;

    }


    results.innerHTML = `
      <div class="card">
        <h2>🔎 Searching...</h2>
        <p>
          Searching for papers matching your
          research profile.
        </p>
      </div>
    `;


    try {

      /*
       * We deliberately send the main keywords
       * to OpenAlex rather than every filter.
       */

      let query =
        criteria.keywords.join(" ");


      if (!query) {

        if (criteria.author) {
          query = criteria.author;
        }

        else if (criteria.journal) {
          query = criteria.journal;
        }

        else if (criteria.field) {
          query = criteria.field;
        }

      }


      const url =
        "https://api.openalex.org/works" +
        "?search=" +
        encodeURIComponent(query) +
        "&sort=publication_date:desc" +
        "&per-page=100";


      const response = await fetch(url);


      if (!response.ok) {
        throw new Error(
          "OpenAlex request failed."
        );
      }


      const data =
        await response.json();


      let papers =
        data.results || [];


      papers =
        papers.filter(isValidDate);


      papers =
        papers.filter(
          paper => matchesAdvancedCriteria(
            paper,
            criteria
          )
        );


      papers =
        papers.map(
          paper => {

            return {
              ...paper,
              strackerScore:
                calculateScore(
                  paper,
                  criteria
                )
            };

          }
        );


      papers =
        papers.filter(
          paper =>
            paper.strackerScore >=
            criteria.accuracy
        );


      papers.sort(
        (a, b) =>
          b.strackerScore -
          a.strackerScore
      );


      if (papers.length === 0) {

        showMessage(`
          <h2>🔎 No matching papers</h2>

          <p>
            No papers passed your
            ${criteria.accuracy}% relevance threshold.
          </p>

          <p>
            Try lowering the accuracy level or
            making your criteria broader.
          </p>
        `);

        return;

      }


      displayResults(
        papers,
        "🎯 Matching research"
      );


      if (shouldTrack) {

        saveAdvancedTracker(
          criteria,
          papers
        );

        displayTrackedTopics();

      }

    } catch (error) {

      console.error(error);

      showMessage(`
        <h2>❌ Search failed</h2>

        <p>
          ${escapeHtml(error.message)}
        </p>

        <p>
          Check your internet connection and
          try again.
        </p>
      `);

    }

  }


  // ==========================================
  // VALID DATE
  // ==========================================

  function isValidDate(paper) {

    if (!paper.publication_date) {
      return false;
    }

    const today =
      new Date();

    today.setHours(23, 59, 59, 999);

    const date =
      new Date(
        paper.publication_date
      );

    return (
      !isNaN(date.getTime()) &&
      date <= today
    );

  }


  // ==========================================
  // ADVANCED FILTERS
  // ==========================================

  function matchesAdvancedCriteria(
    paper,
    criteria
  ) {

    const title =
      (paper.title || "").toLowerCase();

    const abstract =
      getAbstract(paper).toLowerCase();

    const authors =
      getAuthors(paper).toLowerCase();

    const journal =
      getJournal(paper).toLowerCase();

    const concepts =
      getConcepts(paper).toLowerCase();

    const text =
      `${title} ${abstract} ${authors} ${journal} ${concepts}`;


    // Excluded terms

    for (const excluded of criteria.excluded) {

      if (
        text.includes(
          excluded.toLowerCase()
        )
      ) {

        return false;

      }

    }


    // Author

    if (
      criteria.author &&
      !authors.includes(
        criteria.author.toLowerCase()
      )
    ) {

      return false;

    }


    // Journal

    if (
      criteria.journal &&
      !journal.includes(
        criteria.journal.toLowerCase()
      )
    ) {

      return false;

    }


    // Required keywords

    for (const keyword of criteria.keywords) {

      if (
        !text.includes(
          keyword.toLowerCase()
        )
      ) {

        return false;

      }

    }


    // Date

    if (
      criteria.dateRange !== "all"
    ) {

      const days =
        Number(criteria.dateRange);

      const cutoff =
        new Date();

      cutoff.setDate(
        cutoff.getDate() - days
      );

      const publication =
        new Date(
          paper.publication_date
        );

      if (publication < cutoff) {
        return false;
      }

    }


    return true;

  }


  // ==========================================
  // SCORE
  // ==========================================

  function calculateScore(
    paper,
    criteria
  ) {

    let score = 0;

    const title =
      (paper.title || "").toLowerCase();

    const abstract =
      getAbstract(paper).toLowerCase();

    const concepts =
      getConcepts(paper).toLowerCase();

    const authors =
      getAuthors(paper).toLowerCase();

    const journal =
      getJournal(paper).toLowerCase();


    const keywordCount =
      criteria.keywords.length;


    if (keywordCount > 0) {

      let matched = 0;

      for (
        const keyword of criteria.keywords
      ) {

        const k =
          keyword.toLowerCase();

        if (title.includes(k)) {

          score += 30;
          matched++;

        }

        else if (abstract.includes(k)) {

          score += 20;
          matched++;

        }

        else if (concepts.includes(k)) {

          score += 15;
          matched++;

        }

      }


      if (matched === keywordCount) {
        score += 10;
      }

    }


    if (criteria.author) {

      if (
        authors.includes(
          criteria.author.toLowerCase()
        )
      ) {

        score += 20;

      }

    }


    if (criteria.journal) {

      if (
        journal.includes(
          criteria.journal.toLowerCase()
        )
      ) {

        score += 15;

      }

    }


    if (criteria.field) {

      const field =
        criteria.field.toLowerCase();

      if (
        title.includes(field) ||
        abstract.includes(field) ||
        concepts.includes(field)
      ) {

        score += 10;

      }

    }


    // Recent papers get a small bonus.

    const publication =
      new Date(
        paper.publication_date
      );

    const now =
      new Date();

    const days =
      Math.floor(
        (now - publication) /
        86400000
      );


    if (days <= 30) {
      score += 10;
    }

    else if (days <= 90) {
      score += 7;
    }

    else if (days <= 365) {
      score += 4;
    }


    return Math.min(
      100,
      score
    );

  }


  // ==========================================
  // ABSTRACT
  // ==========================================

  function getAbstract(paper) {

    const index =
      paper.abstract_inverted_index;

    if (!index) {
      return "";
    }

    const words = [];

    for (const word in index) {

      for (
        const position of index[word]
      ) {

        words[position] = word;

      }

    }

    return words.join(" ");

  }


  // ==========================================
  // AUTHORS
  // ==========================================

  function getAuthors(paper) {

    return (
      paper.authorships || []
    )
      .map(
        a =>
          a.author?.display_name || ""
      )
      .join(" ");

  }


  // ==========================================
  // JOURNAL
  // ==========================================

  function getJournal(paper) {

    return (
      paper.primary_location
        ?.source
        ?.display_name || ""
    );

  }


  // ==========================================
  // CONCEPTS
  // ==========================================

  function getConcepts(paper) {

    return (
      paper.concepts || []
    )
      .map(
        c =>
          c.display_name || ""
      )
      .join(" ");

  }


  // ==========================================
  // DISPLAY RESULTS
  // ==========================================

  function displayResults(
    papers,
    title
  ) {

    currentResults =
      papers;

    currentVisible =
      10;


    results.innerHTML = `

      <div class="card">

        <h2>
          ${escapeHtml(title)}
        </h2>

        <p id="resultCounter"></p>

      </div>

      <div id="paperList"></div>

      <div
        id="loadMoreArea"
        style="
          text-align:center;
          margin:30px 0;
        "
      ></div>

    `;


    renderCurrentResults();

  }


  function renderCurrentResults() {

    const list =
      document.getElementById(
        "paperList"
      );

    const loadMoreArea =
      document.getElementById(
        "loadMoreArea"
      );

    const counter =
      document.getElementById(
        "resultCounter"
      );


    if (!list) {
      return;
    }


    list.innerHTML = "";


    const visible =
      currentResults.slice(
        0,
        currentVisible
      );


    visible.forEach(
      paper => {

        list.appendChild(
          createPaperCard(paper)
        );

      }
    );


    counter.textContent =
      `Showing ${visible.length} of ${currentResults.length} papers`;


    loadMoreArea.innerHTML = "";


    if (
      currentVisible <
      currentResults.length
    ) {

      const button =
        document.createElement("button");

      button.textContent =
        "Load more";


      button.addEventListener(
        "click",
        () => {

          currentVisible += 10;

          renderCurrentResults();

        }
      );


      loadMoreArea.appendChild(
        button
      );

    }

  }


  // ==========================================
  // PAPER CARD
  // ==========================================

  function createPaperCard(paper) {

    const card =
      document.createElement("div");

    card.className =
      "paper";


    const title =
      paper.title ||
      "Untitled";


    const authors =
      getAuthors(paper) ||
      "Unknown authors";


    const journal =
      getJournal(paper) ||
      "Unknown source";


    const link =
      paper.primary_location
        ?.landing_page_url ||
      paper.doi ||
      "#";


    const score =
      paper.strackerScore;


    card.innerHTML = `

      ${
        score !== undefined
        ? `
          <span class="badge">
            Relevance: ${score}%
          </span>
        `
        : ""
      }

      <span class="badge">
        ${escapeHtml(
          paper.publication_date ||
          "Unknown date"
        )}
      </span>


      <h2>
        ${escapeHtml(title)}
      </h2>


      <p>
        <strong>Authors:</strong>
        ${escapeHtml(authors)}
      </p>


      <p>
        <strong>Journal:</strong>
        ${escapeHtml(journal)}
      </p>


      <a
        href="${link}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View paper →
      </a>

    `;


    return card;

  }


  // ==========================================
  // TRACKING
  // ==========================================

  function saveAdvancedTracker(
    criteria,
    papers
  ) {

    const trackers =
      getAdvancedTrackers();


    const tracker = {

      id: Date.now(),

      criteria: criteria,

      createdAt: getToday(),

      lastChecked: getToday(),

      seenPaperIds:
        papers.map(
          paper => paper.id
        ),

      lastCheckNewPapers:
        papers.length,

      totalNewPapers:
        papers.length

    };


    trackers.push(tracker);


    localStorage.setItem(
      "stracker_advanced",
      JSON.stringify(trackers)
    );

  }


  function getAdvancedTrackers() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "stracker_advanced"
        ) || "[]"
      );

    } catch {

      return [];

    }

  }


  // ==========================================
  // TRACKED DISPLAY
  // ==========================================

  function displayTrackedTopics() {

    const trackers =
      getAdvancedTrackers();


    if (!trackers.length) {

      trackedTopics.innerHTML =
        "";

      return;

    }


    trackedTopics.innerHTML = `

      <div class="card">

        <h2>
          📚 My tracked research
        </h2>

        ${trackers.map(
          tracker => {

            const keywords =
              tracker.criteria.keywords
                .map(
                  k =>
                    `<span class="badge">
                      ${escapeHtml(k)}
                    </span>`
                )
                .join("");


            return `

              <div class="tracked-topic">

                <h3>
                  🔬 Research profile
                </h3>

                <p>
                  ${keywords}
                </p>

                ${
                  tracker.criteria.author
                  ? `
                    <p>
                      👤 Author:
                      ${escapeHtml(
                        tracker.criteria.author
                      )}
                    </p>
                  `
                  : ""
                }

                ${
                  tracker.criteria.journal
                  ? `
                    <p>
                      📖 Journal:
                      ${escapeHtml(
                        tracker.criteria.journal
                      )}
                    </p>
                  `
                  : ""
                }

                <p>
                  🎯 Accuracy:
                  ${tracker.criteria.accuracy}%
                </p>

                <p>
                  📅 Last checked:
                  ${tracker.lastChecked}
                </p>

                <p>
                  📚 Papers found:
                  ${tracker.seenPaperIds.length}
                </p>

              </div>

            `;

          }
        ).join("")}

      </div>

    `;

  }


  // ==========================================
  // MESSAGE
  // ==========================================

  function showMessage(html) {

    results.innerHTML = `
      <div class="card">
        ${html}
      </div>
    `;

  }


  // ==========================================
  // TODAY
  // ==========================================

  function getToday() {

    const date =
      new Date();

    return (
      date.getFullYear() +
      "-" +
      String(
        date.getMonth() + 1
      ).padStart(2, "0") +
      "-" +
      String(
        date.getDate()
      ).padStart(2, "0")
    );

  }


  // ==========================================
  // ESCAPE HTML
  // ==========================================

  function escapeHtml(text) {

    const div =
      document.createElement("div");

    div.textContent =
      String(text);

    return div.innerHTML;

  }


  // ==========================================
  // INITIALIZE
  // ==========================================

  accuracyValue.textContent =
    accuracyInput.value + "%";

  displayTrackedTopics();

});
