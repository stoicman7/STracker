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

  const selectAllKeywordFields =
  document.getElementById("selectAllKeywordFields");

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

  if (searchButton) {

    searchButton.addEventListener(
      "click",
      quickSearch
    );

  }


  if (searchInput) {

    searchInput.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          quickSearch();

        }

      }
    );

  }


  async function quickSearch() {

    const query =
      searchInput
        ? searchInput.value.trim()
        : "";


    if (!query) {

      showMessage(`
        <h2>Please enter a search term.</h2>

        <p>
          Type a scientific topic and search again.
        </p>
      `);

      return;

    }


    showSearchingMessage(
      "🔎 Searching...",
      `Searching free research sources for
       <strong>${escapeHtml(query)}</strong>`
    );


    try {

      const papers =
        await searchFreeSources(
          query
        );


      sortPapersNewestFirst(
        papers
      );


      if (!papers.length) {

        showMessage(`
          <h2>🔎 No papers found</h2>

          <p>
            No papers were found for
            <strong>${escapeHtml(query)}</strong>.
          </p>

          <p>
            Try a broader search term.
          </p>
        `);

        return;

      }


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

  if (accuracyInput) {

    // Force the range to 0–100.
    accuracyInput.min = "0";
    accuracyInput.max = "100";
    accuracyInput.step = "1";

  }


  if (accuracyValue && accuracyInput) {

    accuracyValue.textContent =
      `${accuracyInput.value}%`;


    accuracyInput.addEventListener(
      "input",
      () => {

        accuracyValue.textContent =
          `${accuracyInput.value}%`;

      }
    );

  }


  // ==========================================
  // ADD REQUIRED KEYWORD
  // ==========================================

  if (addKeywordButton) {

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

  }


  // ==========================================
  // ADD EXCLUDED KEYWORD
  // ==========================================

  if (addExcludeButton) {

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

  }


  // ==========================================
// SELECT ALL KEYWORD FIELDS
// ==========================================

if (selectAllKeywordFields) {

  selectAllKeywordFields.addEventListener(
    "click",
    () => {

      const checkboxes =
        document.querySelectorAll(
          ".keyword-field"
        );

      const allChecked =
        Array.from(checkboxes).every(
          checkbox => checkbox.checked
        );

      checkboxes.forEach(
        checkbox => {
          checkbox.checked = !allChecked;
        }
      );

      selectAllKeywordFields.textContent =
        allChecked
          ? "Select all"
          : "Deselect all";

    }
  );

}
  function createInputRow(
    container,
    className,
    placeholder
  ) {

    if (!container) {
      return;
    }


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
        .map(
          input =>
            input.value.trim()
        )
        .filter(Boolean);


    const excluded =
      Array.from(
        document.querySelectorAll(
          ".excluded-keyword"
        )
      )
        .map(
          input =>
            input.value.trim()
        )
        .filter(Boolean);


    // ----------------------------------------
    // KEYWORD SEARCH FIELDS
    // ----------------------------------------

    const keywordFields =
      Array.from(
        document.querySelectorAll(
          ".keyword-field:checked"
        )
      )
        .map(
          input =>
            input.value
        );


    // ----------------------------------------
    // KEYWORD MATCH MODE
    // ----------------------------------------

    const keywordModeInput =
      document.querySelector(
        'input[name="keywordMode"]:checked'
      );


    const keywordMode =
      keywordModeInput
        ? keywordModeInput.value
        : "all";


    // ----------------------------------------
    // ACCURACY
    // ----------------------------------------

    const accuracy =
      accuracyInput
        ? Number(accuracyInput.value)
        : 0;


    return {

      keywords,

      excluded,

      keywordFields,

      keywordMode:
        keywordMode === "any"
          ? "any"
          : "all",

      author:
        authorInput
          ? authorInput.value.trim()
          : "",

      journal:
        journalInput
          ? journalInput.value.trim()
          : "",

      field:
        fieldInput
          ? fieldInput.value
          : "",

      dateRange:
        dateRangeInput
          ? dateRangeInput.value
          : "all",

      documentType:
        documentTypeInput
          ? documentTypeInput.value
          : "",

      accuracy:
        Number.isFinite(accuracy)
          ? Math.max(
              0,
              Math.min(
                100,
                accuracy
              )
            )
          : 0

    };

  }


  // ==========================================
  // PREVIEW
  // ==========================================

  if (previewButton) {

    previewButton.addEventListener(
      "click",
      () => {

        runAdvancedSearch(
          false
        );

      }
    );

  }


  // ==========================================
  // TRACK
  // ==========================================

  if (advancedTrackButton) {

    advancedTrackButton.addEventListener(
      "click",
      () => {

        runAdvancedSearch(
          true
        );

      }
    );

  }


  // ==========================================
  // ADVANCED SEARCH
  // ==========================================

  async function runAdvancedSearch(
    shouldTrack
  ) {

    const criteria =
      getCriteria();


    const hasSearchCriteria =
      criteria.keywords.length > 0 ||
      criteria.author ||
      criteria.journal ||
      criteria.field;


    if (!hasSearchCriteria) {

      showMessage(`
        <h2>🔬 Add some criteria first</h2>

        <p>
          Add at least one keyword, author,
          journal, or research field.
        </p>
      `);

      return;

    }


    showSearchingMessage(
      "🔎 Searching...",
      "Searching free research sources for papers matching your research profile."
    );


    try {

      const papers =
        await searchWithCriteria(
          criteria
        );


      // ======================================
      // IMPORTANT:
      // CREATE TRACKER EVEN IF ZERO RESULTS
      // ======================================

      if (shouldTrack) {

        saveAdvancedTracker(
          criteria,
          papers
        );

        displayTrackedTopics();

      }


      // ======================================
      // ZERO RESULTS
      // ======================================

      if (!papers.length) {

        if (shouldTrack) {

          showMessage(`

            <h2>
              🔔 Research tracking created
            </h2>

            <p>
              Your tracking profile was saved
              successfully.
            </p>

            <p>
              There are currently no papers
              matching your criteria.
            </p>

            <p>
              You can open the tracker later
              to check again.
            </p>

          `);

        } else {

          showMessage(`

            <h2>
              🔎 No matching papers
            </h2>

            <p>
              No papers currently match your
              research criteria at
              <strong>${criteria.accuracy}%</strong>
              relevance.
            </p>

            <p>
              Try lowering the relevance threshold
              or broadening your criteria.
            </p>

          `);

        }

        return;

      }


      displayResults(
        papers,
        "🎯 Matching research"
      );


    } catch (error) {

      console.error(
        "Advanced search error:",
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


    // ----------------------------------------
    // FREE SOURCES
    // ----------------------------------------

    let papers =
      await searchFreeSources(
        query
      );


    // ----------------------------------------
    // HARD FILTERS
    // ----------------------------------------

    papers =
      papers.filter(
        paper =>
          matchesAdvancedCriteria(
            paper,
            criteria
          )
      );


    // ----------------------------------------
    // RELEVANCE SCORE
    // ----------------------------------------

    papers =
      papers.map(
        paper => ({

          ...paper,

          strackerScore:
            calculateScore(
              paper,
              criteria
            )

        })
      );


    // ----------------------------------------
    // 0–100 RELEVANCE THRESHOLD
    // ----------------------------------------

    papers =
      papers.filter(
        paper =>
          paper.strackerScore >=
          criteria.accuracy
      );


    // ----------------------------------------
    // NEWEST FIRST
    // ----------------------------------------
    //
    // Relevance is used to decide whether
    // a paper passes the threshold.
    //
    // It is NOT used to order results.
    //
    // Newest papers appear first.
    //

    sortPapersNewestFirst(
      papers
    );


    return papers;

  }


  // ==========================================
  // PAPER DATE
  // ==========================================

  function getPaperDate(
    paper
  ) {

    const rawDate =
      paper.publication_date ||
      paper.published ||
      paper.publicationDate ||
      paper.date ||
      "";


    const time =
      new Date(
        rawDate
      ).getTime();


    return Number.isFinite(time)
      ? time
      : 0;

  }


  function sortPapersNewestFirst(
    papers
  ) {

    return papers.sort(
      (a, b) =>
        getPaperDate(b) -
        getPaperDate(a)
    );

  }


  // ==========================================
  // FREE RESEARCH SOURCES
  // ==========================================

  async function searchFreeSources(
    query
  ) {

    /*
      Free sources:

      1. Europe PMC
      2. PubMed

      No OpenAlex request is used.

      Results are merged and deduplicated.
    */


    const resultsById =
      new Map();


    let europePapers = [];


    // ----------------------------------------
    // EUROPE PMC
    // ----------------------------------------

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


    // ----------------------------------------
    // PUBMED
    // ----------------------------------------

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
        .filter(
          isValidDate
        );


    /*
      IMPORTANT:

      Do NOT throw when zero results are found.

      Returning [] allows the tracker to be
      created even when there are currently
      no matching papers.
    */

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
      await fetch(
        url
      );


    if (!response.ok) {

      throw new Error(
        `Europe PMC request failed (${response.status}).`
      );

    }


    const data =
      await response.json();


    const sourceResults =
      Array.isArray(
        data?.resultList?.result
      )
        ? data.resultList.result
        : [];


    return sourceResults.map(
      mapEuropePMCRecord
    );

  }


  // ==========================================
  // MAP EUROPE PMC RECORD
  // ==========================================

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
      Array.isArray(
        record.authorList?.author
      )
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
            .join(", ")
        : "";


    let abstract =
      record.abstractText ||
      "";


    if (
      typeof abstract !== "string"
    ) {

      abstract =
        String(
          abstract || ""
        );

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
          : record.fullTextUrlList
              ?.fullTextUrl
              ?.[0]?.url ||
            "#";


    return {

      id,

      title:
        record.title ||
        "Untitled",

      publication_date:
        publicationDate,

      authorship:
        authors,

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
              .split(",")
              .map(
                name => ({

                  author: {

                    display_name:
                      name.trim()

                  }

                })
              )
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
      await fetch(
        searchUrl
      );


    if (!searchResponse.ok) {

      throw new Error(
        `PubMed search failed (${searchResponse.status}).`
      );

    }


    const searchData =
      await searchResponse.json();


    const ids =
      searchData?.esearchresult?.idlist ||
      [];


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
      await fetch(
        summaryUrl
      );


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


  // ==========================================
  // MAP PUBMED RECORD
  // ==========================================

  function mapPubMedRecord(
    record,
    pmid
  ) {

    const authors =
      Array.isArray(
        record.authors
      )
        ? record.authors
            .map(
              author =>
                author.name ||
                ""
            )
            .filter(Boolean)
            .join(", ")
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
          doiObject.value ||
          "";

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
              .split(",")
              .map(
                name => ({

                  author: {

                    display_name:
                      name.trim()

                  }

                })
              )
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

      pmid

    };

  }


  // ==========================================
  // NORMALIZE PUBMED DATE
  // ==========================================

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
            Number(
              match[3]
            )
          ).padStart(
            2,
            "0"
          )
        : "01";


    return `${year}-${month}-${day}`;

  }


  // ==========================================
  // NORMALIZE DOCUMENT TYPE
  // ==========================================

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
  // PAPER DEDUPLICATION
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


  // ==========================================
  // MERGE PAPER RECORDS
  // ==========================================

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

  function isValidDate(
    paper
  ) {

    if (
      !paper.publication_date
    ) {

      return false;

    }


    const date =
      new Date(
        paper.publication_date
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

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

    const safeCriteria =
      criteria || {};


    // ----------------------------------------
    // USE THE ACTUAL PAPER DATA STRUCTURE
    // ----------------------------------------

    const title =
      String(
        paper.title ||
        ""
      );


    const abstract =
      getAbstract(
        paper
      );


    const authors =
      getAuthors(
        paper
      );


    const journal =
      getJournal(
        paper
      );


    const concepts =
      getConcepts(
        paper
      );


    const allText = [

      title,

      abstract,

      authors,

      journal,

      concepts

    ]
      .join(" ")
      .toLowerCase();


    // ----------------------------------------
    // EXCLUDED KEYWORDS
    // ----------------------------------------

    const excluded =
      Array.isArray(
        safeCriteria.excluded
      )
        ? safeCriteria.excluded
        : [];


    for (
      const keyword of excluded
    ) {

      const term =
        String(
          keyword || ""
        )
          .trim()
          .toLowerCase();


      if (!term) {

        continue;

      }


      if (
        allText.includes(term)
      ) {

        return false;

      }

    }


    // ----------------------------------------
    // REQUIRED KEYWORDS
    // ----------------------------------------

    const keywords =
      Array.isArray(
        safeCriteria.keywords
      )
        ? safeCriteria.keywords
            .map(
              keyword =>
                String(
                  keyword || ""
                )
                  .trim()
                  .toLowerCase()
            )
            .filter(Boolean)
        : [];


    // ----------------------------------------
    // SELECTED KEYWORD FIELDS
    // ----------------------------------------

    const selectedFields =
      Array.isArray(
        safeCriteria.keywordFields
      )
        ? safeCriteria.keywordFields
        : [];


    let searchableText = "";


    if (
      selectedFields.length > 0
    ) {

      const fieldTexts = [];


      if (
        selectedFields.includes(
          "title"
        )
      ) {

        fieldTexts.push(
          title
        );

      }


      if (
        selectedFields.includes(
          "abstract"
        )
      ) {

        fieldTexts.push(
          abstract
        );

      }


      if (
        selectedFields.includes(
          "authors"
        )
      ) {

        fieldTexts.push(
          authors
        );

      }


      if (
        selectedFields.includes(
          "journal"
        )
      ) {

        fieldTexts.push(
          journal
        );

      }


      if (
        selectedFields.includes(
          "concepts"
        )
      ) {

        fieldTexts.push(
          concepts
        );

      }


      searchableText =
        fieldTexts
          .join(" ")
          .toLowerCase();

    } else {

      // No field selected:
      // search the complete metadata.

      searchableText =
        allText;

    }


    // ----------------------------------------
    // KEYWORD MATCH MODE
    // ----------------------------------------

    if (
      keywords.length > 0
    ) {

      const keywordMode =
        safeCriteria.keywordMode === "any"
          ? "any"
          : "all";


      if (
        keywordMode === "any"
      ) {

        const anyMatch =
          keywords.some(
            keyword =>
              searchableText.includes(
                keyword
              )
          );


        if (!anyMatch) {

          return false;

        }

      } else {

        const allMatch =
          keywords.every(
            keyword =>
              searchableText.includes(
                keyword
              )
          );


        if (!allMatch) {

          return false;

        }

      }

    }


    // ----------------------------------------
    // AUTHOR FILTER
    // ----------------------------------------

    const authorFilter =
      String(
        safeCriteria.author ||
        ""
      )
        .trim()
        .toLowerCase();


    if (
      authorFilter &&
      !authors
        .toLowerCase()
        .includes(
          authorFilter
        )
    ) {

      return false;

    }


    // ----------------------------------------
    // JOURNAL FILTER
    // ----------------------------------------

    const journalFilter =
      String(
        safeCriteria.journal ||
        ""
      )
        .trim()
        .toLowerCase();


    if (
      journalFilter &&
      !journal
        .toLowerCase()
        .includes(
          journalFilter
        )
    ) {

      return false;

    }


    // ----------------------------------------
    // FIELD FILTER
    // ----------------------------------------
    //
    // Free sources don't provide the same
    // structured field/concept data that
    // OpenAlex provided.
    //
    // Therefore we use searchable metadata
    // rather than secretly rejecting every
    // paper that lacks a "field" property.
    //

    const fieldFilter =
      String(
        safeCriteria.field ||
        ""
      )
        .trim()
        .toLowerCase();


    if (
      fieldFilter
    ) {

      if (
        !allText.includes(
          fieldFilter
        )
      ) {

        return false;

      }

    }


    // ----------------------------------------
    // DATE FILTER
    // ----------------------------------------

    const dateRange =
      String(
        safeCriteria.dateRange ||
        "all"
      );


    if (
      dateRange !== "all"
    ) {

      const days =
        Number(
          dateRange
        );


      if (
        Number.isFinite(days) &&
        days > 0
      ) {

        const publicationDate =
          new Date(
            paper.publication_date ||
            paper.published ||
            paper.publicationDate ||
            paper.date ||
            ""
          );


        if (
          !Number.isNaN(
            publicationDate.getTime()
          )
        ) {

          const cutoff =
            new Date();


          cutoff.setDate(
            cutoff.getDate() -
            days
          );


          if (
            publicationDate <
            cutoff
          ) {

            return false;

          }

        }

      }

    }


    // ----------------------------------------
    // DOCUMENT TYPE
    // ----------------------------------------

    const documentType =
      String(
        safeCriteria.documentType ||
        ""
      )
        .trim()
        .toLowerCase();


    if (
      documentType
    ) {

      const paperType =
        String(
          paper.type ||
          paper.documentType ||
          paper.publicationType ||
          ""
        )
          .toLowerCase();


      if (
        !paperType.includes(
          documentType
        )
      ) {

        return false;

      }

    }


    // ----------------------------------------
    // PASSED ALL HARD FILTERS
    // ----------------------------------------

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
      String(
        paper.title ||
        ""
      ).toLowerCase();


    const abstract =
      getAbstract(
        paper
      ).toLowerCase();


    const concepts =
      getConcepts(
        paper
      ).toLowerCase();


    const authors =
      getAuthors(
        paper
      ).toLowerCase();


    const journal =
      getJournal(
        paper
      ).toLowerCase();


    // ========================================
    // KEYWORD RELEVANCE
    // ========================================

    const keywords =
      Array.isArray(
        criteria.keywords
      )
        ? criteria.keywords
        : [];


    if (
      keywords.length > 0
    ) {

      let keywordScore = 0;


      for (
        const keyword of keywords
      ) {

        const k =
          String(
            keyword || ""
          )
            .toLowerCase()
            .trim();


        if (!k) {

          continue;

        }


        // Title = strongest
        if (
          title.includes(k)
        ) {

          keywordScore += 40;

        }

        // Abstract = strong
        else if (
          abstract.includes(k)
        ) {

          keywordScore += 30;

        }

        // Concepts = weaker
        else if (
          concepts.includes(k)
        ) {

          keywordScore += 20;

        }

        // Author/journal can also contribute
        else if (
          authors.includes(k)
        ) {

          keywordScore += 10;

        }

        else if (
          journal.includes(k)
        ) {

          keywordScore += 10;

        }

      }


      const maxKeywordScore =
        keywords.length * 40;


      if (
        maxKeywordScore > 0
      ) {

        score +=
          (
            keywordScore /
            maxKeywordScore
          ) * 60;

      }

    }


    // ========================================
    // AUTHOR
    // ========================================

    if (
      criteria.author
    ) {

      if (
        authors.includes(
          criteria.author
            .toLowerCase()
        )
      ) {

        score += 15;

      }

    }


    // ========================================
    // JOURNAL
    // ========================================

    if (
      criteria.journal
    ) {

      if (
        journal.includes(
          criteria.journal
            .toLowerCase()
        )
      ) {

        score += 15;

      }

    }


    // ========================================
    // FIELD
    // ========================================

    if (
      criteria.field
    ) {

      const field =
        criteria.field
          .toLowerCase();


      if (
        title.includes(
          field
        )
      ) {

        score += 15;

      }

      else if (
        abstract.includes(
          field
        )
      ) {

        score += 10;

      }

      else if (
        concepts.includes(
          field
        )
      ) {

        score += 5;

      }

    }


    // ========================================
    // RECENCY
    // ========================================

    const publication =
      new Date(
        paper.publication_date ||
        ""
      );


    const now =
      new Date();


    const publicationTime =
      publication.getTime();


    if (
      Number.isFinite(
        publicationTime
      )
    ) {

      const days =
        Math.floor(
          (
            now -
            publication
          ) /
          86400000
        );


      if (
        days >= 0 &&
        days <= 30
      ) {

        score += 10;

      }

      else if (
        days <= 90
      ) {

        score += 7;

      }

      else if (
        days <= 365
      ) {

        score += 4;

      }

    }


    return Math.min(
      100,
      Math.max(
        0,
        Math.round(
          score
        )
      )
    );

  }


  // ==========================================
  // ABSTRACT
  // ==========================================

  function getAbstract(
    paper
  ) {

    // Europe PMC / free sources
    if (
      typeof paper.abstract_text ===
      "string" &&
      paper.abstract_text.trim()
    ) {

      return paper.abstract_text;

    }


    // Compatibility with old records
    if (
      typeof paper.abstract ===
      "string"
    ) {

      return paper.abstract;

    }


    // Compatibility with old inverted index
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


      if (
        !Array.isArray(
          positions
        )
      ) {

        continue;

      }


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

  function getAuthors(
    paper
  ) {

    if (
      typeof paper.authorship ===
      "string" &&
      paper.authorship.trim()
    ) {

      return paper.authorship;

    }


    if (
      typeof paper.authors ===
      "string"
    ) {

      return paper.authors;

    }


    if (
      Array.isArray(
        paper.authors
      )
    ) {

      return paper.authors.join(
        " "
      );

    }


    return (
      paper.authorships ||
      []
    )
      .map(
        author =>
          author.author?.display_name ||
          ""
      )
      .filter(Boolean)
      .join(" ");

  }


  // ==========================================
  // JOURNAL
  // ==========================================

  function getJournal(
    paper
  ) {

    return (
      paper.journal_name ||
      paper.journal ||
      paper.primary_location
        ?.source
        ?.display_name ||
      ""
    );

  }


  // ==========================================
  // CONCEPTS
  // ==========================================

  function getConcepts(
    paper
  ) {

    if (
      typeof paper.concepts_text ===
      "string"
    ) {

      return paper.concepts_text;

    }


    if (
      typeof paper.concepts ===
      "string"
    ) {

      return paper.concepts;

    }


    return (
      paper.concepts ||
      []
    )
      .map(
        concept => {

          if (
            typeof concept ===
            "string"
          ) {

            return concept;

          }


          return (
            concept?.display_name ||
            ""
          );

        }
      )
      .filter(Boolean)
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
      Array.isArray(
        papers
      )
        ? papers
        : [];


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
          createPaperCard(
            paper
          )
        );

      }
    );


    if (counter) {

      counter.textContent =
        `Showing ${visible.length} of ${currentResults.length} papers`;

    }


    if (loadMoreArea) {

      loadMoreArea.innerHTML =
        "";

    }


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


      if (loadMoreArea) {

        loadMoreArea.appendChild(
          button
        );

      }

    }

  }


  // ==========================================
  // PAPER CARD
  // ==========================================

  function createPaperCard(
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
      getAuthors(
        paper
      ) ||
      "Unknown authors";


    const journal =
      getJournal(
        paper
      ) ||
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
        ${escapeHtml(
          title
        )}
      </h2>

      <p>
        <strong>Authors:</strong>
        ${escapeHtml(
          authors
        )}
      </p>

      <p>
        <strong>Journal:</strong>
        ${escapeHtml(
          journal
        )}
      </p>

      <a
        href="${escapeAttribute(
          link
        )}"
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

        keywordFields:
          Array.isArray(
            criteria.keywordFields
          )
            ? [
                ...criteria.keywordFields
              ]
            : [],

        keywordMode:
          criteria.keywordMode ===
          "any"
            ? "any"
            : "all",

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
        Array.isArray(
          papers
        )
          ? papers
              .map(
                paper =>
                  paper.id
              )
          : [],

      lastCheckNewPapers:
        Array.isArray(
          papers
        )
          ? papers.length
          : 0,

      totalNewPapers:
        Array.isArray(
          papers
        )
          ? papers.length
          : 0

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
        JSON.parse(
          saved
        );


      return Array.isArray(
        parsed
      )
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

    if (!trackedTopics) {

      return;

    }


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
          (
            tracker,
            index
          ) => {

            const criteria =
              tracker.criteria ||
              {};


            const keywords =
              Array.isArray(
                criteria.keywords
              )
                ? criteria.keywords
                    .map(
                      keyword =>
                        `<span class="badge">
                          ${escapeHtml(
                            keyword
                          )}
                        </span>`
                    )
                    .join("")
                : "";


            const excluded =
              Array.isArray(
                criteria.excluded
              )
                ? criteria.excluded
                    .map(
                      keyword =>
                        `<span class="badge">
                          ${escapeHtml(
                            keyword
                          )}
                        </span>`
                    )
                    .join("")
                : "";


            const keywordFields =
              Array.isArray(
                criteria.keywordFields
              )
                ? criteria.keywordFields
                    .map(
                      field =>
                        `<span class="badge">
                          ${escapeHtml(
                            field
                          )}
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
                  🔬 Research profile
                  ${index + 1}
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
                  keywordFields
                    ? `
                      <p>
                        <strong>
                          Search fields:
                        </strong>

                        ${keywordFields}
                      </p>
                    `
                    : ""
                }


                ${
                  criteria.keywordMode
                    ? `
                      <p>
                        <strong>
                          Keyword mode:
                        </strong>

                        ${
                          criteria.keywordMode ===
                          "any"
                            ? "Any"
                            : "All"
                        }
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


                ${
                  criteria.dateRange &&
                  criteria.dateRange !== "all"
                    ? `
                      <p>
                        📅
                        <strong>
                          Date range:
                        </strong>

                        Last
                        ${escapeHtml(
                          criteria.dateRange
                        )}
                        days
                      </p>
                    `
                    : ""
                }


                ${
                  criteria.documentType
                    ? `
                      <p>
                        📄
                        <strong>
                          Type:
                        </strong>

                        ${escapeHtml(
                          criteria.documentType
                        )}
                      </p>
                    `
                    : ""
                }


                <p>
                  🎯
                  <strong>
                    Relevance threshold:
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
      .forEach(
        button => {

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

                  <h2>
                    ❌ Tracker not found
                  </h2>

                  <p>
                    This tracking profile
                    no longer exists.
                  </p>

                `);

                return;

              }


              runSavedTracker(
                tracker.criteria ||
                {}
              );

            }
          );

        }
      );


    // ========================================
    // DELETE BUTTONS
    // ========================================

    document
      .querySelectorAll(
        ".delete-tracker-button"
      )
      .forEach(
        button => {

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

        }
      );

  }


  // ==========================================
  // VIEW SAVED TRACKER
  // ==========================================

  async function runSavedTracker(
    criteria
  ) {

    // ----------------------------------------
    // NORMALIZE SAVED CRITERIA
    // ----------------------------------------

    const safeCriteria = {

      keywords:
        Array.isArray(
          criteria?.keywords
        )
          ? criteria.keywords
              .map(
                keyword =>
                  String(
                    keyword
                  ).trim()
              )
              .filter(Boolean)
          : [],

      excluded:
        Array.isArray(
          criteria?.excluded
        )
          ? criteria.excluded
              .map(
                keyword =>
                  String(
                    keyword
                  ).trim()
              )
              .filter(Boolean)
          : [],

      keywordFields:
        Array.isArray(
          criteria?.keywordFields
        )
          ? criteria.keywordFields
              .filter(
                field =>
                  [
                    "title",
                    "abstract",
                    "authors",
                    "journal",
                    "concepts"
                  ].includes(
                    field
                  )
              )
          : [],

      keywordMode:
        criteria?.keywordMode ===
        "any"
          ? "any"
          : "all",

      author:
        typeof criteria?.author ===
        "string"
          ? criteria.author.trim()
          : "",

      journal:
        typeof criteria?.journal ===
        "string"
          ? criteria.journal.trim()
          : "",

      field:
        typeof criteria?.field ===
        "string"
          ? criteria.field.trim()
          : "",

      dateRange:
        criteria?.dateRange !==
          undefined &&
        criteria?.dateRange !==
          null &&
        criteria?.dateRange !==
          ""
          ? String(
              criteria.dateRange
            )
          : "all",

      documentType:
        typeof criteria?.documentType ===
        "string"
          ? criteria.documentType.trim()
          : "",

      accuracy:
        Number.isFinite(
          Number(
            criteria?.accuracy
          )
        )
          ? Math.max(
              0,
              Math.min(
                100,
                Number(
                  criteria.accuracy
                )
              )
            )
          : 0

    };


    // ----------------------------------------
    // VALIDATE CRITERIA
    // ----------------------------------------

    const hasCriteria =
      safeCriteria.keywords.length >
        0 ||
      safeCriteria.author ||
      safeCriteria.journal ||
      safeCriteria.field;


    if (!hasCriteria) {

      showMessage(`

        <h2>
          ⚠️ Invalid tracking profile
        </h2>

        <p>
          This saved tracking profile does
          not contain any searchable criteria.
        </p>

        <p>
          Delete this profile and create
          a new one.
        </p>

      `);

      return;

    }


    showSearchingMessage(
      "🔎 Checking tracked research...",
      "Looking for papers matching your saved criteria."
    );


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
            The tracker still exists and
            can be checked again later.
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
  // SEARCHING MESSAGE
  // ==========================================

  function showSearchingMessage(
    heading,
    message
  ) {

    showMessage(`

      <h2>
        ${heading}
      </h2>

      <p>
        ${message}
      </p>

    `);

  }


  // ==========================================
  // MESSAGE
  // ==========================================

  function showMessage(
    html
  ) {

    if (!results) {

      return;

    }


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
      ).padStart(
        2,
        "0"
      ) +
      "-" +
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      )
    );

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
      String(
        text
      );


    return div.innerHTML;

  }


  // ==========================================
  // ESCAPE ATTRIBUTE
  // ==========================================

  function escapeAttribute(
    text
  ) {

    return String(
      text
    )
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
