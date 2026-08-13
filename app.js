document.addEventListener("DOMContentLoaded", function () {

  const searchInput = document.getElementById("searchInput");
  const results = document.getElementById("results");
  const searchButton = document.getElementById("searchButton");
  const trackButton = document.getElementById("trackButton");
  const trackedTopics = document.getElementById("trackedTopics");

  const TODAY = "2026-08-13";
  const MIN_DATE = "2020-01-01";

  searchButton.addEventListener("click", searchPapers);

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchPapers();
    }
  });

  trackButton.addEventListener("click", trackCurrentTopic);

  displayTrackedTopics();


  async function searchPapers() {

    const query = searchInput.value.trim();

    if (!query) {
      showMessage("Please enter a research topic.");
      return;
    }

    await fetchAndDisplayPapers(query, false);
  }


  async function fetchAndDisplayPapers(query, trackingMode) {

    showMessage(`
      <p>
        Searching for recent research about
        <strong>${escapeHtml(query)}</strong>...
      </p>
    `);

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

      const validPapers = (data.results || []).filter(function (paper) {

        if (!paper.id || !paper.publication_date) {
          return false;
        }

        return (
          paper.publication_date >= MIN_DATE &&
          paper.publication_date <= TODAY
        );

      });

      validPapers.sort(function (a, b) {

        return (
          new Date(b.publication_date) -
          new Date(a.publication_date)
        );

      });

      if (validPapers.length === 0) {

        showMessage(`
          <h2>No valid papers found</h2>
          <p>Try another research topic.</p>
        `);

        return;
      }


      if (trackingMode) {

        await processTrackedTopic(
          query,
          validPapers
        );

        return;
      }


      displayPapers(
        query,
        validPapers,
        "Latest research"
      );

    }

    catch (error) {

      console.error(error);

      showMessage(`
        <h2>Search error</h2>

        <p>
          Something went wrong while retrieving
          the papers.
        </p>
      `);
    }
  }


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

      showMessage(`
        <h2>Already tracking ✓</h2>

        <p>
          STracker is already tracking
          <strong>${escapeHtml(topic)}</strong>.
        </p>

        <p>
          Checking for new papers...
        </p>
      `);

      await fetchAndDisplayPapers(
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


    saveTrackedTopics(topics);

    displayTrackedTopics();


    showMessage(`
      <h2>Topic tracked ✓</h2>

      <p>
        STracker is now tracking
        <strong>${escapeHtml(topic)}</strong>.
      </p>

      <p>
        Performing the first check...
      </p>
    `);


    await fetchAndDisplayPapers(
      topic,
      true
    );
  }


  async function processTrackedTopic(
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


    const previousIds =
      topic.seenPaperIds || [];


    const newPapers =
      papers.filter(function (paper) {

        return !previousIds.includes(
          paper.id
        );

      });


    const previousCount =
      previousIds.length;


    // Save all currently found papers
    // so they become "seen" next time.

    const currentIds =
      papers.map(function (paper) {
        return paper.id;
      });


    topic.seenPaperIds =
      Array.from(
        new Set(
          previousIds.concat(currentIds)
        )
      );


    topic.lastChecked =
      TODAY;


    saveTrackedTopics(topics);

    displayTrackedTopics();


    if (previousCount === 0) {

      displayPapers(
        topicName,
        papers,
        "First check"
      );

      return;
    }


    if (newPapers.length === 0) {

      showMessage(`
        <h2>No new papers 🎉</h2>

        <p>
          STracker didn't find any papers
          that are new to this tracker.
        </p>

        <p>
          Previously seen:
          <strong>${previousCount}</strong>
        </p>
      `);

      return;
    }


    displayPapers(
      topicName,
      newPapers,
      "🟢 New papers"
    );


    const summary =
      document.createElement("div");


    summary.className =
      "welcome";


    summary.innerHTML = `

      <h2>
        🟢 ${newPapers.length}
        new paper(s)
      </h2>

      <p>
        These papers were not seen
        during previous checks.
      </p>

      <p>
        Previously seen:
        <strong>${previousCount}</strong>
      </p>

    `;


    results.insertBefore(
      summary,
      results.firstChild
    );
  }


  100 paper(s)




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


  function saveTrackedTopics(topics) {

    localStorage.setItem(
      "stracker_topics",
      JSON.stringify(topics)
    );
  }


  function displayTrackedTopics() {

    const topics =
      getTrackedTopics();


    if (topics.length === 0) {

      trackedTopics.innerHTML = "";

      return;
    }


    trackedTopics.innerHTML = `

      <div class="welcome">

        <h3>
          Tracked topics
        </h3>

        ${topics.map(function (topic) {

          const lastChecked =
            topic.lastChecked
            || "Not checked yet";


          return `

            <div
              style="
                margin-bottom: 12px;
                padding: 10px;
                border-bottom: 1px solid #eee;
              "
            >

              <strong>
                ${escapeHtml(topic.name)}
              </strong>

              <br>

              <small>
                Last checked:
                ${escapeHtml(lastChecked)}
              </small>

            </div>

          `;

        }).join("")}

      </div>

    `;
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


      positions.forEach(
        function (position) {

          words[position] =
            word;

        }
      );
    }


    return words.join(" ");
  }


  function escapeHtml(text) {

    const div =
      document.createElement("div");


    div.textContent =
      text;


    return div.innerHTML;
  }

});
