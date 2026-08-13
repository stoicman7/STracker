document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("searchInput");
  const results = document.getElementById("results");
  const searchButton = document.getElementById("searchButton");
  const trackButton = document.getElementById("trackButton");
  const trackedTopics = document.getElementById("trackedTopics");

  const TODAY = "2026-08-13";
  const MIN_DATE = "2020-01-01";

  const PAPERS_PER_LOAD = 20;
  const API_LIMIT = 100;

  // -----------------------------
  // BUTTONS
  // -----------------------------

  searchButton.addEventListener("click", function () {
    searchPapers();
  });

  trackButton.addEventListener("click", function () {
    trackCurrentTopic();
  });


  // -----------------------------
  // ENTER KEY
  // -----------------------------

  searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

      event.preventDefault();

      searchPapers();

    }

  });


  displayTrackedTopics();


  // =====================================================
  // SEARCH
  // =====================================================

  async function searchPapers() {

    const query =
      searchInput.value.trim();


    if (!query) {

      showMessage(`
        <h2>No search term</h2>
        <p>Please enter a research topic.</p>
      `);

      return;
    }


    await fetchPapers(
      query,
      false
    );

  }


  // =====================================================
  // FETCH PAPERS
  // =====================================================

  async function fetchPapers(
    query,
    trackingMode
  ) {

    showMessage(`
      <p>
        Searching for
        <strong>${escapeHtml(query)}</strong>...
      </p>
    `);


    try {

      const apiUrl =
        "https://api.openalex.org/works?" +

        "search=" +
        encodeURIComponent(query) +

        "&filter=" +
        "from_publication_date:" +
        MIN_DATE +

        ",to_publication_date:" +
        TODAY +

        "&sort=publication_date:desc" +

        "&per-page=" +
        API_LIMIT;


      const response =
        await fetch(apiUrl);


      if (!response.ok) {

        throw new Error(
          "OpenAlex request failed"
        );

      }


      const data =
        await response.json();


      // -----------------------------
      // Validate dates
      // -----------------------------

      let papers =
        (data.results || [])
          .filter(function (paper) {

            if (
              !paper.id ||
              !paper.publication_date
            ) {

              return false;

            }


            return (
              paper.publication_date >= MIN_DATE &&
              paper.publication_date <= TODAY
            );

          });


      // -----------------------------
      // Newest first
      // -----------------------------

      papers.sort(function (a, b) {

        return (
          new Date(
            b.publication_date
          ) -

          new Date(
            a.publication_date
          )
        );

      });


      if (papers.length === 0) {

        showMessage(`
          <h2>No papers found</h2>

          <p>
            Try another research topic.
          </p>
        `);

        return;

      }


      // -----------------------------
      // Tracking mode
      // -----------------------------

      if (trackingMode) {

        processTrackedTopic(
          query,
          papers
        );

        return;

      }


      // -----------------------------
      // Normal search
      // -----------------------------

      displayPapers(
        query,
        papers,
        "Latest research"
      );

    }

    catch (error) {

      console.error(error);


      showMessage(`
        <h2>Search error</h2>

        <p>
          Something went wrong while
          retrieving the papers.
        </p>
      `);

    }

  }


  // =====================================================
  // DISPLAY PAPERS + LOAD MORE
  // =====================================================

  function displayPapers(
    query,
    papers,
    heading
  ) {

    let visibleCount =
      PAPERS_PER_LOAD;


    results.innerHTML = `

      <div class="welcome">

        <h2>
          ${escapeHtml(heading)}
        </h2>

        <p>
          Topic:
          <strong>
            ${escapeHtml(query)}
          </strong>
        </p>

        <p id="resultCount"></p>

      </div>


      <div id="paperList"></div>


      <div
        id="loadMoreContainer"
        style="
          text-align:center;
          margin:30px 0;
        "
      ></div>

    `;


    const paperList =
      document.getElementById(
        "paperList"
      );


    const resultCount =
      document.getElementById(
        "resultCount"
      );


    const loadMoreContainer =
      document.getElementById(
        "loadMoreContainer"
      );


    function renderPapers() {

      paperList.innerHTML = "";


      const visiblePapers =
        papers.slice(
          0,
          visibleCount
        );


      visiblePapers.forEach(
        function (paper) {

          const paperElement =
            createPaperElement(
              paper
            );


          paperList.appendChild(
            paperElement
          );

        }
      );


      // -----------------------------
      // Result counter
      // -----------------------------

      resultCount.textContent =
        "Showing " +

        Math.min(
          visibleCount,
          papers.length
        ) +

        " of " +

        papers.length +

        " papers";


      // -----------------------------
      // Load more button
      // -----------------------------

      loadMoreContainer.innerHTML =
        "";


      if (
        visibleCount <
        papers.length
      ) {

        const loadMoreButton =
          document.createElement(
            "button"
          );


        loadMoreButton.textContent =
          "Load more";


        loadMoreButton.type =
          "button";


        loadMoreButton.addEventListener(
          "click",
          function () {

            visibleCount +=
              PAPERS_PER_LOAD;


            renderPapers();


            // Scroll slightly toward
            // the newly loaded results.

            loadMoreButton.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

          }
        );


        loadMoreContainer.appendChild(
          loadMoreButton
        );

      }

    }


    renderPapers();

  }


  // =====================================================
  // CREATE PAPER CARD
  // =====================================================

  function createPaperElement(
    paper
  ) {

    const title =
      paper.title ||
      "Untitled";


    const authors =
      paper.authorships
        ?.slice(0, 3)
        .map(function (author) {

          return (
            author.author
              ?.display_name
          );

        })
        .filter(Boolean)
        .join(", ")

      || "Unknown authors";


    const date =
      paper.publication_date ||
      "Unknown date";


    const journal =
      paper.primary_location
        ?.source
        ?.display_name

      || "Unknown source";


    const paperUrl =
      paper.primary_location
        ?.landing_page_url

      || paper.doi

      || "#";


    const abstract =
      getAbstract(paper);


    const element =
      document.createElement(
        "div"
      );


    element.className =
      "paper";


    element.innerHTML = `

      <h2>
        ${escapeHtml(title)}
      </h2>


      <p>
        <strong>
          Published:
        </strong>

        ${escapeHtml(date)}
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

        ${escapeHtml(journal)}
      </p>


      ${
        abstract
          ? `

            <p>
              <strong>
                Abstract:
              </strong>

              ${escapeHtml(
                abstract
              )}
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


    return element;

  }


  // =====================================================
  // TRACK TOPIC
  // =====================================================

  async function trackCurrentTopic() {

    const topic =
      searchInput.value.trim();


    if (!topic) {

      showMessage(`
        <h2>No topic entered</h2>

        <p>
          Enter a research topic first.
        </p>
      `);

      return;

    }


    const topics =
      getTrackedTopics();


    const existingTopic =
      topics.find(function (item) {

        return (
          item.name.toLowerCase() ===
          topic.toLowerCase()
        );

      });


    if (existingTopic) {

      await fetchPapers(
        existingTopic.name,
        true
      );

      return;

    }


    topics.push({

      name: topic,

      addedAt: TODAY,

      lastChecked: null,

      seenPaperIds: []

    });


    saveTrackedTopics(
      topics
    );


    displayTrackedTopics();


    await fetchPapers(
      topic,
      true
    );

  }


  // =====================================================
  // PROCESS TRACKED TOPIC
  // =====================================================

  function processTrackedTopic(
    topicName,
    papers
  ) {

    const topics =
      getTrackedTopics();


    const topic =
      topics.find(function (item) {

        return (
          item.name.toLowerCase() ===
          topicName.toLowerCase()
        );

      });


    if (!topic) {
      return;
    }


    const oldIds =
      topic.seenPaperIds || [];


    const newPapers =
      papers.filter(function (paper) {

        return !oldIds.includes(
          paper.id
        );

      });


    const previousCount =
      oldIds.length;


    // Save the papers we just saw.

    const currentIds =
      papers.map(function (paper) {

        return paper.id;

      });


    topic.seenPaperIds =
      Array.from(
        new Set(
          oldIds.concat(
            currentIds
          )
        )
      );


    topic.lastChecked =
      TODAY;


    saveTrackedTopics(
      topics
    );


    displayTrackedTopics();


    // -----------------------------
    // First check
    // -----------------------------

    if (previousCount === 0) {

      displayPapers(
        topicName,
        papers,
        "First check"
      );

      return;

    }


    // -----------------------------
    // No new papers
    // -----------------------------

    if (newPapers.length === 0) {

      showMessage(`

        <h2>
          No new papers
        </h2>

        <p>
          STracker didn't find any
          papers that it hasn't seen
          before.
        </p>

        <p>
          Previously seen:
          <strong>
            ${previousCount}
          </strong>
        </p>

      `);

      return;

    }


    // -----------------------------
    // New papers
    // -----------------------------

    displayPapers(
      topicName,
      newPapers,
      "🟢 New papers"
    );


    const notice =
      document.createElement(
        "div"
      );


    notice.className =
      "welcome";


    notice.innerHTML = `

      <h2>
        🟢 ${newPapers.length}
        new paper(s)
      </h2>

      <p>
        These papers were not
        seen during previous checks.
      </p>

      <p>
        Previously seen:
        <strong>
          ${previousCount}
        </strong>
      </p>

    `;


    results.insertBefore(
      notice,
      results.firstChild
    );

  }


  // =====================================================
  // LOCAL STORAGE
  // =====================================================

  function getTrackedTopics() {

    try {

      const saved =
        localStorage.getItem(
          "stracker_topics"
        );


      return saved
        ? JSON.parse(saved)
        : [];

    }

    catch (error) {

      return [];

    }

  }


  function saveTrackedTopics(
    topics
  ) {

    localStorage.setItem(
      "stracker_topics",
      JSON.stringify(
        topics
      )
    );

  }


  // =====================================================
  // DISPLAY TRACKED TOPICS
  // =====================================================

  function displayTrackedTopics() {

    const topics =
      getTrackedTopics();


    if (
      topics.length === 0
    ) {

      trackedTopics.innerHTML =
        "";

      return;

    }


    trackedTopics.innerHTML = `

      <div class="welcome">

        <h3>
          Tracked topics
        </h3>


        ${topics.map(
          function (topic) {

            const lastChecked =
              topic.lastChecked
              || "Not checked yet";


            return `

              <div
                style="
                  margin-bottom:12px;
                  padding:10px;
                  border-bottom:
                    1px solid #eee;
                "
              >

                <strong>
                  ${escapeHtml(
                    topic.name
                  )}
                </strong>

                <br>

                <small>
                  Last checked:
                  ${escapeHtml(
                    lastChecked
                  )}
                </small>

              </div>

            `;

          }
        ).join("")}

      </div>

    `;

  }


  // =====================================================
  // ABSTRACT
  // =====================================================

  function getAbstract(
    paper
  ) {

    const invertedIndex =
      paper.abstract_inverted_index;


    if (!invertedIndex) {
      return "";
    }


    const words = [];


    for (
      const word in invertedIndex
    ) {

      const positions =
        invertedIndex[word];


      positions.forEach(
        function (position) {

          words[position] =
            word;

        }
      );

    }


    return words.join(
      " "
    );

  }


  // =====================================================
  // MESSAGE
  // =====================================================

  function showMessage(
    message
  ) {

    results.innerHTML = `

      <div class="welcome">
        ${message}
      </div>

    `;

  }


  // =====================================================
  // SECURITY
  // =====================================================

  function escapeHtml(
    text
  ) {

    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      text;


    return div.innerHTML;

  }

});
