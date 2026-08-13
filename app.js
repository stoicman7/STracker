document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const trackButton = document.getElementById("trackButton");
  const results = document.getElementById("results");
  const trackedTopics = document.getElementById("trackedTopics");

  const PAPERS_PER_LOAD = 20;
  const API_LIMIT = 100;


  // ==========================================
  // SEARCH BUTTON
  // ==========================================

  searchButton.addEventListener("click", searchPapers);


  // ==========================================
  // ENTER KEY
  // ==========================================

  searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

      event.preventDefault();

      searchPapers();

    }

  });


  // ==========================================
  // TRACK BUTTON
  // ==========================================

  trackButton.addEventListener("click", trackTopic);


  displayTrackedTopics();


  // ==========================================
  // GET TODAY
  // ==========================================

  function getToday() {

    return new Date()
      .toISOString()
      .split("T")[0];

  }


  // ==========================================
  // SEARCH
  // ==========================================

  async function searchPapers() {

    const query =
      searchInput.value.trim();


    if (!query) {

      showMessage(`
        <h2>No search term</h2>
        <p>Please enter a topic.</p>
      `);

      return;

    }


    await fetchPapers(
      query,
      null,
      false
    );

  }


  // ==========================================
  // FETCH PAPERS
  // ==========================================

  async function fetchPapers(
    query,
    fromDate,
    tracking
  ) {

    showMessage(`
      <h2>Searching...</h2>

      <p>
        Searching for
        <strong>
          ${escapeHtml(query)}
        </strong>
      </p>
    `);


    try {

      let url =
        "https://api.openalex.org/works" +

        "?search=" +
        encodeURIComponent(query) +

        "&sort=publication_date:desc" +

        "&per-page=" +
        API_LIMIT;


      // ----------------------------------------
      // Tracking search
      // ----------------------------------------

      if (fromDate) {

        url +=
          "&filter=from_publication_date:" +
          encodeURIComponent(fromDate) +

          ",to_publication_date:" +
          getToday();

      }


      const response =
        await fetch(url);


      if (!response.ok) {

        throw new Error(
          "OpenAlex returned " +
          response.status
        );

      }


      const data =
        await response.json();


      let papers =
        data.results || [];


      // ----------------------------------------
      // Remove future papers
      // ----------------------------------------

      const today =
        getToday();


      papers =
        papers.filter(function (paper) {

          return (
            paper.id &&
            paper.publication_date &&
            paper.publication_date <= today
          );

        });


      // ----------------------------------------
      // Sort newest first
      // ----------------------------------------

      papers.sort(function (a, b) {

        return (
          new Date(b.publication_date) -
          new Date(a.publication_date)
        );

      });


      if (tracking) {

        return papers;

      }


      if (papers.length === 0) {

        showMessage(`
          <h2>No papers found</h2>

          <p>
            Try another search term.
          </p>
        `);

        return;

      }


      displayPapers(
        query,
        papers,
        "Latest research"
      );

    }

    catch (error) {

      console.error(error);


      showMessage(`
        <h2>Search failed</h2>

        <p>
          STracker couldn't connect to
          the scientific paper database.
        </p>

        <p>
          Please try again.
        </p>
      `);

    }

  }


  // ==========================================
  // DISPLAY PAPERS
  // ==========================================

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


    const paperList =
      document.getElementById(
        "paperList"
      );


    const counter =
      document.getElementById(
        "resultCounter"
      );


    const loadMoreArea =
      document.getElementById(
        "loadMoreArea"
      );


    function render() {

      paperList.innerHTML = "";


      const visible =
        papers.slice(
          0,
          visibleCount
        );


      visible.forEach(function (paper) {

        paperList.appendChild(
          createPaperCard(paper)
        );

      });


      counter.textContent =
        "Showing " +
        visible.length +
        " of " +
        papers.length +
        " papers";


      loadMoreArea.innerHTML = "";


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


        button.type =
          "button";


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
  // PAPER CARD
  // ==========================================

  function createPaperCard(
    paper
  ) {

    const title =
      paper.title ||
      "Untitled";


    const authors =
      paper.authorships
        ?.slice(0, 3)
        .map(function (item) {

          return item.author?.display_name;

        })
        .filter(Boolean)
        .join(", ")

      || "Unknown authors";


    const date =
      paper.publication_date ||
      "Unknown date";


    const source =
      paper.primary_location
        ?.source
        ?.display_name

      || "Unknown source";


    const link =
      paper.primary_location
        ?.landing_page_url

      || paper.doi

      || "#";


    const card =
      document.createElement("div");


    card.className =
      "paper";


    card.innerHTML = `

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
  // TRACK TOPIC
  // ==========================================

  async function trackTopic() {

    const name =
      searchInput.value.trim();


    if (!name) {

      showMessage(`
        <h2>No topic</h2>

        <p>
          Enter a topic before tracking it.
        </p>
      `);

      return;

    }


    const topics =
      getTrackedTopics();


    let topic =
      topics.find(function (item) {

        return (
          item.name.toLowerCase() ===
          name.toLowerCase()
        );

      });


    // ========================================
    // CREATE NEW TOPIC
    // ========================================

    if (!topic) {

      topic = {

        name: name,

        createdAt: getToday(),

        lastChecked: null,

        seenPaperIds: []

      };


      topics.push(topic);


      saveTrackedTopics(
        topics
      );


      displayTrackedTopics();

    }


    // ========================================
    // FIRST CHECK
    // ========================================

    if (!topic.lastChecked) {

      const papers =
        await fetchPapers(
          name,
          null,
          true
        );


      if (!papers.length) {

        showMessage(`
          <h2>No papers found</h2>
        `);

        return;

      }


      topic.seenPaperIds =
        papers.map(function (paper) {

          return paper.id;

        });


      topic.lastChecked =
        getToday();


      saveTrackedTopics(
        topics
      );


      displayTrackedTopics();


      displayPapers(
        name,
        papers,
        "First check"
      );


      return;

    }


    // ========================================
    // CHECK FOR NEW PAPERS
    // ========================================

    const fromDate =
      addOneDay(
        topic.lastChecked
      );


    if (
      fromDate > getToday()
    ) {

      showMessage(`

        <h2>
          Already checked today
        </h2>

        <p>
          This topic was already checked
          today.
        </p>

      `);

      return;

    }


    const papers =
      await fetchPapers(
        name,
        fromDate,
        true
      );


    const newPapers =
      papers.filter(function (paper) {

        return !topic.seenPaperIds.includes(
          paper.id
        );

      });


    // ========================================
    // SAVE SEEN PAPERS
    // ========================================

    papers.forEach(function (paper) {

      if (
        !topic.seenPaperIds.includes(
          paper.id
        )
      ) {

        topic.seenPaperIds.push(
          paper.id
        );

      }

    });


    topic.lastChecked =
      getToday();


    saveTrackedTopics(
      topics
    );


    displayTrackedTopics();


    // ========================================
    // NO NEW PAPERS
    // ========================================

    if (!newPapers.length) {

      showMessage(`

        <h2>
          No new papers
        </h2>

        <p>
          No new papers were found
          since the previous check.
        </p>

      `);

      return;

    }


    // ========================================
    // SHOW NEW PAPERS
    // ========================================

    displayPapers(
      name,
      newPapers,
      "🟢 New papers"
    );

  }


  // ==========================================
  // ADD ONE DAY
  // ==========================================

  function addOneDay(
    dateString
  ) {

    const date =
      new Date(
        dateString + "T00:00:00"
      );


    date.setDate(
      date.getDate() + 1
    );


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
  // TRACKED TOPICS DISPLAY
  // ==========================================

  function displayTrackedTopics() {

    const topics =
      getTrackedTopics();


    if (!topics.length) {

      trackedTopics.innerHTML =
        "";

      return;

    }


    trackedTopics.innerHTML = `

      <div class="welcome">

        <h3>
          Tracked topics
        </h3>

        ${topics.map(function (topic) {

          return `

            <div
              style="
                padding:10px 0;
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
                ${
                  escapeHtml(
                    topic.lastChecked ||
                    "Never"
                  )
                }
              </small>

            </div>

          `;

        }).join("")}

      </div>

    `;

  }


  // ==========================================
  // LOCAL STORAGE
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


  // ==========================================
  // MESSAGE
  // ==========================================

  function showMessage(
    html
  ) {

    results.innerHTML = `

      <div class="welcome">

        ${html}

      </div>

    `;

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
