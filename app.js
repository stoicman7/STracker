document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("searchInput");
  const results = document.getElementById("results");
  const searchButton = document.getElementById("searchButton");
  const trackButton = document.getElementById("trackButton");
  const trackedTopics = document.getElementById("trackedTopics");

  const RESULTS_PER_LOAD = 20;
  const API_RESULTS = 100;

  // ==========================================
  // CURRENT DATE
  // ==========================================

  function getToday() {

    const date = new Date();

    return date.toISOString().split("T")[0];

  }


  // ==========================================
  // SEARCH BUTTON
  // ==========================================

  searchButton.addEventListener("click", function () {

    searchPapers();

  });


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

  trackButton.addEventListener("click", function () {

    trackTopic();

  });


  // ==========================================
  // INITIALIZE
  // ==========================================

  displayTrackedTopics();


  // ==========================================
  // NORMAL SEARCH
  // ==========================================

  async function searchPapers() {

    const query =
      searchInput.value.trim();


    if (!query) {

      showMessage(`
        <h2>No search term</h2>

        <p>
          Enter a scientific topic first.
        </p>
      `);

      return;
    }


    await searchOpenAlex(
      query
    );

  }


  // ==========================================
  // SEARCH OPENALEX
  // ==========================================

  async function searchOpenAlex(
    query,
    startDate = null
  ) {

    showMessage(`
      <p>
        Searching for
        <strong>
          ${escapeHtml(query)}
        </strong>
        ...
      </p>
    `);


    try {

      let filter =
        "to_publication_date:" +
        getToday();


      // ----------------------------------------
      // If tracking, only search after the
      // previous check date.
      // ----------------------------------------

      if (startDate) {

        filter =
          "from_publication_date:" +
          startDate +

          ",to_publication_date:" +
          getToday();

      }


      const url =
        "https://api.openalex.org/works?" +

        "search=" +
        encodeURIComponent(query) +

        "&filter=" +
        filter +

        "&sort=publication_date:desc" +

        "&per-page=" +
        API_RESULTS;


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


      // ----------------------------------------
      // Remove invalid dates
      // ----------------------------------------

      papers =
        papers.filter(function (paper) {

          return (
            paper.id &&
            paper.publication_date &&
            paper.publication_date <=
              getToday()
          );

        });


      // ----------------------------------------
      // Newest first
      // ----------------------------------------

      papers.sort(function (a, b) {

        return (
          new Date(b.publication_date) -
          new Date(a.publication_date)
        );

      });


      return papers;

    }

    catch (error) {

      console.error(error);

      showMessage(`
        <h2>Search error</h2>

        <p>
          We couldn't retrieve the papers.
        </p>

        <p>
          Please try again.
        </p>
      `);

      return [];

    }

  }


  // ==========================================
  // TRACK A TOPIC
  // ==========================================

  async function trackTopic() {

    const topicName =
      searchInput.value.trim();


    if (!topicName) {

      showMessage(`
        <h2>No topic entered</h2>

        <p>
          Enter a scientific topic first.
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
          topicName.toLowerCase()
        );

      });


    // ========================================
    // NEW TRACKED TOPIC
    // ========================================

    if (!topic) {

      topic = {

        name: topicName,

        createdAt: getToday(),

        lastChecked: null,

        seenPaperIds: []

      };


      topics.push(topic);


      saveTrackedTopics(topics);

    }


    // ========================================
    // FIRST CHECK
    // ========================================

    if (!topic.lastChecked) {

      const papers =
        await searchOpenAlex(
          topic.name
        );


      if (papers.length === 0) {

        showMessage(`
          <h2>No papers found</h2>

          <p>
            We couldn't find papers for
            <strong>
              ${escapeHtml(topic.name)}
            </strong>.
          </p>
        `);

        return;

      }


      // Remember everything from
      // the first check.

      topic.seenPaperIds =
        papers.map(function (paper) {

          return paper.id;

        });


      topic.lastChecked =
        getToday();


      saveTrackedTopics(topics);


      displayTrackedTopics();


      displayPapers(
        topic.name,
        papers,
        "First check"
      );


      return;

    }


    // ========================================
    // FUTURE CHECK
    // ========================================

    /*
      Publication dates are day-based.

      Therefore we start searching from
      the day AFTER the previous check.
    */

    const nextDate =
      addOneDay(
        topic.lastChecked
      );


    const today =
      getToday();


    // ========================================
    // SAME-DAY CHECK
    // ========================================

    if (
      nextDate > today
    ) {

      showMessage(`

        <h2>
          Already checked today
        </h2>

        <p>
          <strong>
            ${escapeHtml(topic.name)}
          </strong>
          was already checked today.
        </p>

        <p>
          Last checked:
          ${escapeHtml(topic.lastChecked)}
        </p>

        <p>
          Check again tomorrow for
          papers published after this
          check.
        </p>

      `);

      return;

    }


    // ========================================
    // SEARCH ONLY NEW DATE RANGE
    // ========================================

    const newPapers =
      await searchOpenAlex(
        topic.name,
        nextDate
      );


    // ========================================
    // REMOVE ALREADY-SEEN PAPERS
    // ========================================

    const unseenPapers =
      newPapers.filter(function (paper) {

        return !topic.seenPaperIds.includes(
          paper.id
        );

      });


    // ========================================
    // SAVE NEW PAPER IDS
    // ========================================

    const newIds =
      newPapers.map(function (paper) {

        return paper.id;

      });


    topic.seenPaperIds =
      Array.from(
        new Set(
          topic.seenPaperIds.concat(
            newIds
          )
        )
      );


    // ========================================
    // UPDATE LAST CHECK
    // ========================================

    topic.lastChecked =
      today;


    saveTrackedTopics(topics);


    displayTrackedTopics();


    // ========================================
    // NOTHING NEW
    // ========================================

    if (unseenPapers.length === 0) {

      showMessage(`

        <h2>
          No new papers
        </h2>

        <p>
          No new papers were found for:
        </p>

        <p>
          <strong>
            ${escapeHtml(topic.name)}
          </strong>
        </p>

        <p>
          Last checked:
          ${escapeHtml(topic.lastChecked)}
        </p>

      `);

      return;

    }


    // ========================================
    // SHOW NEW PAPERS
    // ========================================

    displayPapers(
      topic.name,
      unseenPapers,
      "🟢 New papers"
    );


    const notice =
      document.createElement("div");


    notice.className =
      "welcome";


    notice.innerHTML = `

      <h2>
        🟢 ${unseenPapers.length}
        new paper(s)
      </h2>

      <p>
        These papers were published
        after your previous check.
      </p>

    `;


    results.insertBefore(
      notice,
      results.firstChild
    );

  }


  // ==========================================
  // ADD ONE DAY
  // ==========================================

  function addOneDay(dateString) {

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
  // DISPLAY PAPERS
  // ==========================================

  function displayPapers(
    query,
    papers,
    heading
  ) {

    let visibleCount =
      RESULTS_PER_LOAD;


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


        button.type =
          "button";


        button.textContent =
          "Load more";


        button.addEventListener(
          "click",
          function () {

            visibleCount +=
              RESULTS_PER_LOAD;


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
  // CREATE PAPER CARD
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


    const abstract =
      getAbstract(paper);


    const card =
      document.createElement(
        "div"
      );


    card.className =
      "paper";


    card.innerHTML = `

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

        ${escapeHtml(source)}
      </p>

      ${
        abstract
          ? `
            <p>
              <strong>
                Abstract:
              </strong>

              ${escapeHtml(abstract)}
            </p>
          `
          : ""
      }

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
  // TRACKED TOPICS
  // ==========================================

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
      JSON.stringify(topics)
    );

  }


  // ==========================================
  // DISPLAY TRACKED TOPICS
  // ==========================================

  function displayTrackedTopics() {

    if (!trackedTopics) {
      return;
    }


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

        ${topics.map(function (topic) {

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
                ${
                  escapeHtml(
                    topic.lastChecked ||
                    "Not checked yet"
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
  // ABSTRACT
  // ==========================================

  function getAbstract(
    paper
  ) {

    const index =
      paper.abstract_inverted_index;


    if (!index) {
      return "";
    }


    const words = [];


    for (
      const word in index
    ) {

      index[word].forEach(
        function (position) {

          words[position] =
            word;

        }
      );

    }


    return words.join(" ");

  }


  // ==========================================
  // MESSAGE
  // ==========================================

  function showMessage(
    message
  ) {

    results.innerHTML = `

      <div class="welcome">
        ${message}
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
      text;


    return div.innerHTML;

  }

});
