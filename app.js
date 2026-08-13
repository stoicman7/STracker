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
          Searching free research sources for
          <strong>${escapeHtml(query)}</strong>
        </p>

      </div>
    `;


    try {

      const papers =
        await searchFreeSources(
          query
        );


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

      console.error(
        "Free research search error:",
        error
      );


      showMessage(`
        <h2>❌ Search failed</h2>

        <p>
          ${escapeHtml(
            error?.message ||
            "Could not search the free research sources."
          )}
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


    // Search free sources instead of OpenAlex.
    let papers =
      await searchFreeSources(
        query
      );


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
  // FREE RESEARCH SOURCES
  // ==========================================

  async function searchFreeSources(
    query
  ) {

    /*
      Europe PMC is the primary source.

      PubMed is used as a second source.

      Results from both sources are merged and
      duplicate records are removed.

      No OpenAlex request is used.
    */


    const resultsById =
      new Map();


    let europePapers = [];


    try {

      europePapers =
        await searchEuropePMC(
          query
        );


      europePapers.forEach(
        paper => {

          const key =
            getPaperDeduplicationKey(
              paper
            );


          resultsById.set(
            key,
            paper
          );

        }
      );


    } catch (error) {

      console.warn(
        "Europe PMC search failed:",
        error
      );

    }


    // PubMed is attempted as a second free source.
    // If it fails, Europe PMC results are still usable.
    try {

      const pubmedPapers =
        await searchPubMed(
          query
        );


      pubmedPapers.forEach(
        paper => {

          const key =
            getPaperDeduplicationKey(
              paper
            );


          if (
            !resultsById.has(key)
          ) {

            resultsById.set(
              key,
              paper
            );

          } else {

            // Prefer the richer Europe PMC record,
            // but fill missing metadata from PubMed.
            const existing =
              resultsById.get(key);


            resultsById.set(
              key,
              mergePaperRecords(
                existing,
                paper
              )
            );

          }

        }
      );


    } catch (error) {

      console.warn(
        "PubMed search failed:",
        error
      );

    }


    const papers =
      Array.from(
        resultsById.values()
      )
        .filter(isValidDate);


    if (!papers.length) {

      throw new Error(
        "No results were returned from Europe PMC or PubMed."
      );

    }


    return papers;

  }


  // ==========================================
  // EUROPE PMC
  // ==========================================

  async function searchEuropePMC(
    query
  ) {

    const params =
      new URLSearchParams();


    params.set(
      "query",
      query
    );


    params.set(
      "format",
      "json"
    );


    params.set(
      "resultType",
      "core"
    );


    params.set(
      "pageSize",
      "100"
    );


    const url =
      "https://www.ebi.ac.uk/europepmc/webservices/rest/search?" +
      params.toString();


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        `Europe PMC request failed (${response.status}).`
      );

    }


    const data =
      await response.json();


    const results =
      Array.isArray(data?.resultList?.result)
        ? data.resultList.result
        : [];


    return results.map(
      mapEuropePMCRecord
    );

  }


  function mapEuropePMCRecord(
    record
  ) {

    const pmid =
      record.pmid ||
      "";


    const doi =
      record.doi ||
      "";


    const id =
      pmid
        ? `pubmed:${pmid}`
        : doi
          ? `doi:${doi}`
          : `europepmc:${record.id || Date.now()}`;


    const authors =
      Array.isArray(record.authorList?.author)
        ? record.authorList.author
            .map(
              author =>
                author.fullName ||
                [
                  author.firstName,
                  author.lastName
                ]
                  .filter(Boolean)
                  .join(" ")
            )
            .filter(Boolean)
            .join(" ")
        : "";


    let abstract =
      record.abstractText ||
      "";


    if (typeof abstract !== "string") {

      abstract =
        String(abstract || "");

    }


    const journal =
      record.journalTitle ||
      record.journalInfo?.journal?.title ||
      "";


    const publicationDate =
      record.firstPublicationDate ||
      (
        record.pubYear
          ? `${record.pubYear}-01-01`
          : ""
      );


    const landingPage =
      pmid
        ? `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(pmid)}/`
        : doi
          ? `https://doi.org/${encodeURIComponent(doi)}`
          : record.fullTextUrlList?.fullTextUrl?.[0]?.url ||
            "#";


    return {

      id: id,

      title:
        record.title ||
        "Untitled",

      publication_date:
        publicationDate,

      authorship: authors,

      journal_name:
        journal,

      abstract_text:
        abstract,

      source_name:
        "Europe PMC",

      primary_location: {

        landing_page_url:
          landingPage,

        source: {

          display_name:
            journal

        }

      },

      authorships:
        authors
          ? authors
              .split(" ")
              .map(name => ({
                author: {
                  display_name: name
                }
              }))
          : [],

      concepts:
        [],

      type:
        normalizeDocumentType(
          record.pubTypeList?.pubType
        ),

      doi:
        doi
          ? `https://doi.org/${doi}`
          : "",

      pmid:
        pmid

    };

  }


  // ==========================================
  // PUBMED
  // ==========================================

  async function searchPubMed(
    query
  ) {

    const searchParams =
      new URLSearchParams();


    searchParams.set(
      "db",
      "pubmed"
    );


    searchParams.set(
      "term",
      query
    );


    searchParams.set(
      "retmode",
      "json"
    );


    searchParams.set(
      "retmax",
      "100"
    );


    searchParams.set(
      "sort",
      "pub date"
    );


    const searchUrl =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" +
      searchParams.toString();


    const searchResponse =
      await fetch(searchUrl);


    if (!searchResponse.ok) {

      throw new Error(
        `PubMed search failed (${searchResponse.status}).`
      );

    }


    const searchData =
      await searchResponse.json();


    const ids =
      searchData?.esearchresult?.idlist || [];


    if (!ids.length) {

      return [];

    }


    const summaryParams =
      new URLSearchParams();


    summaryParams.set(
      "db",
      "pubmed"
    );


    summaryParams.set(
      "id",
      ids.join(",")
    );


    summaryParams.set(
      "retmode",
      "json"
    );


    const summaryUrl =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" +
      summaryParams.toString();


    const summaryResponse =
      await fetch(summaryUrl);


    if (!summaryResponse.ok) {

      throw new Error(
        `PubMed metadata request failed (${summaryResponse.status}).`
      );

    }


    const summaryData =
      await summaryResponse.json();


    const records = [];


    ids.forEach(
      pmid => {

        const record =
          summaryData?.result?.[pmid];


        if (!record) {

          return;

        }


        records.push(
          mapPubMedRecord(
            record,
            pmid
          )
        );

      }
    );


    return records;

  }


  function mapPubMedRecord(
    record,
    pmid
  ) {

    const authors =
      Array.isArray(record.authors)
        ? record.authors
            .map(
              author =>
                author.name || ""
            )
            .filter(Boolean)
            .join(" ")
        : "";


    let doi = "";


    if (
      Array.isArray(
        record.articleids
      )
    ) {

      const doiObject =
        record.articleids.find(
          item =>
            item.idtype === "doi"
        );


      if (doiObject) {

        doi =
          doiObject.value || "";

      }

    }


    const journal =
      record.fulljournalname ||
      record.source ||
      "";


    const publicationDate =
      record.pubdate ||
      record.epubdate ||
      "";


    return {

      id:
        `pubmed:${pmid}`,

      title:
        record.title ||
        "Untitled",

      publication_date:
        normalizePubMedDate(
          publicationDate
        ),

      authorship:
        authors,

      authorships:
        authors
          ? authors
              .split(" ")
              .map(name => ({
                author: {
                  display_name: name
                }
              }))
          : [],

      journal_name:
        journal,

      abstract_text:
        "",

      source_name:
        "PubMed",

      primary_location: {

        landing_page_url:
          `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(pmid)}/`,

        source: {

          display_name:
            journal

        }

      },

      concepts:
        [],

      type:
        "article",

      doi:
        doi
          ? `https://doi.org/${doi}`
          : "",

      pmid:
        pmid

    };

  }


  function normalizePubMedDate(
    value
  ) {

    if (!value) {

      return "";

    }


    const match =
      String(value).match(
        /(\d{4})(?:\s+([A-Za-z]{3}))?(?:\s+(\d{1,2}))?/
      );


    if (!match) {

      return "";

    }


    const year =
      match[1];


    const monthNames = {

      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"

    };


    const month =
      monthNames[match[2]] ||
      "01";


    const day =
      match[3]
        ? String(
            Number(match[3])
          ).padStart(2, "0")
        : "01";


    return (
      `${year}-${month}-${day}`
    );

  }


  function normalizeDocumentType(
    types
  ) {

    if (!Array.isArray(types)) {

      return "article";

    }


    const text =
      types
        .join(" ")
        .toLowerCase();


    if (
      text.includes("review")
    ) {

      return "review";

    }


    if (
      text.includes("dataset")
    ) {

      return "dataset";

    }


    if (
      text.includes("preprint")
    ) {

      return "preprint";

    }


    return "article";

  }


  // ==========================================
  // PAPER NORMALIZATION / DEDUPLICATION
  // ==========================================

  function getPaperDeduplicationKey(
    paper
  ) {

    if (paper.pmid) {

      return (
        `pmid:${String(
          paper.pmid
        ).toLowerCase()}`
      );

    }


    if (paper.doi) {

      return (
        `doi:${String(
          paper.doi
        )
          .replace(
            /^https?:\/\/doi\.org\//i,
            ""
          )
          .toLowerCase()}`
      );

    }


    return (
      `title:${String(
        paper.title || ""
      )
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          " "
        )
        .trim()}`
    );

  }


  function mergePaperRecords(
    first,
    second
  ) {

    const merged = {
      ...second,
      ...first
    };


    if (
      !first.abstract_text &&
      second.abstract_text
    ) {

      merged.abstract_text =
        second.abstract_text;

    }


    if (
      !first.pmid &&
      second.pmid
    ) {

      merged.pmid =
        second.pmid;

    }


    if (
      !first.doi &&
      second.doi
    ) {

      merged.doi =
        second.doi;

    }


    if (
      !first.publication_date &&
      second.publication_date
    ) {

      merged.publication_date =
        second.publication_date;

    }


    if (
      !first.journal_name &&
      second.journal_name
    ) {

      merged.journal_name =
        second.journal_name;

    }


    if (
      !first.authorship &&
      second.authorship
    ) {

      merged.authorship =
        second.authorship;

    }


    if (
      !first.primary_location ||
      !first.primary_location.landing_page_url
    ) {

      merged.primary_location =
        second.primary_location;

    }


    return merged;

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

  matchesAdvancedCriteria
  // ==========================================
  // RELEVANCE SCORE
  // ==========================================

  function calculateScore(paper, criteria) {

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


  // ==========================================
  // KEYWORD RELEVANCE
  // ==========================================

  const keywords =
    Array.isArray(criteria.keywords)
      ? criteria.keywords
      : [];


  if (keywords.length > 0) {

    let keywordScore = 0;

    for (const keyword of keywords) {

      const k =
        keyword.toLowerCase().trim();


      if (!k) {
        continue;
      }


      // Strongest match: title
      if (title.includes(k)) {

        keywordScore += 40;

      }

      // Strong match: abstract
      else if (abstract.includes(k)) {

        keywordScore += 30;

      }

      // Weaker match: concepts/metadata
      else if (concepts.includes(k)) {

        keywordScore += 20;

      }

    }


    /*
      Normalize according to the number of keywords.

      Example:

      2 keywords
      1 title match = ~20 points
      2 title matches = ~40 points

      This prevents the score from becoming
      artificially huge when many keywords exist.
    */

    const maxKeywordScore =
      keywords.length * 40;


    if (maxKeywordScore > 0) {

      score +=
        (
          keywordScore /
          maxKeywordScore
        ) * 60;

    }

  }


  // ==========================================
  // AUTHOR
  // ==========================================

  if (criteria.author) {

    if (
      authors.includes(
        criteria.author.toLowerCase()
      )
    ) {

      score += 15;

    }

  }


  // ==========================================
  // JOURNAL
  // ==========================================

  if (criteria.journal) {

    if (
      journal.includes(
        criteria.journal.toLowerCase()
      )
    ) {

      score += 15;

    }

  }


  // ==========================================
  // FIELD
  // ==========================================

  if (criteria.field) {

    const field =
      criteria.field.toLowerCase();


    if (
      title.includes(field)
    ) {

      score += 15;

    }

    else if (
      abstract.includes(field)
    ) {

      score += 10;

    }

    else if (
      concepts.includes(field)
    ) {

      score += 5;

    }

  }


  // ==========================================
  // RECENCY
  // ==========================================

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
    Math.round(score)
  );

}


  // ==========================================
  // ABSTRACT
  // ==========================================

  function getAbstract(paper) {

    // Free-source records already contain a normal
    // abstract string. Keep support for the old
    // inverted-index format as a fallback.
    if (
      typeof paper.abstract_text === "string" &&
      paper.abstract_text.trim()
    ) {

      return paper.abstract_text;

    }


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

    if (
      typeof paper.authorship === "string" &&
      paper.authorship.trim()
    ) {

      return paper.authorship;

    }


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
      paper.journal_name ||
      paper.primary_location
        ?.source
        ?.display_name ||
      ""
    );

  }


  // ==========================================
  // CONCEPTS
  // ==========================================

  function getConcepts(paper) {

    if (
      typeof paper.concepts_text === "string"
    ) {

      return paper.concepts_text;

    }


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
            "Unknown error while contacting the free research sources."
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
