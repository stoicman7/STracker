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
  // TRACKER UI STATE
  // ==========================================

  let trackerActionInProgress = false;


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
      event => {

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
        await searchFreeSources(query);


      sortPapersNewestFirst(papers);


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


        if (!checkboxes.length) {

          return;

        }


        const allChecked =
          Array.from(checkboxes)
            .every(
              checkbox =>
                checkbox.checked
            );


        checkboxes.forEach(
          checkbox => {

            checkbox.checked =
              !allChecked;

          }
        );


        selectAllKeywordFields.textContent =
          allChecked
            ? "Select all"
            : "Deselect all";

      }
    );

  }


  // ==========================================
  // CREATE INPUT ROW
  // ==========================================

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


    const keywordModeInput =
      document.querySelector(
        'input[name="keywordMode"]:checked'
      );


    const keywordMode =
      keywordModeInput
        ? keywordModeInput.value
        : "all";


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
              Math.min(100, accuracy)
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

        runAdvancedSearch(false);

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

        runAdvancedSearch(true);

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
        await searchWithCriteria(criteria);


      // ======================================
      // REAL TRACKING
      // ======================================

      if (shouldTrack) {

        const trackingResult =
          createOrUpdateTracker(
            criteria,
            papers
          );


        displayTrackedTopics();


        const markedPapers =
          markTrackerPapers(
            papers,
            trackingResult.newPapers
          );


        if (!papers.length) {

          showMessage(`

            <h2>
              🔔 Research tracking saved
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
              You can check the tracker again later.
            </p>

            <p>
              📚
              <strong>
                Papers tracked:
              </strong>
              ${getSeenCount(trackingResult.tracker)}
            </p>

            <p>
              📅
              <strong>
                Last checked:
              </strong>
              ${escapeHtml(
                trackingResult.tracker.lastChecked ||
                "Never"
              )}
            </p>

          `);

          return;

        }


        displayResults(
          markedPapers,
          trackingResult.isNewTracker
            ? "🎯 Research tracking started"
            : `🎯 Tracker updated — ${trackingResult.newPapers.length} new`
        );


        updateTrackerCounter(
          trackingResult.newPapers.length,
          markedPapers.length
        );


        return;

      }


      // ======================================
      // PREVIEW ONLY
      // ======================================

      if (!papers.length) {

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

        <h2>
          ❌ Search failed
        </h2>

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

  async function searchWithCriteria(criteria) {

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


    let papers =
      await searchFreeSources(query);


    papers =
      papers.filter(
        paper =>
          matchesAdvancedCriteria(
            paper,
            criteria
          )
      );


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


    papers =
      papers.filter(
        paper =>
          paper.strackerScore >=
          criteria.accuracy
      );


    sortPapersNewestFirst(papers);


    return papers;

  }


  // ==========================================
  // PAPER DATE
  // ==========================================

  function getPaperDate(paper) {

    const rawDate =
      paper.publication_date ||
      paper.published ||
      paper.publicationDate ||
      paper.date ||
      "";


    const time =
      new Date(rawDate).getTime();


    return Number.isFinite(time)
      ? time
      : 0;

  }


  function sortPapersNewestFirst(papers) {

    return papers.sort(
      (a, b) =>
        getPaperDate(b) -
        getPaperDate(a)
    );

  }


  // ==========================================
  // FREE RESEARCH SOURCES
  // ==========================================

  async function searchFreeSources(query) {

    const resultsById =
      new Map();


    // ----------------------------------------
    // EUROPE PMC
    // ----------------------------------------

    try {

      const europePapers =
        await searchEuropePMC(query);


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
        await searchPubMed(query);


      pubmedPapers.forEach(
        paper => {

          const key =
            getPaperDeduplicationKey(
              paper
            );


          if (!resultsById.has(key)) {

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


    return Array.from(
      resultsById.values()
    )
      .filter(isValidDate);

  }


  // ==========================================
  // EUROPE PMC
  // ==========================================

  async function searchEuropePMC(query) {

    const params =
      new URLSearchParams();


    params.set("query", query);

    params.set("format", "json");

    params.set("resultType", "core");

    params.set("pageSize", "100");


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

  function mapEuropePMCRecord(record) {

    const pmid =
      record.pmid || "";


    const doi =
      record.doi || "";


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
      record.abstractText || "";


    if (
      typeof abstract !== "string"
    ) {

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

      concepts: [],

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

  async function searchPubMed(query) {

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


  // ==========================================
  // MAP PUBMED RECORD
  // ==========================================

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
            .join(", ")
        : "";


    let doi = "";


    if (
      Array.isArray(record.articleids)
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

      concepts: [],

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

  function normalizePubMedDate(value) {

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


    return `${year}-${month}-${day}`;

  }


  // ==========================================
  // NORMALIZE DOCUMENT TYPE
  // ==========================================

  function normalizeDocumentType(types) {

    if (!Array.isArray(types)) {

      return "article";

    }


    const text =
      types
        .join(" ")
        .toLowerCase();


    if (text.includes("review")) {

      return "review";

    }


    if (text.includes("dataset")) {

      return "dataset";

    }


    if (text.includes("preprint")) {

      return "preprint";

    }


    return "article";

  }


  // ==========================================
  // PAPER DEDUPLICATION
  // ==========================================

  function getPaperDeduplicationKey(paper) {

    if (paper.pmid) {

      return (
        `pmid:${String(
          paper.pmid
        ).toLowerCase()}`
      );

    }


    if (paper.doi) {

      return (
        `doi:${String(paper.doi)
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

  function isValidDate(paper) {

    if (!paper.publication_date) {

      return false;

    }


    const date =
      new Date(
        paper.publication_date
      );


    if (Number.isNaN(date.getTime())) {

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


    const title =
      String(
        paper.title || ""
      );


    const abstract =
      getAbstract(paper);


    const authors =
      getAuthors(paper);


    const journal =
      getJournal(paper);


    const concepts =
      getConcepts(paper);


    const allText = [

      title,
      abstract,
      authors,
      journal,
      concepts

    ]
      .join(" ")
      .toLowerCase();


    const excluded =
      Array.isArray(
        safeCriteria.excluded
      )
        ? safeCriteria.excluded
        : [];


    for (const keyword of excluded) {

      const term =
        String(keyword || "")
          .trim()
          .toLowerCase();


      if (!term) {

        continue;

      }


      if (allText.includes(term)) {

        return false;

      }

    }


    const keywords =
      Array.isArray(
        safeCriteria.keywords
      )
        ? safeCriteria.keywords
            .map(
              keyword =>
                String(keyword || "")
                  .trim()
                  .toLowerCase()
            )
            .filter(Boolean)
        : [];


    const selectedFields =
      Array.isArray(
        safeCriteria.keywordFields
      )
        ? safeCriteria.keywordFields
        : [];


    let searchableText = "";


    if (selectedFields.length > 0) {

      const fieldTexts = [];


      if (
        selectedFields.includes("title")
      ) {

        fieldTexts.push(title);

      }


      if (
        selectedFields.includes("abstract")
      ) {

        fieldTexts.push(abstract);

      }


      if (
        selectedFields.includes("authors")
      ) {

        fieldTexts.push(authors);

      }


      if (
        selectedFields.includes("journal")
      ) {

        fieldTexts.push(journal);

      }


      if (
        selectedFields.includes("concepts")
      ) {

        fieldTexts.push(concepts);

      }


      searchableText =
        fieldTexts
          .join(" ")
          .toLowerCase();

    } else {

      searchableText =
        allText;

    }


    if (keywords.length > 0) {

      const keywordMode =
        safeCriteria.keywordMode === "any"
          ? "any"
          : "all";


      if (keywordMode === "any") {

        const anyMatch =
          keywords.some(
            keyword =>
              searchableText.includes(keyword)
          );


        if (!anyMatch) {

          return false;

        }

      } else {

        const allMatch =
          keywords.every(
            keyword =>
              searchableText.includes(keyword)
          );


        if (!allMatch) {

          return false;

        }

      }

    }


    const authorFilter =
      String(
        safeCriteria.author || ""
      )
        .trim()
        .toLowerCase();


    if (
      authorFilter &&
      !authors
        .toLowerCase()
        .includes(authorFilter)
    ) {

      return false;

    }


    const journalFilter =
      String(
        safeCriteria.journal || ""
      )
        .trim()
        .toLowerCase();


    if (
      journalFilter &&
      !journal
        .toLowerCase()
        .includes(journalFilter)
    ) {

      return false;

    }


    const fieldFilter =
      String(
        safeCriteria.field || ""
      )
        .trim()
        .toLowerCase();


    if (
      fieldFilter &&
      !allText.includes(fieldFilter)
    ) {

      return false;

    }


    const dateRange =
      String(
        safeCriteria.dateRange || "all"
      );


    if (dateRange !== "all") {

      const days =
        Number(dateRange);


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
            cutoff.getDate() - days
          );


          if (
            publicationDate < cutoff
          ) {

            return false;

          }

        }

      }

    }


    const documentType =
      String(
        safeCriteria.documentType || ""
      )
        .trim()
        .toLowerCase();


    if (documentType) {

      const paperType =
        String(
          paper.type ||
          paper.documentType ||
          paper.publicationType ||
          ""
        )
          .toLowerCase();


      if (
        !paperType.includes(documentType)
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
      String(
        paper.title || ""
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


    const keywords =
      Array.isArray(
        criteria.keywords
      )
        ? criteria.keywords
        : [];


    if (keywords.length > 0) {

      let keywordScore = 0;


      for (const keyword of keywords) {

        const k =
          String(keyword || "")
            .toLowerCase()
            .trim();


        if (!k) {

          continue;

        }


        if (title.includes(k)) {

          keywordScore += 40;

        } else if (
          abstract.includes(k)
        ) {

          keywordScore += 30;

        } else if (
          concepts.includes(k)
        ) {

          keywordScore += 20;

        } else if (
          authors.includes(k)
        ) {

          keywordScore += 10;

        } else if (
          journal.includes(k)
        ) {

          keywordScore += 10;

        }

      }


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


    if (criteria.author) {

      if (
        authors.includes(
          criteria.author.toLowerCase()
        )
      ) {

        score += 15;

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


      if (title.includes(field)) {

        score += 15;

      } else if (
        abstract.includes(field)
      ) {

        score += 10;

      } else if (
        concepts.includes(field)
      ) {

        score += 5;

      }

    }


    const publication =
      new Date(
        paper.publication_date || ""
      );


    const now =
      new Date();


    const publicationTime =
      publication.getTime();


    if (
      Number.isFinite(publicationTime)
    ) {

      const days =
        Math.floor(
          (
            now -
            publication
          ) / 86400000
        );


      if (
        days >= 0 &&
        days <= 30
      ) {

        score += 10;

      } else if (
        days <= 90
      ) {

        score += 7;

      } else if (
        days <= 365
      ) {

        score += 4;

      }

    }


    return Math.min(
      100,
      Math.max(
        0,
        Math.round(score)
      )
    );

  }


  // ==========================================
  // ABSTRACT
  // ==========================================

  function getAbstract(paper) {

    if (
      typeof paper.abstract_text === "string" &&
      paper.abstract_text.trim()
    ) {

      return paper.abstract_text;

    }


    if (
      typeof paper.abstract === "string"
    ) {

      return paper.abstract;

    }


    const index =
      paper.abstract_inverted_index;


    if (!index) {

      return "";

    }


    const words = [];


    for (const word in index) {

      const positions =
        index[word];


      if (!Array.isArray(positions)) {

        continue;

      }


      for (const position of positions) {

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


    if (
      typeof paper.authors === "string"
    ) {

      return paper.authors;

    }


    if (
      Array.isArray(paper.authors)
    ) {

      return paper.authors.join(" ");

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

  function getJournal(paper) {

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

  function getConcepts(paper) {

    if (
      typeof paper.concepts_text === "string"
    ) {

      return paper.concepts_text;

    }


    if (
      typeof paper.concepts === "string"
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
            typeof concept === "string"
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
      Array.isArray(papers)
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


    if (counter) {

      counter.textContent =
        `Showing ${visible.length} of ${currentResults.length} papers`;

    }


    if (loadMoreArea) {

      loadMoreArea.innerHTML = "";

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
  // UPDATE TRACKER COUNTER
  // ==========================================

  function updateTrackerCounter(
    newCount,
    totalCount
  ) {

    const counter =
      document.getElementById(
        "resultCounter"
      );


    if (!counter) {

      return;

    }


    counter.innerHTML = `

      Showing
      ${Math.min(
        10,
        totalCount
      )}
      of
      ${totalCount}
      papers

      &nbsp;•&nbsp;

      🔔
      <strong>
        ${newCount}
      </strong>
      new papers

    `;

  }


  // ==========================================
  // PAPER CARD
  // ==========================================

  function createPaperCard(paper) {

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


    let badges = "";


    if (paper.isNewToTracker) {

      badges += `

        <span
          class="badge"
          style="
            background:#dcfce7;
            color:#166534;
          "
        >
          🆕 New
        </span>

      `;

    } else if (
      paper.isPreviouslySeenByTracker
    ) {

      badges += `

        <span
          class="badge"
          style="
            background:#e5e7eb;
            color:#374151;
          "
        >
          📚 Previously seen
        </span>

      `;

    }


    if (score !== undefined) {

      badges += `

        <span class="badge">
          Relevance: ${score}%
        </span>

      `;

    }


    badges += `

      <span class="badge">
        ${escapeHtml(
          paper.publication_date ||
          "Unknown date"
        )}
      </span>

    `;


    card.innerHTML = `

      ${badges}

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
  // CREATE OR UPDATE TRACKER
  // ==========================================

  function createOrUpdateTracker(
    criteria,
    papers
  ) {

    let trackers =
      getAdvancedTrackers();


    const normalizedCriteria =
      cloneCriteria(criteria);


    const profileKey =
      createTrackerProfileKey(
        normalizedCriteria
      );


    const matchingIndexes = [];


    trackers.forEach(
      (tracker, index) => {

        if (
          getTrackerProfileKey(tracker) ===
          profileKey
        ) {

          matchingIndexes.push(index);

        }

      }
    );


    if (!matchingIndexes.length) {

      const paperIds =
        Array.isArray(papers)
          ? papers
              .map(
                paper =>
                  getStablePaperId(paper)
              )
              .filter(Boolean)
          : [];


      const tracker = {

        id:
          createStableTrackerId(
            profileKey
          ),

        profileKey,

        criteria:
          normalizedCriteria,

        createdAt:
          getToday(),

        lastChecked:
          getToday(),

        seenPaperIds:
          Array.from(
            new Set(paperIds)
          ),

        lastCheckNewPapers:
          0,

        totalNewPapers:
          0

      };


      trackers.push(tracker);


      saveAdvancedTrackers(
        trackers
      );


      return {

        tracker,

        newPapers: [],

        previouslySeenPapers:
          Array.isArray(papers)
            ? papers
            : [],

        isNewTracker: true

      };

    }


    const primaryIndex =
      matchingIndexes[0];


    const tracker =
      normalizeTracker(
        trackers[primaryIndex],
        normalizedCriteria,
        profileKey
      );


    if (matchingIndexes.length > 1) {

      const allSeenIds = new Set(
        tracker.seenPaperIds
      );


      let totalNew =
        Number(
          tracker.totalNewPapers || 0
        );


      let lastNew =
        Number(
          tracker.lastCheckNewPapers || 0
        );


      for (
        let i = 1;
        i < matchingIndexes.length;
        i++
      ) {

        const duplicate =
          normalizeTracker(
            trackers[
              matchingIndexes[i]
            ],
            normalizedCriteria,
            profileKey
          );


        duplicate.seenPaperIds
          .forEach(
            id =>
              allSeenIds.add(id)
          );


        totalNew =
          Math.max(
            totalNew,
            Number(
              duplicate.totalNewPapers || 0
            )
          );


        lastNew =
          Math.max(
            lastNew,
            Number(
              duplicate.lastCheckNewPapers || 0
            )
          );

      }


      tracker.seenPaperIds =
        Array.from(allSeenIds);


      tracker.totalNewPapers =
        totalNew;


      tracker.lastCheckNewPapers =
        lastNew;


      trackers =
        trackers.filter(
          (item, index) =>
            !matchingIndexes
              .slice(1)
              .includes(index)
        );


      const newPrimaryIndex =
        trackers.findIndex(
          item =>
            String(item.id) ===
            String(tracker.id)
        );


      if (newPrimaryIndex !== -1) {

        trackers[newPrimaryIndex] =
          tracker;

      }

    }


    const actualIndex =
      trackers.findIndex(
        item =>
          String(item.id) ===
          String(tracker.id)
      );


    const check =
      updateTrackerAfterCheck(
        tracker,
        papers
      );


    if (actualIndex !== -1) {

      trackers[actualIndex] =
        tracker;

    } else {

      trackers.push(tracker);

    }


    saveAdvancedTrackers(
      trackers
    );


    return {

      tracker,

      newPapers:
        check.newPapers,

      previouslySeenPapers:
        check.previouslySeenPapers,

      isNewTracker: false

    };

  }


  // ==========================================
  // NORMALIZE TRACKER
  // ==========================================

  function normalizeTracker(
    tracker,
    criteria,
    profileKey
  ) {

    const safeTracker =
      tracker || {};


    const seen =
      Array.isArray(
        safeTracker.seenPaperIds
      )
        ? safeTracker.seenPaperIds
            .filter(Boolean)
        : [];


    return {

      ...safeTracker,

      id:
        safeTracker.id ||
        createStableTrackerId(
          profileKey
        ),

      profileKey,

      criteria:
        cloneCriteria(criteria),

      createdAt:
        safeTracker.createdAt ||
        getToday(),

      lastChecked:
        safeTracker.lastChecked ||
        "",

      seenPaperIds:
        Array.from(
          new Set(seen)
        ),

      lastCheckNewPapers:
        Number(
          safeTracker.lastCheckNewPapers || 0
        ),

      totalNewPapers:
        Number(
          safeTracker.totalNewPapers || 0
        )

    };

  }


  // ==========================================
  // LEGACY FUNCTION
  // ==========================================

  function createAdvancedTracker(
    criteria,
    papers
  ) {

    return createOrUpdateTracker(
      criteria,
      papers
    ).tracker;

  }


  // ==========================================
  // UPDATE EXISTING TRACKER AFTER CHECK
  // ==========================================

  function updateTrackerAfterCheck(
    tracker,
    papers
  ) {

    if (!tracker) {

      return {

        newPapers: [],

        previouslySeenPapers: [],

        allPapers: []

      };

    }


    const oldSeen =
      new Set(
        Array.isArray(
          tracker.seenPaperIds
        )
          ? tracker.seenPaperIds
          : []
      );


    const newPapers = [];

    const previouslySeenPapers = [];

    const allPapers =
      Array.isArray(papers)
        ? papers
        : [];


    const currentIds = [];


    allPapers.forEach(
      paper => {

        const id =
          getStablePaperId(paper);


        if (!id) {

          return;

        }


        currentIds.push(id);


        if (oldSeen.has(id)) {

          previouslySeenPapers.push(
            paper
          );

        } else {

          newPapers.push(
            paper
          );

        }

      }
    );


    tracker.seenPaperIds =
      Array.from(
        new Set(
          [
            ...oldSeen,
            ...currentIds
          ]
        )
      );


    tracker.lastChecked =
      getToday();


    tracker.lastCheckNewPapers =
      newPapers.length;


    tracker.totalNewPapers =
      Number(
        tracker.totalNewPapers || 0
      ) +
      newPapers.length;


    return {

      newPapers,

      previouslySeenPapers,

      allPapers

    };

  }


  // ==========================================
  // MARK TRACKER PAPERS
  // ==========================================

  function markTrackerPapers(
    papers,
    newPapers
  ) {

    const newIds =
      new Set(
        Array.isArray(newPapers)
          ? newPapers
              .map(
                paper =>
                  getStablePaperId(paper)
              )
              .filter(Boolean)
          : []
      );


    return (
      Array.isArray(papers)
        ? papers
        : []
    )
      .map(
        paper => {

          const id =
            getStablePaperId(
              paper
            );


          return {

            ...paper,

            isNewToTracker:
              newIds.has(id),

            isPreviouslySeenByTracker:
              !newIds.has(id)

          };

        }
      );

  }


  // ==========================================
  // STABLE PAPER ID
  // ==========================================

  function getStablePaperId(paper) {

    if (!paper) {

      return "";

    }


    if (paper.pmid) {

      return (
        `pmid:${String(
          paper.pmid
        )
          .trim()
          .toLowerCase()}`
      );

    }


    if (paper.doi) {

      return (
        `doi:${String(paper.doi)
          .replace(
            /^https?:\/\/doi\.org\//i,
            ""
          )
          .trim()
          .toLowerCase()}`
      );

    }


    if (paper.id) {

      return (
        `id:${String(
          paper.id
        )
          .trim()
          .toLowerCase()}`
      );

    }


    const title =
      String(
        paper.title || ""
      )
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          " "
        )
        .trim();


    if (!title) {

      return "";

    }


    return `title:${title}`;

  }


  // ==========================================
  // TRACKER PROFILE IDENTITY
  // ==========================================

  function createTrackerProfileKey(
    criteria
  ) {

    const normalized = {

      keywords:
        normalizeStringArray(
          criteria?.keywords
        ),

      excluded:
        normalizeStringArray(
          criteria?.excluded
        ),

      keywordFields:
        normalizeStringArray(
          criteria?.keywordFields
        ),

      keywordMode:
        criteria?.keywordMode === "any"
          ? "any"
          : "all",

      author:
        normalizeString(
          criteria?.author
        ),

      journal:
        normalizeString(
          criteria?.journal
        ),

      field:
        normalizeString(
          criteria?.field
        ),

      dateRange:
        String(
          criteria?.dateRange || "all"
        )
          .trim()
          .toLowerCase(),

      documentType:
        normalizeString(
          criteria?.documentType
        ),

      accuracy:
        Number(
          criteria?.accuracy || 0
        )

    };


    return JSON.stringify(
      normalized
    );

  }


  // ==========================================
  // STABLE TRACKER ID
  // ==========================================

  function createStableTrackerId(
    profileKey
  ) {

    let hash = 0;


    for (
      let i = 0;
      i < profileKey.length;
      i++
    ) {

      hash =
        (
          (
            hash << 5
          ) -
          hash +
          profileKey.charCodeAt(i)
        ) |
        0;

    }


    return (
      "tracker-" +
      Math.abs(hash).toString(36)
    );

  }


  // ==========================================
  // GET TRACKER PROFILE KEY
  // ==========================================

  function getTrackerProfileKey(
    tracker
  ) {

    if (
      tracker?.profileKey
    ) {

      return tracker.profileKey;

    }


    return createTrackerProfileKey(
      tracker?.criteria || {}
    );

  }


  // ==========================================
  // NORMALIZE STRING
  // ==========================================

  function normalizeString(value) {

    return String(
      value || ""
    )
      .trim()
      .toLowerCase();

  }


  // ==========================================
  // NORMALIZE STRING ARRAY
  // ==========================================

  function normalizeStringArray(
    value
  ) {

    return (
      Array.isArray(value)
        ? value
        : []
    )
      .map(
        item =>
          normalizeString(item)
      )
      .filter(Boolean)
      .sort();

  }


  // ==========================================
  // CLONE CRITERIA
  // ==========================================

  function cloneCriteria(criteria) {

    return {

      keywords:
        Array.isArray(
          criteria?.keywords
        )
          ? [
              ...criteria.keywords
            ]
          : [],

      excluded:
        Array.isArray(
          criteria?.excluded
        )
          ? [
              ...criteria.excluded
            ]
          : [],

      keywordFields:
        Array.isArray(
          criteria?.keywordFields
        )
          ? [
              ...criteria.keywordFields
            ]
          : [],

      keywordMode:
        criteria?.keywordMode === "any"
          ? "any"
          : "all",

      author:
        criteria?.author ||
        "",

      journal:
        criteria?.journal ||
        "",

      field:
        criteria?.field ||
        "",

      dateRange:
        criteria?.dateRange ||
        "all",

      documentType:
        criteria?.documentType ||
        "",

      accuracy:
        Number(
          criteria?.accuracy || 0
        )

    };

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


      if (!Array.isArray(parsed)) {

        return [];

      }


      return parsed;

    } catch (error) {

      console.error(
        "Could not load trackers:",
        error
      );


      return [];

    }

  }


  // ==========================================
  // SAVE TRACKERS
  // ==========================================

  function saveAdvancedTrackers(
    trackers
  ) {

    try {

      localStorage.setItem(
        "stracker_advanced",
        JSON.stringify(
          Array.isArray(trackers)
            ? trackers
            : []
        )
      );


      return true;

    } catch (error) {

      console.error(
        "Could not save trackers:",
        error
      );


      return false;

    }

  }


  // ==========================================
  // GET SEEN COUNT
  // ==========================================

  function getSeenCount(tracker) {

    return Array.isArray(
      tracker?.seenPaperIds
    )
      ? tracker.seenPaperIds.length
      : 0;

  }


  // ==========================================
  // TRACKER STATUS
  // ==========================================

  function getTrackerStatus(
    tracker
  ) {

    if (!tracker) {

      return {

        label: "Unknown",

        icon: "❔",

        className: "tracker-status-unknown"

      };

    }


    const lastChecked =
      tracker.lastChecked || "";


    const lastNew =
      Number(
        tracker.lastCheckNewPapers || 0
      );


    if (!lastChecked) {

      return {

        label: "Never checked",

        icon: "⏳",

        className: "tracker-status-never"

      };

    }


    if (lastNew > 0) {

      return {

        label:
          `${lastNew} new paper${lastNew === 1 ? "" : "s"}`,

        icon: "🆕",

        className: "tracker-status-new"

      };

    }


    return {

      label: "No new papers",

      icon: "✓",

      className: "tracker-status-clear"

    };

  }


  // ==========================================
  // TRACKER STATUS HTML
  // ==========================================

  function getTrackerStatusHtml(
    tracker
  ) {

    const status =
      getTrackerStatus(
        tracker
      );


    return `

      <span
        class="tracker-status ${status.className}"
      >
        <span class="tracker-status-icon">
          ${status.icon}
        </span>

        <span>
          ${escapeHtml(status.label)}
        </span>
      </span>

    `;

  }


  // ==========================================
  // CRITERIA BADGE
  // ==========================================

  function createCriteriaBadge(
    text,
    className = ""
  ) {

    if (!String(text || "").trim()) {

      return "";

    }


    return `

      <span
        class="tracker-criteria-badge ${className}"
      >
        ${escapeHtml(text)}
      </span>

    `;

  }


  // ==========================================
  // TRACKER CRITERIA HTML
  // ==========================================

  function buildTrackerCriteriaHtml(
  criteria
) {

  criteria = criteria || {};

  let topic = "";

  if (
    Array.isArray(criteria.keywords) &&
    criteria.keywords.length
  ) {

    topic =
      criteria.keywords
        .filter(Boolean)
        .join(", ");

  }

  if (!topic) {

    if (criteria.author) {
      topic = `Author: ${criteria.author}`;
    }

    else if (criteria.journal) {
      topic = `Journal: ${criteria.journal}`;
    }

    else if (criteria.field) {
      topic = criteria.field;
    }

  }

  if (!topic) {

    topic =
      "Custom research profile";

  }

  return `

    <div class="tracker-criteria-row">

      <div class="tracker-criteria-label">
        🔬 Research topic
      </div>

      <div class="tracker-criteria-text">
        ${escapeHtml(topic)}
      </div>

    </div>

  `;

}

  // ==========================================
  // TRACKER STATISTICS HTML
  // ==========================================

  function buildTrackerStatisticsHtml(
    tracker
  ) {

    const papersTracked =
      getSeenCount(
        tracker
      );


    const newOnLastCheck =
      Number(
        tracker.lastCheckNewPapers || 0
      );


    const totalNewDiscovered =
      Number(
        tracker.totalNewPapers || 0
      );


    return `

      <div class="tracker-stats">

        <div class="tracker-stat">

          <div class="tracker-stat-icon">
            📚
          </div>

          <div class="tracker-stat-value">
            ${papersTracked}
          </div>

          <div class="tracker-stat-label">
            Papers tracked
          </div>

        </div>


        <div class="tracker-stat">

          <div class="tracker-stat-icon">
            🆕
          </div>

          <div class="tracker-stat-value">
            ${newOnLastCheck}
          </div>

          <div class="tracker-stat-label">
            New on last check
          </div>

        </div>


        <div class="tracker-stat">

          <div class="tracker-stat-icon">
            🔔
          </div>

          <div class="tracker-stat-value">
            ${totalNewDiscovered}
          </div>

          <div class="tracker-stat-label">
            Total new discovered
          </div>

        </div>


        <div class="tracker-stat">

          <div class="tracker-stat-icon">
            📅
          </div>

          <div class="tracker-stat-value tracker-stat-date">
            ${escapeHtml(
              tracker.lastChecked ||
              "Never"
            )}
          </div>

          <div class="tracker-stat-label">
            Last checked
          </div>

        </div>

      </div>

    `;

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

      trackedTopics.innerHTML = `

        <div class="card">

          <h2>
            📚 My tracked research
          </h2>

          <p>
            You don't have any tracked research
            profiles yet.
          </p>

        </div>

      `;

      return;

    }


    trackedTopics.innerHTML = `

      <div class="card tracker-dashboard">

        <div class="tracker-dashboard-header">

          <div>

            <h2>
              📚 My tracked research
            </h2>

            <p>
              ${trackers.length}
              tracked research
              ${trackers.length === 1 ? "profile" : "profiles"}
            </p>

          </div>

        </div>


        <div class="tracker-list">

          ${trackers.map(
            (tracker, index) => {

              const criteria =
                tracker.criteria || {};


              const createdAt =
                tracker.createdAt ||
                "Unknown";


              return `

                <div
                  class="tracked-topic tracker-card"
                  data-tracker-id="${escapeAttribute(
                    tracker.id || ""
                  )}"
                  data-tracker-index="${index}"
                >

                  <!-- ======================
                       CARD HEADER
                  ======================= -->

                  <div class="tracker-card-header">

                    <div class="tracker-card-title">

                      <div class="tracker-number">
                        ${index + 1}
                      </div>

                      <div>

                        <h3>
                          Research profile
                        </h3>

                        <div class="tracker-id-label">
                          ${escapeHtml(
                            getTrackerShortLabel(
                              tracker
                            )
                          )}
                        </div>

                      </div>

                    </div>


                    <div class="tracker-card-status">

                      ${getTrackerStatusHtml(
                        tracker
                      )}

                    </div>

                  </div>


                  <!-- ======================
                       CRITERIA
                  ======================= -->

                  <div class="tracker-section">

                    <div class="tracker-section-heading">
                      🔬 Research criteria
                    </div>

                    <div class="tracker-criteria">

                      ${buildTrackerCriteriaHtml(
                        criteria
                      )}

                    </div>

                  </div>


                  <!-- ======================
                       STATISTICS
                  ======================= -->

                  <div class="tracker-section">

                    <div class="tracker-section-heading">
                      📊 Tracking statistics
                    </div>

                    ${buildTrackerStatisticsHtml(
                      tracker
                    )}

                  </div>


                  <!-- ======================
                       DATES
                  ======================= -->

                  <div class="tracker-meta">

                    <div>

                      <strong>
                        Created:
                      </strong>

                      ${escapeHtml(
                        createdAt
                      )}

                    </div>

                    <div>

                      <strong>
                        Last checked:
                      </strong>

                      ${escapeHtml(
                        tracker.lastChecked ||
                        "Never"
                      )}

                    </div>

                  </div>


                  <!-- ======================
                       ACTIONS
                  ======================= -->

                  <div class="tracker-actions">

                    <button
                      type="button"
                      class="view-tracker-button"
                      data-tracker-id="${escapeAttribute(
                        tracker.id || ""
                      )}"
                    >
                      👁️ View
                    </button>


                    <button
                      type="button"
                      class="check-tracker-button"
                      data-tracker-id="${escapeAttribute(
                        tracker.id || ""
                      )}"
                    >
                      🔄 Check for new papers
                    </button>


                    <button
                      type="button"
                      class="delete-tracker-button danger"
                      data-tracker-id="${escapeAttribute(
                        tracker.id || ""
                      )}"
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              `;

            }
          ).join("")}

        </div>

      </div>

    `;


    attachTrackerDashboardEvents();

  }


  // ==========================================
  // SHORT TRACKER LABEL
  // ==========================================

  function getTrackerShortLabel(
    tracker
  ) {

    const criteria =
      tracker?.criteria || {};


    const keywords =
      Array.isArray(criteria.keywords)
        ? criteria.keywords.filter(Boolean)
        : [];


    if (keywords.length) {

      const text =
        keywords.slice(0, 3).join(", ");


      if (keywords.length > 3) {

        return (
          `${text} +${keywords.length - 3}`
        );

      }


      return text;

    }


    if (criteria.author) {

      return `Author: ${criteria.author}`;

    }


    if (criteria.journal) {

      return `Journal: ${criteria.journal}`;

    }


    if (criteria.field) {

      return `Field: ${criteria.field}`;

    }


    return "Custom research profile";

  }


  // ==========================================
  // TRACKER DASHBOARD EVENTS
  // ==========================================

  function attachTrackerDashboardEvents() {

    // ----------------------------------------
    // VIEW
    // ----------------------------------------

    document
      .querySelectorAll(
        ".view-tracker-button"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            async () => {

              if (trackerActionInProgress) {

                return;

              }


              const trackerId =
                button.dataset.trackerId;


              const tracker =
                findTrackerById(
                  trackerId
                );


              if (!tracker) {

                showTrackerNotFound();

                return;

              }


              await runSavedTracker(
                tracker
              );

            }
          );

        }
      );


    // ----------------------------------------
    // CHECK
    // ----------------------------------------

    document
      .querySelectorAll(
        ".check-tracker-button"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            async () => {

              if (trackerActionInProgress) {

                return;

              }


              const trackerId =
                button.dataset.trackerId;


              const tracker =
                findTrackerById(
                  trackerId
                );


              if (!tracker) {

                showTrackerNotFound();

                return;

              }


              await runSavedTracker(
                tracker
              );

            }
          );

        }
      );


    // ----------------------------------------
    // DELETE
    // ----------------------------------------

    document
      .querySelectorAll(
        ".delete-tracker-button"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              if (trackerActionInProgress) {

                return;

              }


              const trackerId =
                button.dataset.trackerId;


              const trackers =
                getAdvancedTrackers();


              const trackerIndex =
                trackers.findIndex(
                  tracker =>
                    String(
                      tracker.id || ""
                    ) ===
                    String(
                      trackerId || ""
                    )
                );


              if (trackerIndex === -1) {

                showTrackerNotFound();

                return;

              }


              const tracker =
                trackers[
                  trackerIndex
                ];


              const label =
                getTrackerShortLabel(
                  tracker
                );


              const confirmed =
                window.confirm(
                  `Delete this tracked research profile?\n\n${label}`
                );


              if (!confirmed) {

                return;

              }


              trackers.splice(
                trackerIndex,
                1
              );


              saveAdvancedTrackers(
                trackers
              );


              displayTrackedTopics();


              showMessage(`

                <h2>
                  🗑️ Tracker deleted
                </h2>

                <p>
                  The research tracking profile
                  was deleted successfully.
                </p>

              `);

            }
          );

        }
      );

  }


  // ==========================================
  // FIND TRACKER BY ID
  // ==========================================

  function findTrackerById(
    trackerId
  ) {

    if (!trackerId) {

      return null;

    }


    const trackers =
      getAdvancedTrackers();


    return (
      trackers.find(
        tracker =>
          String(
            tracker.id || ""
          ) ===
          String(
            trackerId
          )
      ) ||
      null
    );

  }


  // ==========================================
  // TRACKER NOT FOUND
  // ==========================================

  function showTrackerNotFound() {

    showMessage(`

      <h2>
        ❌ Tracker not found
      </h2>

      <p>
        This tracking profile no longer
        exists in local storage.
      </p>

      <p>
        The tracker dashboard has been refreshed.
      </p>

    `);


    displayTrackedTopics();

  }


  // ==========================================
  // VIEW / CHECK SAVED TRACKER
  // ==========================================

  async function runSavedTracker(
    tracker
  ) {

    if (!tracker) {

      return;

    }


    if (trackerActionInProgress) {

      return;

    }


    trackerActionInProgress =
      true;


    // ----------------------------------------
    // NORMALIZE SAVED CRITERIA
    // ----------------------------------------

    const safeCriteria =
      cloneCriteria(
        tracker.criteria || {}
      );


    // ----------------------------------------
    // VALIDATE
    // ----------------------------------------

    const hasCriteria =
      safeCriteria.keywords.length > 0 ||
      safeCriteria.author ||
      safeCriteria.journal ||
      safeCriteria.field;


    if (!hasCriteria) {

      trackerActionInProgress =
        false;


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
      `Looking for papers matching
       <strong>${escapeHtml(
         getTrackerShortLabel(tracker)
       )}</strong>.`
    );


    try {

      const papers =
        await searchWithCriteria(
          safeCriteria
        );


      // --------------------------------------
      // GET CURRENT TRACKER FROM STORAGE
      // --------------------------------------

      let trackers =
        getAdvancedTrackers();


      const profileKey =
        createTrackerProfileKey(
          safeCriteria
        );


      let trackerIndex =
        trackers.findIndex(
          item =>
            getTrackerProfileKey(item) ===
            profileKey
        );


      // --------------------------------------
      // FALLBACK TO STABLE ID
      // --------------------------------------

      if (trackerIndex === -1) {

        trackerIndex =
          trackers.findIndex(
            item =>
              String(item.id) ===
              String(tracker.id)
          );

      }


      if (trackerIndex === -1) {

        trackerActionInProgress =
          false;


        showTrackerNotFound();

        return;

      }


      // --------------------------------------
      // NORMALIZE CURRENT TRACKER
      // --------------------------------------

      tracker =
        normalizeTracker(
          trackers[trackerIndex],
          safeCriteria,
          profileKey
        );


      // --------------------------------------
      // COMPARE WITH HISTORY
      // --------------------------------------

      const check =
        updateTrackerAfterCheck(
          tracker,
          papers
        );


      // --------------------------------------
      // SAVE
      // --------------------------------------

      trackers[trackerIndex] =
        tracker;


      saveAdvancedTrackers(
        trackers
      );


      // --------------------------------------
      // REFRESH DASHBOARD
      // --------------------------------------

      displayTrackedTopics();


      // --------------------------------------
      // ZERO RESULTS
      // --------------------------------------

      if (!papers.length) {

        trackerActionInProgress =
          false;


        showMessage(`

          <h2>
            🔎 No matching papers
          </h2>

          <p>
            No papers currently match
            this tracking profile.
          </p>

          <p>
            The tracker was checked successfully.
          </p>

          <div class="tracker-result-summary">

            <div>
              📚
              <strong>
                Papers tracked:
              </strong>
              ${getSeenCount(tracker)}
            </div>

            <div>
              🆕
              <strong>
                New on this check:
              </strong>
              0
            </div>

            <div>
              🔔
              <strong>
                Total new discovered:
              </strong>
              ${Number(
                tracker.totalNewPapers || 0
              )}
            </div>

            <div>
              📅
              <strong>
                Last checked:
              </strong>
              ${escapeHtml(
                tracker.lastChecked
              )}
            </div>

          </div>

        `);

        return;

      }


      // --------------------------------------
      // MARK NEW / PREVIOUSLY SEEN
      // --------------------------------------

      const markedPapers =
        markTrackerPapers(
          papers,
          check.newPapers
        );


      // --------------------------------------
      // SHOW RESULTS
      // --------------------------------------

      displayResults(
        markedPapers,
        check.newPapers.length > 0
          ? `🆕 Tracked research — ${check.newPapers.length} new`
          : "📚 Tracked research — no new papers"
      );


      // --------------------------------------
      // SHOW TRACKER SUMMARY
      // --------------------------------------

      const counter =
        document.getElementById(
          "resultCounter"
        );


      if (counter) {

        counter.innerHTML = `

          Showing
          ${Math.min(
            10,
            markedPapers.length
          )}
          of
          ${markedPapers.length}
          papers

          &nbsp;•&nbsp;

          ${
            check.newPapers.length > 0
              ? `
                🆕
                <strong>
                  ${check.newPapers.length}
                </strong>
                new
              `
              : `
                ✓
                <strong>
                  No new papers
                </strong>
              `
          }

          &nbsp;•&nbsp;

          📚
          <strong>
            ${check.previouslySeenPapers.length}
          </strong>
          previously seen

          &nbsp;•&nbsp;

          📊
          <strong>
            ${getSeenCount(tracker)}
          </strong>
          tracked

          &nbsp;•&nbsp;

          🔔
          <strong>
            ${Number(
              tracker.totalNewPapers || 0
            )}
          </strong>
          total new discovered

          &nbsp;•&nbsp;

          📅
          Last checked:
          <strong>
            ${escapeHtml(
              tracker.lastChecked
            )}
          </strong>

        `;

      }


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

    } finally {

      trackerActionInProgress =
        false;


      // Refresh the dashboard one final time
      // so statistics/status are always current.
      displayTrackedTopics();

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

  function showMessage(html) {

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
