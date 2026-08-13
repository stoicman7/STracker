document.addEventListener("DOMContentLoaded", function () {

  const searchInput =
    document.getElementById("searchInput");

  const searchButton =
    document.getElementById("searchButton");

  const trackedTopics =
    document.getElementById("trackedTopics");

  const results =
    document.getElementById("results");

  const keywordContainer =
    document.getElementById("keywordContainer");

  const excludeContainer =
    document.getElementById("excludeContainer");

  const addKeywordButton =
    document.getElementById("addKeywordButton");

  const addExcludeButton =
    document.getElementById("addExcludeButton");

  const accuracyInput =
    document.getElementById("accuracyInput");

  const accuracyValue =
    document.getElementById("accuracyValue");

  const previewButton =
    document.getElementById("previewButton");

  const advancedTrackButton =
    document.getElementById("advancedTrackButton");


  const API_LIMIT = 100;

  const PAPERS_PER_LOAD = 20;


  // ==========================================
  // QUICK SEARCH
  // ==========================================

  searchButton.addEventListener(
    "click",
    function () {

      quickSearch();

    }
  );


  searchInput.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Enter") {

        event.preventDefault();

        quickSearch();

      }

    }
  );


  // ==========================================
  // ACCURACY SLIDER
  // ==========================================

  accuracyInput.addEventListener(
    "input",
    function () {

      accuracyValue.textContent =
        accuracyInput.value + "%";

    }
  );


  // ==========================================
  // ADD KEYWORD
  // ==========================================

  addKeywordButton.addEventListener(
    "click",
    function () {

      addInputRow(
        keywordContainer,
        "required-keyword",
        "Example: memory formation"
      );

    }
  );


  // ==========================================
  // ADD EXCLUSION
  // ==========================================

  addExcludeButton.addEventListener(
    "click",
    function () {

      addInputRow(
        excludeContainer,
        "excluded-keyword",
        "Example: animal studies"
      );

    }
  );


  // ==========================================
  // PREVIEW
  // ==========================================

  previewButton.addEventListener(
    "click",
    function () {

      runAdvancedSearch(false);

    }
  );


  // ==========================================
  // TRACK
  // ==========================================

  advancedTrackButton.addEventListener(
    "click",
    function () {

      runAdvancedSearch(true);

    }
  );


  displayTrackedTopics();


  // ==========================================
  // ADD INPUT ROW
  // ==========================================

  function addInputRow(
    container,
    className,
    placeholder
  ) {

    const row =
      document.createElement("div");

    row.className =
      "keyword-row";


    row.innerHTML = `

      <input
        type="text"
        class="${className}"
        placeholder="${placeholder}"
      >

      <button
        type="button"
        class="remove-keyword"
      >
        ×
      </button>

    `;


    row
      .querySelector("button")
      .addEventListener(
        "click",
        function () {

          row.remove();

        }
      );


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
      .map(function (input) {

        return input.value.trim();

      })
      .filter(Boolean);


    const excluded =
      Array.from(
        document.querySelectorAll(
          ".excluded-keyword"
        )
      )
      .map(function (input) {

        return input.value.trim();

      })
      .filter(Boolean);


    return {

      keywords: keywords,

      excluded: excluded,

      author:
        document
          .getElementById("authorInput")
          .value
          .trim(),

      journal:
        document
          .getElementById("journalInput")
          .value
          .trim(),

      field:
        document
          .getElementById("fieldInput")
          .value,

      dateRange:
        document
          .getElementById("dateRangeInput")
          .value,

      documentType:
        document
          .getElementById("documentTypeInput")
          .value,

      accuracy:
        Number(
          accuracyInput.value
        )

    };

  }


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

        <h2>
          Add a research criterion
        </h2>

        <p>
          Enter at least one keyword,
          author, journal, or research field.
        </p>

      `);

      return;

    }


    const query =
      criteria.keywords.join(" ");


    showMessage(`

      <h2>
        🔎 Analyzing research...
      </h2>

      <p>
        Building your research profile
        and finding matching papers.
      </p>

    `);


    try {

      let apiQuery =
        query;


      // --------------------------------------
      // Add author/journal to broad query
      // --------------------------------------

      if (criteria.author) {

        apiQuery +=
          " " +
          criteria.author;

      }


      if (criteria.journal) {

        apiQuery +=
          " " +
          criteria.journal;

      }


      if (criteria.field) {

        apiQuery +=
          " " +
          criteria.field;

      }


      if (!apiQuery.trim()) {

        apiQuery = "*";

      }


      let url =
        "https://api.openalex.org/works" +

        "?search=" +
        encodeURIComponent(
          apiQuery
        ) +

        "&sort=publication_date:desc" +

        "&per-page=" +
        API_LIMIT;


      // --------------------------------------
      // Date filter
      // --------------------------------------

      const dateFilter =
        buildDateFilter(
          criteria.dateRange
        );


      if (dateFilter) {

        url +=
          "&filter=" +
          dateFilter;

      }


      const response =
        await fetch(url);


      if (!response.ok) {

        throw new Error(
          "OpenAlex request failed"
        );

      }


      const data =
        await response.json();


      let papers =
        data.results || [];


      papers =
        papers.filter(
          function (paper) {

            return (
              paper.id &&
              paper.publication_date &&
              paper.publication_date <=
              getToday()
            );

          }
        );


      // ======================================
      // LOCAL FILTERING
      // ======================================

      papers =
        papers.filter(
          function (paper) {

            return matchesCriteria(
              paper,
              criteria
            );

          }
        );


      // ======================================
      // SCORE
      // ======================================

      papers =
        papers.map(
          function (paper) {

            const score =
              calculateRelevance(
                paper,
                criteria
              );


            return {

              ...paper,

              strackerScore:
                score

            };

          }
        );


      // ======================================
      // THRESHOLD
      // ======================================

      papers =
        papers.filter(
          function (paper) {

            return (
              paper.strackerScore >=
              criteria.accuracy
            );

          }
        );


      // ======================================
      // SORT BY SCORE
      // ======================================

      papers.sort(
        function (a, b) {

          if (
            b.strackerScore !==
            a.strackerScore
          ) {

            return (
              b.strackerScore -
              a.strackerScore
            );

          }


          return (
            new Date(
              b.publication_date
            ) -

            new Date(
              a.publication_date
            )
          );

        }
      );


      if (!papers.length) {

        showMessage(`

          <h2>
            No papers matched
          </h2>

          <p>
            Try lowering the relevance
            threshold or broadening your
            criteria.
          </p>

        `);

        return;

      }


      displayAdvancedResults(
        papers,
        criteria
      );


      if (shouldTrack) {

        saveAdvancedTracker(
          criteria,
          papers
        );

      }

    }

    catch (error) {

      console.error(error);


      showMessage(`

        <h2>
          Search failed
        </h2>

        <p>
          STracker couldn't connect to
          OpenAlex.
        </p>

        <p>
          Please try again.
        </p>

      `);

    }

  }


  // ==========================================
  // QUICK SEARCH
  // ==========================================

  async function quickSearch() {

    const query =
      searchInput.value.trim();


    if (!query) {

      showMessage(`

        <h2>
          No search term
        </h2>

        <p>
          Enter a scientific topic.
        </p>

      `);

      return;

    }


    showMessage(`

      <h2>
        🔎 Searching...
      </h2>

      <p>
        Searching for
        <strong>
          ${escapeHtml(query)}
        </strong>
      </p>

    `);


    try {

      const url =
        "https://api.openalex.org/works" +

        "?search=" +
        encodeURIComponent(query) +

        "&sort=publication_date:desc" +

        "&per-page=" +
        API_LIMIT;


      const response =
        await fetch(url);


      if (!response.ok) {

        throw new Error(
          "OpenAlex request failed"
        );

      }


      const data =
        await response.json();


      let papers =
        data.results || [];


      papers =
        papers.filter(
          function (paper) {

            return (
              paper.id &&
              paper.publication_date &&
              paper.publication_date <=
              getToday()
            );

          }
        );


      papers.sort(
        function (a, b) {

          return (
            new Date(
              b.publication_date
            ) -

            new Date(
              a.publication_date
            );

          );

        }
      );


      if (!papers.length) {

        showMessage(`

          <h2>
            No papers found
          </h2>

        `);

        return;

      }


      displayPapers(
        papers,
        "Latest research",
        query
      );

    }

    catch (error) {

      console.error(error);


      showMessage(`

        <h2>
          Search failed
        </h2>

        <p>
          Please try again.
        </p>

      `);

    }

  }


  // ==========================================
  // BUILD DATE FILTER
  // ==========================================

  function buildDateFilter(
    range
  ) {

    if (
      !range ||
      range === "all"
    ) {

      return "";

    }


    const date =
      new Date();


    date.setDate(
      date.getDate() -
      Number(range)
    );


    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");


    const day =
      String(
        date.getDate()
      ).padStart(2, "0");


    const from =
      `${year}-${month}-${day}`;


    return (
      "from_publication_date:" +
      from
    );

  }


  // ==========================================
  // CRITERIA MATCH
  // ==========================================

  function matchesCriteria(
    paper,
    criteria
  ) {

    const title =
      (
        paper.title || ""
      ).toLowerCase();


    const abstract =
      getAbstractText(
        paper
      ).toLowerCase();


    const authors =
      (
        paper.authorships || []
      )
      .map(
        function (a) {

          return (
            a.author?.display_name ||
            ""
          );

        }
      )
      .join(" ")
      .toLowerCase();


    const source =
      (
        paper.primary_location
          ?.source
          ?.display_name || ""
      ).toLowerCase();


    const concepts =
      (
        paper.concepts || []
      )
      .map(
        function (c) {

          return (
            c.display_name ||
            ""
          );

        }
      )
      .join(" ")
      .toLowerCase();


    const searchable =
      title +
      " " +
      abstract +
      " " +
      authors +
      " " +
      source +
      " " +
      concepts;


    // --------------------------------------
    // Exclusions
    // --------------------------------------

    for (
      const excluded of criteria.excluded
    ) {

      if (
        searchable.includes(
          excluded.toLowerCase()
        )
      ) {

        return false;

      }

    }


    // --------------------------------------
    // Author
    // --------------------------------------

    if (
      criteria.author &&
      !authors.includes(
        criteria.author.toLowerCase()
      )
    ) {

      return false;

    }


    // --------------------------------------
    // Journal
    // --------------------------------------

    if (
      criteria.journal &&
      !source.includes(
        criteria.journal.toLowerCase()
      )
    ) {

      return false;

    }


    // --------------------------------------
    // Required keywords
    // --------------------------------------

    for (
      const keyword of criteria.keywords
    ) {

      if (
        !searchable.includes(
          keyword.toLowerCase()
        )
      ) {

        return false;

      }

    }


    return true;

  }


  // ==========================================
  // RELEVANCE SCORE
  // ==========================================

  function calculateRelevance(
    paper,
    criteria
  ) {

    let score = 0;


    const title =
      (
        paper.title || ""
      ).toLowerCase();


    const abstract =
      getAbstractText(
        paper
      ).toLowerCase();


    const authors =
      (
        paper.authorships || []
      )
      .map(
        function (a) {

          return (
            a.author?.display_name ||
            ""
          );

        }
      )
      .join(" ")
      .toLowerCase();


    const source =
      (
        paper.primary_location
          ?.source
          ?.display_name || ""
      ).toLowerCase();


    const concepts =
      (
        paper.concepts || []
      )
      .map(
        function (c) {

          return (
            c.display_name ||
            ""
          );

        }
      )
      .join(" ")
      .toLowerCase();


    const searchable =
      title +
      " " +
      abstract +
      " " +
      concepts;


    // ======================================
    // KEYWORD SCORE
    // ======================================

    if (
      criteria.keywords.length
    ) {

      let matched = 0;


      criteria.keywords.forEach(
        function (keyword) {

          const k =
            keyword.toLowerCase();


          if (
            title.includes(k)
          ) {

            score += 30;

            matched++;

          }

          else if (
            abstract.includes(k)
          ) {

            score += 20;

            matched++;

          }

          else if (
            concepts.includes(k)
          ) {

            score += 15;

            matched++;

          }

        }
      );


      if (
        matched ===
        criteria.keywords.length
      ) {

        score += 10;

      }

    }


    // ======================================
    // AUTHOR
    // ======================================

    if (
      criteria.author
    ) {

      if (
        authors.includes(
          criteria.author.toLowerCase()
        )
      ) {

        score += 20;

      }

    }


    // ======================================
    // JOURNAL
    // ======================================

    if (
      criteria.journal
    ) {

      if (
        source.includes(
          criteria.journal.toLowerCase()
        )
      ) {

        score += 15;

      }

    }


    // ======================================
    // FIELD
    // ======================================

    if (
      criteria.field
    ) {

      if (
        searchable.includes(
          criteria.field.toLowerCase()
        )
      ) {

        score += 10;

      }

    }


    // ======================================
    // RECENCY
    // ======================================

    if (
      paper.publication_date
    ) {

      const publication =
        new Date(
          paper.publication_date
        );


      const today =
        new Date();


      const days =
        Math.floor(
          (
            today -
            publication
          ) /
          (
            1000 *
            60 *
            60 *
            24
          )
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

    }


    return Math.min(
      100,
      score
    );

  }


  // ==========================================
  // ABSTRACT TEXT
  // ==========================================

  function getAbstractText(
    paper
  ) {

    if (
      !paper.abstract_inverted_index
    ) {

      return "";

    }


    const index =
      paper.abstract_inverted_index;


    const words = [];


    Object.keys(index)
      .forEach(
        function (word) {

          index[word]
            .forEach(
              function (position) {

                words[position] =
                  word;

              }
            );

        }
      );


    return words.join(" ");

  }


  // ==========================================
  // DISPLAY ADVANCED RESULTS
  // ==========================================

  function displayAdvancedResults(
    papers,
    criteria
  ) {

    const heading =
      "🎯 Ranked research results";


    results.innerHTML = `

      <div class="card">

        <h2>
          ${heading}
        </h2>

        <p>
          Found
          <strong>
            ${papers.length}
          </strong>
          papers meeting your
          <strong>
            ${criteria.accuracy}%
          </strong>
          relevance threshold.
        </p>

      </div>

      <div id="advancedPaperList"></div>

    `;


    const list =
      document.getElementById(
        "advancedPaperList"
      );


    papers.forEach(
      function (paper) {

        const card =
          createAdvancedPaperCard(
            paper
          );


        list.appendChild(card);

      }
    );

  }


  // ==========================================
  // ADVANCED PAPER CARD
  // ==========================================

  function createAdvancedPaperCard(
    paper
  ) {

    const card =
      document.createElement("div");


    card.className =
      "paper";


    const title =
      paper.title ||
      "Untitled";


    const authors =
      (
        paper.authorships || []
      )
      .slice(0, 5)
      .map(
        function (a) {

          return (
            a.author?.display_name
          );

        }
      )
      .filter(Boolean)
      .join(", ") ||
      "Unknown authors";


    const source =
      paper.primary_location
        ?.source
        ?.display_name ||
      "Unknown source";


    const link =
      paper.primary_location
        ?.landing_page_url ||
      paper.doi ||
      "#";


    card.innerHTML = `

      <div>

        <span class="badge">

          Relevance:
          ${paper.strackerScore}%

        </span>

        <span class="badge">

          ${escapeHtml(
            paper.publication_date ||
            "Unknown date"
          )}

        </span>

      </div>


      <h2>

        ${escapeHtml(title)}

      </h2>


      <p>

        <strong>
          Authors:
        </strong>

        ${escapeHtml(authors)}

      </p>


      <p>

        <strong>
          Journal:
        </strong>

        ${escapeHtml(source)}

      </p>


      <p>

        <a
          href="${link}"
          target="_blank"
          rel="noopener noreferrer"
        >
          View paper →
        </a>

      </p>

    `;


    return card;

  }


  // ==========================================
  // SAVE ADVANCED TRACKER
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

      criteria:
        criteria,

      createdAt:
        getToday(),

      lastChecked:
        getToday(),

      seenPaperIds:
        papers.map(
          function (paper) {

            return paper.id;

          }
        ),

      lastCheckNewPapers:
        0,

      totalNewPapers:
        0

    };


    trackers.push(
      tracker
    );


    localStorage.setItem(
      "stracker_advanced",
      JSON.stringify(
        trackers
      )
    );


    displayTrackedTopics();

  }


  // ==========================================
  // DISPLAY TRACKERS
  // ==========================================

  function displayTrackedTopics() {

    const basicTopics =
      getTrackedTopics();


    const advancedTrackers =
      getAdvancedTrackers();


    if (
      basicTopics.length === 0 &&
      advancedTrackers.length === 0
    ) {

      trackedTopics.innerHTML =
        "";

      return;

    }


    trackedTopics.innerHTML = `

      <div class="card">

        <h2>
          📚 My tracked research
        </h2>


        ${basicTopics.map(
          function (topic) {

            return `

              <div class="tracked-topic">

                <h3>
                  ${escapeHtml(
                    topic.name
                  )}
                </h3>

                <p>
                  📅 Last checked:
                  ${escapeHtml(
                    topic.lastChecked ||
                    "Never"
                  )}
                </p>

                <p>
                  📚 Papers tracked:
                  ${
                    topic.seenPaperIds
                      ?.length || 0
                  }
                </p>

                <p>
                  🟢 New since last check:
                  ${
                    topic.lastCheckNewPapers ||
                    0
                  }
                </p>

                <p>
                  📈 Total new:
                  ${
                    topic.totalNewPapers ||
                    0
                  }
                </p>

              </div>

            `;

          }
        ).join("")}


        ${advancedTrackers.map(
          function (tracker) {

            return `

              <div class="tracked-topic">

                <h3>
                  🔬 Advanced research profile
                </h3>

                <p>

                  🔑 Keywords:

                  ${tracker.criteria.keywords
                    .map(
                      function (k) {

                        return `
                          <span class="badge">
                            ${escapeHtml(k)}
                          </span>
                        `;

                      }
                    )
                    .join("")
                  }

                </p>


                ${
                  tracker.criteria.author
                    ? `
                      <p>
                        👤 Author:
                        <strong>
                          ${escapeHtml(
                            tracker.criteria.author
                          )}
                        </strong>
                      </p>
                    `
                    : ""
                }


                ${
                  tracker.criteria.journal
                    ? `
                      <p>
                        📖 Journal:
                        <strong>
                          ${escapeHtml(
                            tracker.criteria.journal
                          )}
                        </strong>
                      </p>
                    `
                    : ""
                }


                <p>
                  🎯 Threshold:
                  <strong>
                    ${tracker.criteria.accuracy}%
                  </strong>
                </p>


                <p>
                  📅 Last checked:
                  <strong>
                    ${tracker.lastChecked}
                  </strong>
                </p>


                <p>
                  📚 Papers tracked:
                  <strong>
                    ${
                      tracker.seenPaperIds.length
                    }
                  </strong>
                </p>


                <p>
                  🟢 New since last check:
                  <strong>
                    ${
                      tracker.lastCheckNewPapers
                    }
                  </strong>
                </p>


                <p>
                  📈 Total new:
                  <strong>
                    ${
                      tracker.totalNewPapers
                    }
                  </strong>
                </p>

              </div>

            `;

          }
        ).join("")}

      </div>

    `;

  }


  // ==========================================
  // GET ADVANCED TRACKERS
  // ==========================================

  function getAdvancedTrackers() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "stracker_advanced"
        ) || "[]"
      );

    }

    catch (error) {

      return [];

    }

  }


  // ==========================================
  // BASIC TRACKERS
  // ==========================================

  function getTrackedTopics() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "stracker_topics"
        ) || "[]"
      );

    }

    catch (error) {

      return [];

    }

  }


  // ==========================================
  // DISPLAY PAPERS
  // ==========================================

  function displayPapers(
    papers,
    heading,
    query
  ) {

    let visibleCount =
      PAPERS_PER_LOAD;


    results.innerHTML = `

      <div class="card">

        <h2>
          ${heading}
        </h2>

        <p>

          Topic:
          <strong>
            ${escapeHtml(query)}
          </strong>

        </p>

        <p id="counter"></p>

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


    const list =
      document.getElementById(
        "paperList"
      );


    const counter =
      document.getElementById(
        "counter"
      );


    const loadMoreArea =
      document.getElementById(
        "loadMoreArea"
      );


    function render() {

      list.innerHTML =
        "";


      const visible =
        papers.slice(
          0,
          visibleCount
        );


      visible.forEach(
        function (paper) {

          list.appendChild(
            createSimplePaperCard(
              paper
            )
          );

        }
      );


      counter.textContent =
        "Showing " +
        visible.length +
        " of " +
        papers.length +
        " papers";


      loadMoreArea.innerHTML =
        "";


      if (
        visibleCount <
        papers.length
      ) {

        const button =
          document.createElement(
            "button"
          );


        button.textContent =
          "Load more";


        button.addEventListener(
          "click",
          function () {

            visibleCount +=
              PAPERS_PER_LOAD;


            render();

          }
        );


        loadMoreArea.appendChild(
          button
        );

      }

    }


    render();

  }


  // ==========================================
  // SIMPLE PAPER CARD
  // ==========================================

  function createSimplePaperCard(
    paper
  ) {

    const card =
      document.createElement(
        "div"
      );


    card.className =
      "paper";


    const title =
      paper.title ||
      "Untitled";


    const authors =
      (
        paper.authorships || []
      )
      .slice(0, 3)
      .map(
        function (a) {

          return (
            a.author?.display_name
          );

        }
      )
      .filter(Boolean)
      .join(", ") ||
      "Unknown authors";


    const source =
      paper.primary_location
        ?.source
        ?.display_name ||
      "Unknown source";


    const link =
      paper.primary_location
        ?.landing_page_url ||
      paper.doi ||
      "#";


    card.innerHTML = `

      <h2>
        ${escapeHtml(title)}
      </h2>

      <p>
        <strong>
          Published:
        </strong>

        ${escapeHtml(
          paper.publication_date ||
          "Unknown"
        )}

      </p>


      <p>
        <strong>
          Authors:
        </strong>

        ${escapeHtml(authors)}

      </p>


      <p>
        <strong>
          Source:
        </strong>

        ${escapeHtml(source)}

      </p>


      <p>

        <a
          href="${link}"
          target="_blank"
          rel="noopener noreferrer"
        >
          View paper →
        </a>

      </p>

    `;


    return card;

  }


  // ==========================================
  // MESSAGE
  // ==========================================

  function showMessage(
    html
  ) {

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

    return new Date()
      .toISOString()
      .split("T")[0];

  }


  // ==========================================
  // ESCAPE HTML
  // ==========================================

  function escapeHtml(
    text
  ) {

    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      String(text);


    return div.innerHTML;

  }

});
