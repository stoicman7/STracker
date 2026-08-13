document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const trackButton = document.getElementById("trackButton");
  const results = document.getElementById("results");
  const trackedTopics = document.getElementById("trackedTopics");

  const PAPERS_PER_LOAD = 20;
  const API_LIMIT = 100;


  // ==========================================
  // BUTTONS
  // ==========================================

  searchButton.addEventListener("click", searchPapers);

  trackButton.addEventListener("click", trackTopic);


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
  // INITIAL LOAD
  // ==========================================

  displayTrackedTopics();


  // ==========================================
  // TODAY
  // ==========================================

  function getToday() {

    return new Date()
      .toISOString()
      .split("T")[0];

  }


  // ==========================================
  // NORMAL SEARCH
  // ==========================================

  async function searchPapers() {

    const query =
      searchInput.value.trim();


    if (!query) {

      showMessage(`
        <h2>No search term</h2>
        <p>Please enter a scientific topic.</p>
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
  // FETCH OPENALEX
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
          "OpenAlex error: " +
          response.status
        );

      }


      const data =
        await response.json();


      let papers =
        data.results || [];


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


      papers.sort(function (a, b) {

        return (
          new Date(b.publication_date) -
          new Date(a.publication_date)
        );

      });


      if (tracking) {

        return papers;

      }


      if (!papers.length) {

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
          OpenAlex.
        </p>

        <p>
          Please try again.
        </p>
      `);

    }

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
          Enter a topic first.
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
    // NEW TOPIC
    // ========================================

    if (!topic) {

      topic = {

        name: name,

        createdAt: getToday(),

        lastChecked: null,

        seenPaperIds: [],

        newPaperCount: 0

      };


      topics.push(topic);

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

          <p>
            No papers were found for
            <strong>
              ${escapeHtml(name)}
            </strong>.
          </p>
        `);

        return;

      }


      topic.seenPaperIds =
        papers.map(function (paper) {

          return paper.id;

        });


      topic.lastChecked =
        getToday();


      topic.newPaperCount =
        0;


      saveTrackedTopics(topics);


      displayTrackedTopics();


      displayPapers(
        name,
        papers,
        "First check"
      );


      return;

    }


    // ========================================
    // SAME DAY
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
          <strong>
            ${escapeHtml(name)}
          </strong>
          was already checked today.
        </p>

      `);

      return;

    }


    // ========================================
    // SEARCH NEW DATE RANGE
    // ========================================

    const papers =
      await fetchPapers(
        name,
        fromDate,
        true
      );


    // ========================================
    // FIND NEW PAPERS
    // ========================================

    const newPapers =
      papers.filter(function (paper) {

        return !topic.seenPaperIds.includes(
          paper.id
        );

      });


    // ========================================
    // SAVE NEW PAPER IDS
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


    // ========================================
    // UPDATE COUNTER
    // ========================================

    topic.newPaperCount =
      newPapers.length;


    // ========================================
    // UPDATE LAST CHECK
    // ========================================

    topic.lastChecked =
      getToday();


    saveTrackedTopics(topics);


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
          No new papers were found since
          the previous check.
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
  // CHECK EXISTING TOPIC
  // ==========================================

  async function checkTopic(
    topicName
  ) {

    searchInput.value =
      topicName;


    await trackTopic();

  }


  // ==========================================
  // REMOVE TOPIC
  // ==========================================

  function removeTopic(
    topicName
  ) {

    const topics =
      getTrackedTopics();


    const filtered =
      topics.filter(function (topic) {

        return (
          topic.name.toLowerCase() !==
          topicName.toLowerCase()
        );

      });


    saveTrackedTopics(
      filtered
    );


    displayTrackedTopics();

  }


  // ==========================================
  // DISPLAY TRACKED TOPICS
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

        <h2>
          📚 My tracked research
        </h2>

        ${topics.map(function (topic) {

          const paperCount =
            topic.seenPaperIds
              ? topic.seenPaperIds.length
              : 0;


          const newCount =
            topic.newPaperCount || 0;


          return `

            <div
              style="
                padding:18px 0;
                border-bottom:
                  1px solid #e5e7eb;
              "
            >

              <h3
                style="
                  margin:0 0 8px;
                "
              >
                ${escapeHtml(
                  topic.name
                )}
              </h3>


              <p
                style="
                  margin:5px 0;
                "
              >

                📅 Last checked:

                <strong>
                  ${
                    escapeHtml(
                      topic.lastChecked ||
                      "Never"
                    )
                  }
                </strong>

              </p>


              <p
                style="
                  margin:5px 0;
                "
              >

                📚 Papers tracked:

                <strong>
                  ${paperCount}
                </strong>

              </p>


              <p
                style="
                  margin:5px 0 15px;
                "
              >

                🟢 New papers:

                <strong>
                  ${newCount}
                </strong>

              </p>


              <button
                type="button"
                data-action="check"
                data-topic="${escapeHtml(
                  topic.name
                )}"
              >
                Check now
              </button>


              <button
                type="button"
                data-action="remove"
                data-topic="${escapeHtml(
                  topic.name
                )}"
                style="
                  background:#dc2626;
                  margin-left:8px;
                "
              >
                Remove
              </button>

            </div>

          `;

        }).join("")}

      </div>

    `;


    // ========================================
    // BUTTON EVENTS
    // ========================================

    trackedTopics
      .querySelectorAll(
        "button[data-action]"
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const action =
              button.dataset.action;


            const topic =
              button.dataset.topic;


            if (
              action === "check"
            ) {

              checkTopic(topic);

            }


            if (
              action === "remove"
            ) {

              removeTopic(topic);

            }

          }
        );

      });

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

      paperList.innerHTML =
        "";


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
      JSON.stringify(topics)
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
