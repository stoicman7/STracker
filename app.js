document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // ELEMENTS
  // ==========================================

  const searchInput =
    document.getElementById("searchInput");

  const searchButton =
    document.getElementById("searchButton");

  const results =
    document.getElementById("results");

  const trackedTopics =
    document.getElementById("trackedTopics");

  const keywordContainer =
    document.getElementById("keywordContainer");

  const excludeContainer =
    document.getElementById("excludeContainer");

  const addKeywordButton =
    document.getElementById("addKeywordButton");

  const addExcludeButton =
    document.getElementById("addExcludeButton");

  const authorInput =
    document.getElementById("authorInput");

  const journalInput =
    document.getElementById("journalInput");

  const fieldInput =
    document.getElementById("fieldInput");

  const dateRangeInput =
    document.getElementById("dateRangeInput");

  const documentTypeInput =
    document.getElementById("documentTypeInput");

  const accuracyInput =
    document.getElementById("accuracyInput");

  const accuracyValue =
    document.getElementById("accuracyValue");

  const previewButton =
    document.getElementById("previewButton");

  const advancedTrackButton =
    document.getElementById("advancedTrackButton");


  // ==========================================
  // SEARCH STATE
  // ==========================================

  let currentResults = [];
  let currentVisible = 10;


  // ==========================================
  // QUICK SEARCH
  // ==========================================

  searchButton.addEventListener(
    "click",
    quickSearch
  );


  searchInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        quickSearch();

      }

    }
  );


  async function quickSearch() {

    const query =
      searchInput.value.trim();


    if (!query) {

      showMessage(`
        <h2>Please enter a search term.</h2>

        <p>
          Type a scientific topic and search again.
        </p>
      `);

      return;

    }


    results.innerHTML = `
      <div class="card">

        <h2>🔎 Searching...</h2>

        <p>
          Searching for
          <strong>${escapeHtml(query)}</strong>
        </p>

      </div>
    `;


    try {

      const url =
        "https://api.openalex.org/works" +
        "?search=" +
        encodeURIComponent(query) +
        "&sort=publication_date:desc" +
        "&per-page=100";


      const response =
        await fetch(url);


      if (!response.ok) {

        let errorMessage =
          `OpenAlex request failed (${response.status}).`;


        try {

          const errorData =
            await response.json();


          if (errorData?.error) {

            errorMessage =
              typeof errorData.error === "string"
                ? errorData.error
                : errorData.error?.message ||
                  errorMessage;

          }


          if (errorData?.message) {

            errorMessage =
              errorData.message;

          }

        } catch (_) {

          // Ignore JSON parsing errors.

        }


        throw new Error(
          errorMessage
        );

      }


      const data =
        await response.json();


      let papers =
        data.results || [];


      papers =
        papers.filter(isValidDate);


      papers.sort((a, b) => {

        return (
          new Date(b.publication_date) -
          new Date(a.publication_date)
        );

      });


      displayResults(
        papers,
        `Latest papers for "${query}"`
      );


    } catch (error) {

      console.error(error);


      showMessage(`
        <h2>❌ Search failed</h2>

        <p>
          ${escapeHtml(error.message)}
        </p>

        <p>
          Please check your connection and try again.
        </p>
      `);

    }

  }


  // ==========================================
  // ACCURACY SLIDER
  // ==========================================

  accuracyValue.textContent =
    accuracyInput.value + "%";


  accuracyInput.addEventListener(
    "input",
    () => {

      accuracyValue.textContent =
        accuracyInput.value + "%";

    }
  );


  // ==========================================
  // ADD REQUIRED KEYWORD
  // ==========================================

  addKeywordButton.addEventListener(
    "click",
    () => {

      createInputRow(
        keywordContainer,
        "required-keyword",
        "Example: memory formation"
      );

    }
  );


  // ==========================================
  // ADD EXCLUDED KEYWORD
  // ==========================================

  addExcludeButton.addEventListener(
    "click",
    () => {

      createInputRow(
        excludeContainer,
        "excluded-keyword",
        "Example: animal studies"
      );

    }
  );


  function createInputRow(
    container,
    className,
    placeholder
  ) {

    const row =
      document.createElement("div");


    row.className =
      "keyword-row";


    const input =
      document.createElement("input");


    input.type =
      "text";


    input.className =
      className;


    input.placeholder =
      placeholder;


    const removeButton =
      document.createElement("button");


    removeButton.type =
      "button";


    removeButton.textContent =
      "×";


    removeButton.className =
      "danger";


    removeButton.addEventListener(
      "click",
      () => {

        row.remove();

      }
    );


    row.appendChild(input);

    row.appendChild(removeButton);

    container.appendChild(row);

  }


  // ==========================================
  // GET ADVANCED CRITERIA
  // ==========================================

  function getCriteria() {

    const keywords =
      Array.from(
        document.querySelectorAll(
          ".required-keyword"
        )
      )
        .map(input => input.value.trim())
        .filter(Boolean);


    const excluded =
      Array.from(
        document.querySelectorAll(
          ".excluded-keyword"
        )
      )
        .map(input => input.value.trim())
        .filter(Boolean);


    return {

      keywords: keywords,

      excluded: excluded,

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
    () => {

      runAdvancedSearch(false);

    }
  );


  // ==========================================
  // TRACK
  // ==========================================

  advancedTrackButton.addEventListener(
    "click",
    () => {

      runAdvancedSearch(true);

    }
  );


  // ==========================================
  // ADVANCED SEARCH
  // ==========================================

  async function runAdvancedSearch(
    shouldTrack
  ) {

    const criteria =
      getCriteria();


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
          Searching for papers matching
          your research profile.
        </p>

      </div>
    `;


    try {

      const papers =
        await searchWithCriteria(
          criteria
        );


      if (papers.length === 0) {

        showMessage(`
          <h2>🔎 No matching papers</h2>

          <p>
            No papers passed your
            ${criteria.accuracy}% relevance threshold.
          </p>

          <p>
            Try lowering the accuracy level
            or making your criteria broader.
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
          Please try again.
        </p>
      `);

    }

  }


  // ==========================================
  // SEARCH WITH CRITERIA
  // ==========================================

  async function searchWithCriteria(
    criteria
  ) {

    let query =
      criteria.keywords.join(" ");


    if (!query) {

      if (criteria.author) {

        query =
          criteria.author;

      } else if (criteria.journal) {

        query =
          criteria.journal;

      } else if (criteria.field) {

        query =
          criteria.field;

      }

    }


    if (!query) {

      throw new Error(
        "No searchable criteria were provided."
      );

    }


    // Build the OpenAlex request safely.
    const params =
      new URLSearchParams();


    params.set(
      "search",
      query
    );


    params.set(
      "sort",
      "publication_date:desc"
    );


    params.set(
      "per-page",
      "100"
    );


    const url =
      "https://api.openalex.org/works?" +
      params.toString();


    const response =
      await fetch(url);


    if (!response.ok) {

      let errorMessage =
        `OpenAlex request failed (${response.status}).`;


      try {

        const errorData =
          await response.json();


        if (errorData?.error) {

          errorMessage =
            typeof errorData.error === "string"
              ? errorData.error
              : errorData.error?.message ||
                errorMessage;

        }


        if (errorData?.message) {

          errorMessage =
            errorData.message;

        }

      } catch (_) {

        // Ignore JSON parsing errors.

      }


      throw new Error(
        errorMessage
      );

    }


    const data =
      await response.json();


    let papers =
      data.results || [];


    // Remove invalid/future dates.
    papers =
      papers.filter(isValidDate);


    // Apply advanced filters.
    papers =
      papers.filter(
        paper =>
          matchesAdvancedCriteria(
            paper,
            criteria
          )
      );


    // Calculate relevance.
    papers =
      papers.map(paper => {

        return {

          ...paper,

          strackerScore:
            calculateScore(
              paper,
              criteria
            )

        };

      });


    // Apply accuracy threshold.
    papers =
      papers.filter(
        paper =>
          paper.strackerScore >=
          criteria.accuracy
      );


    // Highest relevance first.
    papers.sort((a, b) => {

      return (
        b.strackerScore -
        a.strackerScore
      );

    });


    return papers;

  }


  // ==========================================
  // DATE VALIDATION
  // ==========================================

  function isValidDate(paper) {

    if (!paper.publication_date) {

      return false;

    }


    const date =
      new Date(
        paper.publication_date
      );


    if (isNaN(date.getTime())) {

      return false;

    }


    const today =
      new Date();


    today.setHours(
      23,
      59,
      59,
      999
    );


    return date <= today;

  }


  // ==========================================
  // ADVANCED FILTERS
  // ==========================================

  function matchesAdvancedCriteria(
    paper,
    criteria
  ) {

    const title =
      (paper.title || "")
        .toLowerCase();


    const abstract =
      getAbstract(paper)
        .toLowerCase();


    const authors =
      getAuthors(paper)
        .toLowerCase();


    const journal =
      getJournal(paper)
        .toLowerCase();


    const concepts =
      getConcepts(paper)
        .toLowerCase();


    const text =
      `${title} ${abstract} ${authors} ${journal} ${concepts}`;


    // Excluded keywords.
    for (
      const excluded of criteria.excluded
    ) {

      if (
        text.includes(
          excluded.toLowerCase()
        )
      ) {

        return false;

      }

    }


    // Author filter.
    if (criteria.author) {

      if (
        !authors.includes(
          criteria.author.toLowerCase()
        )
      ) {

        return false;

      }

    }


    // Journal filter.
    if (criteria.journal) {

      if (
        !journal.includes(
          criteria.journal.toLowerCase()
        )
      ) {

        return false;

      }

    }


    // Required keywords.
    for (
      const keyword of criteria.keywords
    ) {

      if (
        !text.includes(
          keyword.toLowerCase()
        )
      ) {

        return false;

      }

    }


    // Date filter.
    if (
      criteria.dateRange !== "all"
    ) {

      const days =
        Number(
          criteria.dateRange
        );


      const cutoff =
        new Date();


      cutoff.setDate(
        cutoff.getDate() - days
      );


      const publication =
        new Date(
          paper.publication_date
        );


      if (
        publication < cutoff
      ) {

        return false;

      }

    }


    // Document type.
    if (
      criteria.documentType
    ) {

      const type =
        (paper.type || "")
          .toLowerCase();


      const requested =
        criteria.documentType
          .toLowerCase();


      if (
        requested === "article" &&
        type !== "article"
      ) {

        return false;

      }


      if (
        requested === "review" &&
        !(
          type === "review" ||
          text.includes("review")
        )
      ) {

        return false;

      }


      if (
        requested === "preprint" &&
        !text.includes("preprint")
      ) {

        return false;

      }


      if (
        requested === "dataset" &&
        type !== "dataset"
      ) {

        return false;

      }

    }


    return true;

  }


  // ==========================================
  // RELEVANCE SCORE
  // ==========================================

  function calculateScore(
    paper,
    criteria
  ) {

    let score = 0;


    const title =
      (paper.title || "")
        .toLowerCase();


    const abstract =
      getAbstract(paper)
        .toLowerCase();


    const concepts =
      getConcepts(paper)
        .toLowerCase();


    const authors =
      getAuthors(paper)
        .toLowerCase();


    const journal =
      getJournal(paper)
        .toLowerCase();


    // Keywords.
    for (
      const keyword of criteria.keywords
    ) {

      const k =
        keyword.toLowerCase();


      if (title.includes(k)) {

        score += 30;

      } else if (
        abstract.includes(k)
      ) {

        score += 20;

      } else if (
        concepts.includes(k)
      ) {

        score += 15;

      }

    }


    // Author.
    if (
      criteria.author &&
      authors.includes(
        criteria.author.toLowerCase()
      )
    ) {

      score += 20;

    }


    // Journal.
    if (
      criteria.journal &&
      journal.includes(
        criteria.journal.toLowerCase()
      )
    ) {

      score += 15;

    }


    // Research field.
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


    // Recency bonus.
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

    } else if (days <= 90) {

      score += 7;

    } else if (days <= 365) {

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


    for (
      const word in index
    ) {

      const positions =
        index[word];


      for (
        const position of positions
      ) {

        words[position] =
          word;

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
        author =>
          author.author?.display_name || ""
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
        concept =>
          concept.display_name || ""
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
          text-align: center;
          margin: 30px 0;
        "
      ></div>

    `;


    renderCurrentResults();

  }


  // ==========================================
  // RENDER RESULTS
  // ==========================================

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


    list.innerHTML =
      "";


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


    if (counter) {

      counter.textContent =
        `Showing ${visible.length} of ${currentResults.length} papers`;

    }


    loadMoreArea.innerHTML =
      "";


    if (
      currentVisible <
      currentResults.length
    ) {

      const button =
        document.createElement(
          "button"
        );


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


    let scoreBadge =
      "";


    if (
      score !== undefined
    ) {

      scoreBadge = `
        <span class="badge">
          Relevance: ${score}%
        </span>
      `;

    }


    card.innerHTML = `

      ${scoreBadge}

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
        href="${escapeAttribute(link)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View paper →
      </a>

    `;


    return card;

  }


  // ==========================================
  // SAVE TRACKER
  // ==========================================

  function saveAdvancedTracker(
    criteria,
    papers
  ) {

    const trackers =
      getAdvancedTrackers();


    const tracker = {

      id:
        Date.now(),

      criteria: {

        keywords: [
          ...criteria.keywords
        ],

        excluded: [
          ...criteria.excluded
        ],

        author:
          criteria.author,

        journal:
          criteria.journal,

        field:
          criteria.field,

        dateRange:
          criteria.dateRange,

        documentType:
          criteria.documentType,

        accuracy:
          criteria.accuracy

      },

      createdAt:
        getToday(),

      lastChecked:
        getToday(),

      seenPaperIds:
        papers
          .map(paper => paper.id),

      lastCheckNewPapers:
        papers.length,

      totalNewPapers:
        papers.length

    };


    trackers.push(
      tracker
    );


    localStorage.setItem(
      "stracker_advanced",
      JSON.stringify(trackers)
    );

  }


  // ==========================================
  // GET TRACKERS
  // ==========================================

  function getAdvancedTrackers() {

    try {

      const saved =
        localStorage.getItem(
          "stracker_advanced"
        );


      if (!saved) {

        return [];

      }


      const parsed =
        JSON.parse(saved);


      return Array.isArray(parsed)
        ? parsed
        : [];


    } catch (error) {

      console.error(
        "Could not load trackers:",
        error
      );


      return [];

    }

  }


  // ==========================================
  // DISPLAY TRACKED TOPICS
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
          (tracker, index) => {

            const criteria =
              tracker.criteria || {};


            const keywords =
              Array.isArray(criteria.keywords)
                ? criteria.keywords
                    .map(
                      keyword =>
                        `<span class="badge">
                          ${escapeHtml(keyword)}
                        </span>`
                    )
                    .join("")
                : "";


            const excluded =
              Array.isArray(criteria.excluded)
                ? criteria.excluded
                    .map(
                      keyword =>
                        `<span class="badge">
                          ${escapeHtml(keyword)}
                        </span>`
                    )
                    .join("")
                : "";


            return `

              <div
                class="tracked-topic"
                data-tracker-index="${index}"
              >

                <h3>
                  🔬 Research profile ${index + 1}
                </h3>


                ${
                  keywords
                    ? `
                      <p>
                        <strong>
                          Required:
                        </strong>

                        ${keywords}
                      </p>
                    `
                    : ""
                }


                ${
                  excluded
                    ? `
                      <p>
                        <strong>
                          Excluded:
                        </strong>

                        ${excluded}
                      </p>
                    `
                    : ""
                }


                ${
                  criteria.author
                    ? `
                      <p>
                        👤
                        <strong>
                          Author:
                        </strong>

                        ${escapeHtml(
                          criteria.author
                        )}
                      </p>
                    `
                    : ""
                }


                ${
                  criteria.journal
                    ? `
                      <p>
                        📖
                        <strong>
                          Journal:
                        </strong>

                        ${escapeHtml(
                          criteria.journal
                        )}
                      </p>
                    `
                    : ""
                }


                ${
                  criteria.field
                    ? `
                      <p>
                        🧠
                        <strong>
                          Field:
                        </strong>

                        ${escapeHtml(
                          criteria.field
                        )}
                      </p>
                    `
                    : ""
                }


                <p>
                  🎯
                  <strong>
                    Accuracy:
                  </strong>

                  ${Number(
                    criteria.accuracy || 0
                  )}%
                </p>


                <p>
                  📅
                  <strong>
                    Last checked:
                  </strong>

                  ${escapeHtml(
                    tracker.lastChecked ||
                    "Unknown"
                  )}
                </p>


                <p>
                  📚
                  <strong>
                    Papers found:
                  </strong>

                  ${
                    Array.isArray(
                      tracker.seenPaperIds
                    )
                      ? tracker.seenPaperIds.length
                      : 0
                  }
                </p>


                <div class="actions">

                  <button
                    type="button"
                    class="view-tracker-button"
                    data-index="${index}"
                  >
                    👁️ View
                  </button>


                  <button
                    type="button"
                    class="delete-tracker-button danger"
                    data-index="${index}"
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            `;

          }
        ).join("")}

      </div>

    `;


    // ========================================
    // VIEW BUTTONS
    // ========================================

    document
      .querySelectorAll(
        ".view-tracker-button"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset.index
              );


            const trackers =
              getAdvancedTrackers();


            const tracker =
              trackers[index];


            if (!tracker) {

              showMessage(`
                <h2>❌ Tracker not found</h2>

                <p>
                  This tracking profile no longer exists.
                </p>
              `);

              return;

            }


            runSavedTracker(
              tracker.criteria || {}
            );

          }
        );

      });


    // ========================================
    // DELETE BUTTONS
    // ========================================

    document
      .querySelectorAll(
        ".delete-tracker-button"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset.index
              );


            const trackers =
              getAdvancedTrackers();


            if (!trackers[index]) {

              return;

            }


            const confirmed =
              window.confirm(
                "Delete this tracked research profile?"
              );


            if (!confirmed) {

              return;

            }


            trackers.splice(
              index,
              1
            );


            localStorage.setItem(
              "stracker_advanced",
              JSON.stringify(
                trackers
              )
            );


            displayTrackedTopics();

          }
        );

      });

  }


  // ==========================================
  // VIEW SAVED TRACKER
  // ==========================================

  async function runSavedTracker(
    criteria
  ) {

    // Normalize saved criteria so older/incomplete
    // trackers cannot break the search.
    const safeCriteria = {

      keywords:
        Array.isArray(criteria?.keywords)
          ? criteria.keywords
              .map(
                keyword =>
                  String(keyword).trim()
              )
              .filter(Boolean)
          : [],

      excluded:
        Array.isArray(criteria?.excluded)
          ? criteria.excluded
              .map(
                keyword =>
                  String(keyword).trim()
              )
              .filter(Boolean)
          : [],

      author:
        typeof criteria?.author === "string"
          ? criteria.author.trim()
          : "",

      journal:
        typeof criteria?.journal === "string"
          ? criteria.journal.trim()
          : "",

      field:
        typeof criteria?.field === "string"
          ? criteria.field.trim()
          : "",

      dateRange:
        criteria?.dateRange !== undefined &&
        criteria?.dateRange !== null &&
        criteria?.dateRange !== ""
          ? String(criteria.dateRange)
          : "all",

      documentType:
        typeof criteria?.documentType === "string"
          ? criteria.documentType.trim()
          : "",

      accuracy:
        Number.isFinite(
          Number(criteria?.accuracy)
        )
          ? Number(criteria.accuracy)
          : 0

    };


    // Make sure the saved tracker contains
    // at least one searchable criterion.
    const hasCriteria =
      safeCriteria.keywords.length > 0 ||
      safeCriteria.author ||
      safeCriteria.journal ||
      safeCriteria.field;


    if (!hasCriteria) {

      showMessage(`
        <h2>⚠️ Invalid tracking profile</h2>

        <p>
          This saved tracking profile does not contain
          any searchable criteria.
        </p>

        <p>
          Delete this profile and create a new one.
        </p>
      `);

      return;

    }


    results.innerHTML = `
      <div class="card">

        <h2>
          🔎 Checking tracked research...
        </h2>

        <p>
          Looking for papers matching
          your saved criteria.
        </p>

      </div>
    `;


    try {

      const papers =
        await searchWithCriteria(
          safeCriteria
        );


      if (!papers.length) {

        showMessage(`

          <h2>
            🔎 No matching papers
          </h2>

          <p>
            No papers currently match
            this tracking profile.
          </p>

          <p>
            Try lowering the accuracy level
            or broadening the search criteria.
          </p>

        `);

        return;

      }


      displayResults(
        papers,
        "📚 Tracked research results"
      );


    } catch (error) {

      console.error(
        "Tracking search error:",
        error
      );


      showMessage(`

        <h2>
          ❌ Tracking search failed
        </h2>

        <p>
          ${escapeHtml(
            error?.message ||
            "Unknown error while contacting OpenAlex."
          )}
        </p>

        <p>
          Please try again in a few seconds.
        </p>

      `);

    }

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
      document.createElement(
        "div"
      );


    div.textContent =
      String(text);


    return div.innerHTML;

  }


  // ==========================================
  // ESCAPE ATTRIBUTE
  // ==========================================

  function escapeAttribute(text) {

    return String(text)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      );

  }


  // ==========================================
  // INITIALIZE
  // ==========================================

  displayTrackedTopics();

});
