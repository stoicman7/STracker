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

  const keywordGroupsContainer =
    document.getElementById("keywordGroupsContainer");

  const excludeContainer =
    document.getElementById("excludeContainer");

  const addKeywordGroupButton =
    document.getElementById("addKeywordGroupButton");

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

  const advancedFiltersCard =
    document.getElementById("advancedFiltersCard");

  const advancedFiltersToggle =
    document.getElementById("advancedFiltersToggle");

  const advancedFiltersSummary =
    document.getElementById("advancedFiltersSummary");


  // ==========================================
  // ICONOGRAPHY
  // ------------------------------------------
  // A small set of single-stroke line icons used
  // in place of emoji throughout the interface.
  // Each returns an inline <svg>; sizing/color are
  // controlled entirely through CSS (.icon).
  // ==========================================

  const ICONS = {

    bell: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 8a5 5 0 0 1 10 0c0 3.2 1 4.2 1.5 5H3.5C4 12.2 5 11.2 5 8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.3 15.5a1.8 1.8 0 0 0 3.4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    layers: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3.5 17 7l-7 3.5L3 7l7-3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M3 11l7 3.5L17 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 14.5 10 18l7-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    check: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.5 10.5 8 14l7.5-8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    clock: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 6.5V10l2.6 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    alert: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3.5 17.5 16h-15L10 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 8.3v3.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="13.7" r="0.9" fill="currentColor"/></svg>',

    help: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 8a2 2 0 1 1 2.9 1.8c-.7.4-.9.8-.9 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="13.6" r="0.85" fill="currentColor"/></svg>',

    trash: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 6h12M8 6V4.6c0-.4.3-.6.6-.6h2.8c.3 0 .6.2.6.6V6M6.2 6l.6 9.4c0 .3.3.6.6.6h5.2c.3 0 .6-.3.6-.6L13.8 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    eye: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 10s2.8-5 8-5 8 5 8 5-2.8 5-8 5-8-5-8-5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.2" stroke="currentColor" stroke-width="1.5"/></svg>',

    refresh: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15.5 6.5A6 6 0 1 0 16.8 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15.5 3v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

    external: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.5 5H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5 3.5H16.5V8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 4 9.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    search: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.3" stroke="currentColor" stroke-width="1.5"/><path d="M16.2 16.2 12.8 12.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    calendar: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.2" y="4.2" width="13.6" height="12" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M3.2 8.2h13.6M7 3v2.6M13 3v2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    flask: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8 3h4M8.6 3v4.9L4.7 14a1.6 1.6 0 0 0 1.4 2.4h7.8a1.6 1.6 0 0 0 1.4-2.4L11.4 7.9V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 12h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',

    stack: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 8.2h13" stroke="currentColor" stroke-width="1.5"/></svg>',

    sliders: '<svg class="icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="6" r="1.4" fill="var(--paper)" stroke="currentColor" stroke-width="1.4"/><circle cx="14" cy="10" r="1.4" fill="var(--paper)" stroke="currentColor" stroke-width="1.4"/><circle cx="7" cy="14" r="1.4" fill="var(--paper)" stroke="currentColor" stroke-width="1.4"/></svg>'

  };


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
  // KEYWORD GROUP UI STATE
  // ==========================================

  let keywordGroupCounter = 0;


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
      "Searching…",
      `Searching free research sources for
       <strong>${escapeHtml(query)}</strong>`
    );


    try {

      const papers =
        await searchFreeSources(query);


      sortPapersNewestFirst(papers);


      if (!papers.length) {

        showMessage(`
          <h2>No papers found</h2>

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
        <h2>Search failed</h2>

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
  // KEYWORD FIELD OPTIONS (shared markup)
  // ==========================================

  const KEYWORD_FIELD_LABELS = {

    title: "Title",
    abstract: "Abstract",
    authors: "Authors",
    journal: "Journal",
    concepts: "Concepts"

  };


  function buildKeywordFieldOptionsHtml() {

    return `

      <label>
        <input type="checkbox" class="keyword-field" value="title">
        Title
      </label>

      <label>
        <input type="checkbox" class="keyword-field" value="abstract">
        Abstract
      </label>

      <label>
        <input type="checkbox" class="keyword-field" value="authors">
        Authors
      </label>

      <label>
        <input type="checkbox" class="keyword-field" value="journal">
        Journal
      </label>

      <label>
        <input type="checkbox" class="keyword-field" value="concepts">
        Concepts
      </label>

    `;

  }


  // ==========================================
  // COLLAPSIBLE FIELD SELECTOR — SUMMARY CHIPS
  // ==========================================

  function updateKeywordFieldsSummary(row) {

    if (!row) {

      return;

    }


    const summaryEl =
      row.querySelector(
        ".keyword-fields-summary"
      );


    if (!summaryEl) {

      return;

    }


    const checkedValues =
      Array.from(
        row.querySelectorAll(
          ".keyword-field:checked"
        )
      )
        .map(
          checkbox =>
            KEYWORD_FIELD_LABELS[
              checkbox.value
            ] || checkbox.value
        );


    if (!checkedValues.length) {

      summaryEl.innerHTML =
        `<span class="keyword-fields-chip keyword-fields-chip-muted">All fields</span>`;

      return;

    }


    summaryEl.innerHTML =
      checkedValues
        .map(
          label =>
            `<span class="keyword-fields-chip">${escapeHtml(label)}</span>`
        )
        .join("");

  }


  // ==========================================
  // COLLAPSIBLE FIELD SELECTOR — OUTSIDE CLICK
  // ==========================================
  //
  // Each field-selector card tracks its own
  // expanded/collapsed state via its own class list
  // (no shared/global state), so opening one keyword's
  // selector never affects any other keyword's.

  let keywordFieldsOutsideClickBound = false;


  function ensureKeywordFieldsOutsideClickHandler() {

    if (keywordFieldsOutsideClickBound) {

      return;

    }


    keywordFieldsOutsideClickBound = true;


    document.addEventListener(
      "click",
      event => {

        document
          .querySelectorAll(
            ".keyword-fields-card.expanded"
          )
          .forEach(
            card => {

              if (card.contains(event.target)) {

                return;

              }


              card.classList.remove(
                "expanded"
              );


              const toggle =
                card.querySelector(
                  ".keyword-fields-toggle"
                );


              if (toggle) {

                toggle.setAttribute(
                  "aria-expanded",
                  "false"
                );

              }

            }
          );

      }
    );

  }


  // ==========================================
  // MATCH-WITHIN (OR/AND) HELP POPOVER
  // ------------------------------------------
  // Same delegated-click / outside-click pattern as
  // ensureKeywordFieldsOutsideClickHandler() above, but for
  // the small "?" control next to each keyword group's
  // OR/AND toggle. One listener handles every group, present
  // or future, so nothing needs re-binding when groups are
  // added or removed.
  // ==========================================

  let matchModeHelpBound = false;


  function ensureMatchModeHelpHandler() {

    if (matchModeHelpBound) {

      return;

    }


    matchModeHelpBound = true;


    document.addEventListener(
      "click",
      event => {

        const infoButton =
          event.target.closest(
            ".match-mode-info-button"
          );


        if (infoButton) {

          const wrapper =
            infoButton.closest(
              ".match-mode-help"
            );


          const popover =
            wrapper?.querySelector(
              ".match-mode-popover"
            );


          const willOpen =
            !!wrapper &&
            !wrapper.classList.contains(
              "open"
            );


          // Close every other open popover first
          // so only one is ever visible.

          document
            .querySelectorAll(
              ".match-mode-help.open"
            )
            .forEach(
              openWrapper => {

                if (openWrapper === wrapper) {

                  return;

                }


                closeMatchModeHelp(
                  openWrapper
                );

              }
            );


          if (wrapper && popover) {

            wrapper.classList.toggle(
              "open",
              willOpen
            );


            infoButton.setAttribute(
              "aria-expanded",
              String(willOpen)
            );


            popover.hidden =
              !willOpen;

          }


          return;

        }


        // Click landed outside any open popover — close them.

        document
          .querySelectorAll(
            ".match-mode-help.open"
          )
          .forEach(
            wrapper => {

              if (wrapper.contains(event.target)) {

                return;

              }


              closeMatchModeHelp(
                wrapper
              );

            }
          );

      }
    );

  }


  function closeMatchModeHelp(wrapper) {

    if (!wrapper) {

      return;

    }


    wrapper.classList.remove(
      "open"
    );


    wrapper
      .querySelector(
        ".match-mode-info-button"
      )
      ?.setAttribute(
        "aria-expanded",
        "false"
      );


    const popover =
      wrapper.querySelector(
        ".match-mode-popover"
      );


    if (popover) {

      popover.hidden = true;

    }

  }


  // ==========================================
  // ADD A KEYWORD ROW INSIDE A GROUP
  // ==========================================

  function createKeywordGroupRow(rowsContainer) {

    if (!rowsContainer) {

      return;

    }


    ensureKeywordFieldsOutsideClickHandler();


    const row =
      document.createElement("div");


    row.className =
      "keyword-row";


    row.innerHTML = `

      <div class="keyword-row-main">

        <input
          type="text"
          class="required-keyword"
          placeholder="Example: memory formation"
        >

        <button
          type="button"
          class="keyword-remove-button"
          title="Remove keyword"
          aria-label="Remove keyword"
        >
          ×
        </button>

      </div>

      <div class="keyword-fields-card expanded">

        <button
          type="button"
          class="keyword-fields-toggle"
          aria-expanded="true"
        >

          <span class="keyword-fields-toggle-text">
            Search keywords in
          </span>

          <span class="keyword-fields-summary"></span>

          <svg
            class="keyword-fields-chevron"
            viewBox="0 0 20 20"
            width="14"
            height="14"
            aria-hidden="true"
          >
            <path
              d="M5 7l5 5 5-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

        </button>

        <div class="keyword-fields-panel">
          <div class="keyword-fields-panel-inner">
            <div class="checkbox-group">
              ${buildKeywordFieldOptionsHtml()}
            </div>
          </div>
        </div>

      </div>

    `;


    rowsContainer.appendChild(
      row
    );


    // ------------------------------------------
    // REMOVE KEYWORD
    // ------------------------------------------

    const removeButton =
      row.querySelector(
        ".keyword-remove-button"
      );


    if (removeButton) {

      removeButton.addEventListener(
        "click",
        () => {

          row.remove();

        }
      );

    }


    // ------------------------------------------
    // COLLAPSE / EXPAND TOGGLE (independent per row)
    // ------------------------------------------

    const fieldsCard =
      row.querySelector(
        ".keyword-fields-card"
      );


    const toggleButton =
      row.querySelector(
        ".keyword-fields-toggle"
      );


    if (toggleButton && fieldsCard) {

      toggleButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();


          const expanded =
            fieldsCard.classList.toggle(
              "expanded"
            );


          toggleButton.setAttribute(
            "aria-expanded",
            String(expanded)
          );

        }
      );

    }


    // ------------------------------------------
    // KEEP SUMMARY CHIPS IN SYNC
    // ------------------------------------------

    row
      .querySelectorAll(
        ".keyword-field"
      )
      .forEach(
        checkbox => {

          checkbox.addEventListener(
            "change",
            () => {

              updateKeywordFieldsSummary(
                row
              );

            }
          );

        }
      );


    updateKeywordFieldsSummary(
      row
    );

  }


  // ==========================================
  // CREATE A KEYWORD GROUP
  // ==========================================

  function createKeywordGroup() {

    if (!keywordGroupsContainer) {

      return;

    }


    keywordGroupCounter += 1;


    const groupId =
      `kwgroup-${keywordGroupCounter}-${Date.now()}`;


    // Visual "AND" divider between this group and
    // whichever group already precedes it.

    if (keywordGroupsContainer.children.length > 0) {

      const divider =
        document.createElement("div");


      divider.className =
        "keyword-group-divider";


      divider.textContent =
        "AND";


      keywordGroupsContainer.appendChild(
        divider
      );

    }


    const group =
      document.createElement("div");


    group.className =
      "keyword-group";


    group.dataset.groupId =
      groupId;


    group.innerHTML = `

      <div class="keyword-group-header">

        <span class="keyword-group-title">
          Keyword Group
        </span>

      </div>

      <div class="keyword-group-rows"></div>

      <div class="keyword-group-controls">

        <button
          type="button"
          class="secondary add-keyword-to-group-button"
        >
          + Add keyword
        </button>

        <div class="keyword-mode">

          <label>
            Match within:
          </label>

          <label>
            <input
              type="radio"
              name="keywordGroupMode-${groupId}"
              value="any"
              checked
            >
            OR
          </label>

          <label>
            <input
              type="radio"
              name="keywordGroupMode-${groupId}"
              value="all"
            >
            AND
          </label>

          <div class="match-mode-help">

            <button
              type="button"
              class="match-mode-info-button"
              aria-expanded="false"
              aria-label="How OR and AND work"
            >
              ?
            </button>

            <div class="match-mode-popover" role="tooltip" hidden>

              <p>
                <strong>OR</strong> — matches a paper if it
                contains <em>any</em> keyword in this group.
                Broader results.
              </p>

              <p>
                <strong>AND</strong> — matches a paper only if
                it contains <em>every</em> keyword in this
                group. Narrower results.
              </p>

              <p class="match-mode-popover-example">
                Example with <code>memory</code> and
                <code>cognition</code>:<br>
                OR finds papers with either word.<br>
                AND finds only papers with both.
              </p>

            </div>

          </div>

        </div>

        <button
          type="button"
          class="danger remove-keyword-group-button"
        >
          Remove group
        </button>

      </div>

    `;


    keywordGroupsContainer.appendChild(
      group
    );


    ensureMatchModeHelpHandler();


    const rowsContainer =
      group.querySelector(
        ".keyword-group-rows"
      );


    // Every group starts with one keyword row.

    createKeywordGroupRow(
      rowsContainer
    );


    const addRowButton =
      group.querySelector(
        ".add-keyword-to-group-button"
      );


    if (addRowButton) {

      addRowButton.addEventListener(
        "click",
        () => {

          createKeywordGroupRow(
            rowsContainer
          );

        }
      );

    }


    const removeGroupButton =
      group.querySelector(
        ".remove-keyword-group-button"
      );


    if (removeGroupButton) {

      removeGroupButton.addEventListener(
        "click",
        () => {

          // Remove exactly one adjacent "AND"
          // divider so the chain stays valid.

          const previousSibling =
            group.previousElementSibling;


          const nextSibling =
            group.nextElementSibling;


          if (
            previousSibling &&
            previousSibling.classList.contains(
              "keyword-group-divider"
            )
          ) {

            previousSibling.remove();

          } else if (
            nextSibling &&
            nextSibling.classList.contains(
              "keyword-group-divider"
            )
          ) {

            nextSibling.remove();

          }


          group.remove();

        }
      );

    }

  }


  // ==========================================
  // ADD KEYWORD GROUP BUTTON
  // ==========================================

  if (addKeywordGroupButton) {

    addKeywordGroupButton.addEventListener(
      "click",
      () => {

        createKeywordGroup();

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


        document
          .querySelectorAll(
            ".keyword-row"
          )
          .forEach(
            row => {

              updateKeywordFieldsSummary(
                row
              );

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
  // CREATE GENERIC INPUT ROW (excluded keywords)
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
      "keyword-row keyword-row-simple";


    const input =
      document.createElement("input");


    input.type =
      "text";


    input.className =
      className;


    input.placeholder =
      placeholder;


    row.appendChild(
      input
    );


    // ========================================
    // REMOVE BUTTON
    // ========================================

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

        updateAdvancedFiltersSummary();

      }
    );


    row.appendChild(
      removeButton
    );


    input.addEventListener(
      "input",
      updateAdvancedFiltersSummary
    );


    container.appendChild(
      row
    );

  }


  // ==========================================
  // "REFINE FURTHER" PROGRESSIVE DISCLOSURE
  // ------------------------------------------
  // Collapsed by default so a new user can create
  // a basic tracker from keywords alone. When
  // collapsed, a chip summary communicates exactly
  // which of the secondary filters are currently
  // configured, without requiring the panel to be
  // reopened.
  // ==========================================

  if (advancedFiltersToggle && advancedFiltersCard) {

    advancedFiltersToggle.addEventListener(
      "click",
      () => {

        const expanded =
          advancedFiltersCard.classList.toggle(
            "expanded"
          );

        advancedFiltersToggle.setAttribute(
          "aria-expanded",
          String(expanded)
        );

      }
    );

  }


  function updateAdvancedFiltersSummary() {

    if (!advancedFiltersSummary) {

      return;

    }

    const chips = [];

    const author =
      authorInput ? authorInput.value.trim() : "";

    const journal =
      journalInput ? journalInput.value.trim() : "";

    const field =
      fieldInput ? fieldInput.value : "";

    const dateRange =
      dateRangeInput ? dateRangeInput.value : "all";

    const documentType =
      documentTypeInput ? documentTypeInput.value : "";

    const excludedCount =
      Array.from(
        document.querySelectorAll(".excluded-keyword")
      )
        .map(input => input.value.trim())
        .filter(Boolean).length;

    if (author) {
      chips.push(`Author: ${author}`);
    }

    if (journal) {
      chips.push(`Journal: ${journal}`);
    }

    if (field) {
      chips.push(field);
    }

    if (dateRange && dateRange !== "all") {

      const dateLabel =
        dateRangeInput &&
        dateRangeInput.selectedOptions.length
          ? dateRangeInput.selectedOptions[0].textContent.trim()
          : dateRange;

      chips.push(dateLabel);

    }

    if (documentType) {

      const typeLabel =
        documentTypeInput &&
        documentTypeInput.selectedOptions.length
          ? documentTypeInput.selectedOptions[0].textContent.trim()
          : documentType;

      chips.push(typeLabel);

    }

    if (excludedCount > 0) {

      chips.push(
        `${excludedCount} exclusion${excludedCount === 1 ? "" : "s"}`
      );

    }

    advancedFiltersSummary.innerHTML =
      chips.length
        ? chips
            .map(
              text =>
                `<span class="keyword-fields-chip">${escapeHtml(text)}</span>`
            )
            .join("")
        : `<span class="keyword-fields-chip keyword-fields-chip-muted">No extra filters</span>`;

  }


  [
    authorInput,
    journalInput,
    fieldInput,
    dateRangeInput,
    documentTypeInput
  ].forEach(
    field => {

      if (!field) {

        return;

      }

      field.addEventListener(
        "input",
        updateAdvancedFiltersSummary
      );

      field.addEventListener(
        "change",
        updateAdvancedFiltersSummary
      );

    }
  );


 
// ==========================================
// GET ADVANCED CRITERIA
// ==========================================

function getCriteria() {

  // ========================================
  // KEYWORD GROUPS
  // ========================================

  const groupElements =
    Array.from(
      document.querySelectorAll(
        "#keywordGroupsContainer .keyword-group"
      )
    );


  const keywordGroups = [];


  groupElements.forEach(
    groupElement => {

      const rows =
        Array.from(
          groupElement.querySelectorAll(
            ".keyword-group-rows .keyword-row"
          )
        );


      const groupKeywords = [];


      rows.forEach(
        row => {

          const input =
            row.querySelector(
              ".required-keyword"
            );


          if (!input) {
            return;
          }


          const keyword =
            input.value.trim();


          if (!keyword) {
            return;
          }


          const fields =
            Array.from(
              row.querySelectorAll(
                ".keyword-field:checked"
              )
            )
              .map(
                checkbox =>
                  checkbox.value
              );


          groupKeywords.push({

            keyword,

            fields

          });

        }
      );


      // Skip groups where every keyword field
      // was left empty.

      if (!groupKeywords.length) {

        return;

      }


      const modeInput =
        groupElement.querySelector(
          'input[type="radio"]:checked'
        );


      const mode =
        modeInput &&
        modeInput.value === "all"
          ? "all"
          : "any";


      keywordGroups.push({

        keywords:
          groupKeywords,

        mode

      });

    }
  );


  // Flattened keyword list. Used only to build the
  // free-text search query sent to the paper sources
  // (PubMed / Europe PMC) and for quick "is anything
  // filled in" checks. Grouping/AND/OR is NOT derived
  // from this — that logic lives in keywordGroups and
  // is applied afterwards by matchesAdvancedCriteria().

  const keywords = [];


  keywordGroups.forEach(
    group => {

      group.keywords.forEach(
        item => {

          keywords.push(
            item.keyword
          );

        }
      );

    }
  );


  // ========================================
  // EXCLUDED KEYWORDS
  // ========================================

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


  // ========================================
  // RETURN CRITERIA
  // ========================================

  return {

    keywordGroups,

    keywords,


    excluded,


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
        : ""

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
        <h2>Add some criteria first</h2>

        <p>
          Add at least one keyword, author,
          journal, or research field.
        </p>
      `);

      return;

    }


    showSearchingMessage(
      "Searching…",
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
              Research tracking saved
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
              <strong>
                Papers tracked:
              </strong>
              ${getSeenCount(trackingResult.tracker)}
            </p>

            <p>
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
            ? "Research tracking started"
            : `Tracker updated — ${trackingResult.newPapers.length} new`
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

            if (papers.length === 0) {

        showMessage(`

          <h2>
            No matching papers
          </h2>

          <p>
            No papers currently match your
            selected research criteria.
          </p>

          <p>
            Try adding or removing keywords,
            changing the search fields, or
            broadening your other filters.
          </p>

        `);

        return;

      }


      displayResults(
        papers,
        "Matching research"
      );


    } catch (error) {

      console.error(
        "Advanced search error:",
        error
      );


      showMessage(`

        <h2>
          Search failed
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

  // ==========================================
  // BUILD A BROAD SOURCE QUERY FROM KEYWORDS
  // ==========================================
  //
  // The exact AND/OR/field logic is enforced
  // afterwards by matchesAdvancedCriteria(), so this
  // query only needs to be broad enough that every
  // paper which COULD match isn't excluded before
  // that filtering ever runs. Joining terms with a
  // plain space causes most sources (PubMed
  // included) to treat them as an implicit AND,
  // which silently drops papers that should have
  // matched under OR logic or a different field.
  // Joining with OR instead casts the widest net.

  function buildSourceQuery(keywords) {

    const uniqueTerms =
      Array.from(
        new Set(
          (Array.isArray(keywords) ? keywords : [])
            .map(
              term =>
                String(term || "").trim()
            )
            .filter(Boolean)
        )
      );


    if (!uniqueTerms.length) {

      return "";

    }


    const parts =
      uniqueTerms.map(
        term =>
          term.includes(" ")
            ? `"${term.replace(/"/g, "")}"`
            : term
      );


    return parts.length > 1
      ? parts.join(" OR ")
      : parts[0];

  }


  async function searchWithCriteria(
    criteria
  ) {

    let query =
      buildSourceQuery(
        criteria.keywords
      );


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


    // Use the exact same research sources
    // as Quick Search.

    let papers =
      await searchFreeSources(
        query
      );


    // Apply ONLY the criteria explicitly
    // selected by the user.

    papers =
      papers.filter(
        paper =>
          matchesAdvancedCriteria(
            paper,
            criteria
          )
      );


    // Newest papers first.
    // No artificial relevance score.

    sortPapersNewestFirst(
      papers
    );


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
  // ------------------------------------------
  // Every source below returns the SAME normalized
  // paper shape (see mapEuropePMCRecord / mapPubMedRecord
  // for the canonical example). All ten sources are
  // queried concurrently; a slow or failing source never
  // blocks or breaks the others (Promise.allSettled +
  // a per-request timeout). Results are merged with the
  // existing pmid/doi/title dedup key, then passed through
  // a second, fuzzy title-similarity pass so near-duplicate
  // records from different sources (e.g. a preprint and its
  // published version) collapse into one entry instead of
  // appearing twice.
  // ==========================================

  const SOURCE_FETCHERS = [

    { name: "Europe PMC", fn: searchEuropePMC },
    { name: "PubMed", fn: searchPubMed },
    { name: "Semantic Scholar", fn: searchSemanticScholar },
    { name: "Crossref", fn: searchCrossref },
    { name: "arXiv", fn: searchArxiv },
    { name: "bioRxiv", fn: searchBioRxiv },
    { name: "medRxiv", fn: searchMedRxiv },
    { name: "CORE", fn: searchCORE },
    { name: "DOAJ", fn: searchDOAJ },
    { name: "AGRIS", fn: searchAGRIS }

  ];


  async function searchFreeSources(query) {

    const settled =
      await Promise.allSettled(
        SOURCE_FETCHERS.map(
          source => source.fn(query)
        )
      );


    const resultsById =
      new Map();


    settled.forEach(
      (outcome, index) => {

        const sourceName =
          SOURCE_FETCHERS[index].name;


        if (outcome.status !== "fulfilled") {

          console.warn(
            `${sourceName} search failed:`,
            outcome.reason
          );

          return;

        }


        const papers =
          Array.isArray(outcome.value)
            ? outcome.value
            : [];


        papers.forEach(
          paper =>
            mergeIntoResultsMap(
              resultsById,
              paper
            )
        );

      }
    );


    let papers =
      Array.from(
        resultsById.values()
      )
        .filter(isValidDate);


    papers =
      mergeSimilarTitles(papers);


    return papers;

  }


  // ==========================================
  // MERGE ONE PAPER INTO THE RESULTS MAP
  // (exact match on pmid / doi / normalized title)
  // ==========================================

  function mergeIntoResultsMap(
    resultsById,
    paper
  ) {

    const key =
      getPaperDeduplicationKey(paper);


    if (!resultsById.has(key)) {

      resultsById.set(key, paper);

      return;

    }


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


  // ==========================================
  // FUZZY TITLE-SIMILARITY DEDUPLICATION
  // ------------------------------------------
  // Catches duplicates that getPaperDeduplicationKey()
  // misses — e.g. the same paper from two sources where
  // neither record carries a DOI or PMID, or where minor
  // punctuation/wording differences (subtitle, trailing
  // period, "&" vs "and") make the normalized titles not
  // match exactly. Papers are bucketed by their three
  // longest significant title words so comparisons stay
  // cheap even on a large candidate pool, then compared
  // pairwise within each bucket using Jaccard similarity
  // over title word sets.
  // ==========================================

  const TITLE_SIMILARITY_THRESHOLD = 0.86;


  function normalizeTitleForSimilarity(title) {

    return String(title || "")
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }


  function titleSimilarity(a, b) {

    const wordsA =
      new Set(
        normalizeTitleForSimilarity(a)
          .split(" ")
          .filter(word => word.length > 2)
      );

    const wordsB =
      new Set(
        normalizeTitleForSimilarity(b)
          .split(" ")
          .filter(word => word.length > 2)
      );


    if (!wordsA.size || !wordsB.size) {

      return 0;

    }


    let intersection = 0;

    wordsA.forEach(
      word => {

        if (wordsB.has(word)) {

          intersection++;

        }

      }
    );


    const union =
      new Set([
        ...wordsA,
        ...wordsB
      ]).size;


    return union === 0
      ? 0
      : intersection / union;

  }


  function titleSimilarityBucketKey(title) {

    const words =
      normalizeTitleForSimilarity(title)
        .split(" ")
        .filter(word => word.length > 3)
        .sort();


    return (
      words.slice(0, 3).join("|") ||
      normalizeTitleForSimilarity(title).slice(0, 12)
    );

  }


  function mergeSimilarTitles(papers) {

    const buckets =
      new Map();

    const kept = [];


    papers.forEach(
      paper => {

        const bucketKey =
          titleSimilarityBucketKey(
            paper.title
          );


        const candidateIndexes =
          buckets.get(bucketKey) ||
          [];


        let mergedIntoExisting =
          false;


        for (const index of candidateIndexes) {

          const existing =
            kept[index];


          if (!existing) {

            continue;

          }


          if (
            titleSimilarity(
              existing.title,
              paper.title
            ) >= TITLE_SIMILARITY_THRESHOLD
          ) {

            kept[index] =
              mergePaperRecords(
                existing,
                paper
              );

            mergedIntoExisting = true;

            break;

          }

        }


        if (!mergedIntoExisting) {

          kept.push(paper);


          candidateIndexes.push(
            kept.length - 1
          );

          buckets.set(
            bucketKey,
            candidateIndexes
          );

        }

      }
    );


    return kept;

  }


  // ==========================================
  // NETWORK HELPERS FOR NEW SOURCES
  // ------------------------------------------
  // PubMed and Europe PMC keep their original plain
  // fetch() calls untouched. Every newly added source
  // uses these shared helpers instead, so a slow or
  // hanging request from any one of them can never
  // stall Promise.allSettled in searchFreeSources().
  // ==========================================

  const SOURCE_REQUEST_TIMEOUT_MS = 15000;


  async function fetchJson(
    url,
    options = {},
    timeoutMs = SOURCE_REQUEST_TIMEOUT_MS
  ) {

    const controller =
      new AbortController();

    const timer =
      setTimeout(
        () => controller.abort(),
        timeoutMs
      );


    try {

      const response =
        await fetch(url, {
          ...options,
          signal: controller.signal
        });


      if (!response.ok) {

        throw new Error(
          `Request failed (${response.status}): ${url}`
        );

      }


      return await response.json();

    } finally {

      clearTimeout(timer);

    }

  }


  async function fetchText(
    url,
    options = {},
    timeoutMs = SOURCE_REQUEST_TIMEOUT_MS
  ) {

    const controller =
      new AbortController();

    const timer =
      setTimeout(
        () => controller.abort(),
        timeoutMs
      );


    try {

      const response =
        await fetch(url, {
          ...options,
          signal: controller.signal
        });


      if (!response.ok) {

        throw new Error(
          `Request failed (${response.status}): ${url}`
        );

      }


      return await response.text();

    } finally {

      clearTimeout(timer);

    }

  }


  // ==========================================
  // SHARED QUERY TRANSLATION
  // ------------------------------------------
  // buildSourceQuery() (above) already produces a broad
  // "term1 OR "multi word" OR term2" string for sources
  // with JSON-native OR support. Sources whose query
  // syntax can't consume that string directly (arXiv's
  // field-prefixed grammar, or sources with no search
  // endpoint at all that need individual terms for
  // client-side filtering) use this to recover the
  // original term list.
  // ==========================================

  function splitOrQuery(query) {

    const safe =
      String(query || "");


    return safe
      .split(/\s+OR\s+/i)
      .map(
        part =>
          part
            .trim()
            .replace(/^"+|"+$/g, "")
      )
      .filter(Boolean);

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

    // Fetch a much larger candidate pool than before.
    // The previous 100-result cap, combined with
    // date-recency bias elsewhere in the pipeline,
    // was cutting off older matching papers before
    // client-side keyword/field filtering ever saw
    // them. Europe PMC's default sort is relevance,
    // so this widens coverage without skewing toward
    // only the newest results.

    params.set("pageSize", "500");


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

    // Fetch a much larger candidate pool than before
    // (was 100) — the previous cap was the main reason
    // valid older papers never made it past the fetch
    // stage in the first place.

    searchParams.set(
      "retmax",
      "500"
    );

    // Deliberately NOT sorting by "pub date" here.
    // Sorting newest-first while retmax truncates the
    // result set means older-but-matching papers get
    // pushed past the cutoff and are silently dropped
    // before any keyword/field filtering runs. Relying
    // on PubMed's default relevance ranking keeps the
    // candidate pool representative across all years;
    // the app re-sorts newest-first for display later.


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


    // esummary is fetched in chunks so a large
    // retmax (up to 500 ids) doesn't produce an
    // excessively long request URL.

    const CHUNK_SIZE = 150;

    const idChunks = [];


    for (
      let i = 0;
      i < ids.length;
      i += CHUNK_SIZE
    ) {

      idChunks.push(
        ids.slice(i, i + CHUNK_SIZE)
      );

    }


    const records = [];


    for (const chunk of idChunks) {

      const summaryParams =
        new URLSearchParams();


      summaryParams.set(
        "db",
        "pubmed"
      );

      summaryParams.set(
        "id",
        chunk.join(",")
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


      chunk.forEach(
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

    }


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
  // SEMANTIC SCHOLAR
  // ==========================================

  async function searchSemanticScholar(query) {

    const params =
      new URLSearchParams();


    params.set("query", query);

    params.set("limit", "100");

    params.set(
      "fields",
      "title,abstract,authors,year,venue,publicationDate," +
      "externalIds,url,citationCount,publicationTypes,journal"
    );


    const url =
      "https://api.semanticscholar.org/graph/v1/paper/search?" +
      params.toString();


    const data =
      await fetchJson(url);


    const items =
      Array.isArray(data?.data)
        ? data.data
        : [];


    return items.map(
      mapSemanticScholarRecord
    );

  }


  function mapSemanticScholarRecord(record) {

    const doi =
      record.externalIds?.DOI ||
      "";

    const pmid =
      record.externalIds?.PubMed ||
      "";


    const authors =
      Array.isArray(record.authors)
        ? record.authors
            .map(author => author.name || "")
            .filter(Boolean)
            .join(", ")
        : "";


    const publicationDate =
      record.publicationDate ||
      (
        record.year
          ? `${record.year}-01-01`
          : ""
      );


    const journal =
      record.journal?.name ||
      record.venue ||
      "";


    return {

      id:
        pmid
          ? `pubmed:${pmid}`
          : doi
            ? `doi:${doi}`
            : `semanticscholar:${record.paperId || Date.now()}`,

      title:
        record.title ||
        "Untitled",

      publication_date:
        publicationDate,

      authorship:
        authors,

      authorships:
        authors
          ? authors
              .split(", ")
              .map(
                name => ({
                  author: {
                    display_name: name.trim()
                  }
                })
              )
          : [],

      journal_name:
        journal,

      abstract_text:
        record.abstract || "",

      source_name:
        "Semantic Scholar",

      primary_location: {

        landing_page_url:
          record.url ||
          (doi ? `https://doi.org/${doi}` : "#"),

        source: {
          display_name: journal
        }

      },

      concepts: [],

      type:
        normalizeDocumentType(
          record.publicationTypes
        ),

      doi:
        doi ? `https://doi.org/${doi}` : "",

      pmid,

      cited_by_count:
        typeof record.citationCount === "number"
          ? record.citationCount
          : undefined

    };

  }


  // ==========================================
  // CROSSREF
  // ==========================================

  async function searchCrossref(query) {

    const params =
      new URLSearchParams();


    params.set("query", query);

    params.set("rows", "100");


    const url =
      "https://api.crossref.org/works?" +
      params.toString();


    const data =
      await fetchJson(url);


    const items =
      Array.isArray(data?.message?.items)
        ? data.message.items
        : [];


    return items.map(
      mapCrossrefRecord
    );

  }


  function crossrefDateToIso(datePart) {

    const parts =
      datePart?.["date-parts"]?.[0];


    if (!Array.isArray(parts) || !parts.length) {

      return "";

    }


    const [year, month, day] =
      parts;


    if (!year) {

      return "";

    }


    const mm =
      String(month || 1).padStart(2, "0");

    const dd =
      String(day || 1).padStart(2, "0");


    return `${year}-${mm}-${dd}`;

  }


  function mapCrossrefRecord(record) {

    const doi =
      record.DOI || "";


    const authors =
      Array.isArray(record.author)
        ? record.author
            .map(
              author =>
                [author.given, author.family]
                  .filter(Boolean)
                  .join(" ")
            )
            .filter(Boolean)
            .join(", ")
        : "";


    const journal =
      Array.isArray(record["container-title"])
        ? record["container-title"][0] || ""
        : "";


    const publicationDate =
      crossrefDateToIso(record.published) ||
      crossrefDateToIso(record["published-print"]) ||
      crossrefDateToIso(record["published-online"]) ||
      "";


    const title =
      Array.isArray(record.title)
        ? record.title[0] || "Untitled"
        : (record.title || "Untitled");


    const rawAbstract =
      typeof record.abstract === "string"
        ? record.abstract
        : "";

    const abstract =
      rawAbstract
        .replace(/<\/?[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();


    return {

      id:
        doi
          ? `doi:${doi}`
          : `crossref:${record.URL || Date.now()}`,

      title,

      publication_date:
        publicationDate,

      authorship:
        authors,

      authorships:
        authors
          ? authors
              .split(", ")
              .map(
                name => ({
                  author: { display_name: name.trim() }
                })
              )
          : [],

      journal_name:
        journal,

      abstract_text:
        abstract,

      source_name:
        "Crossref",

      primary_location: {

        landing_page_url:
          record.URL ||
          (doi ? `https://doi.org/${doi}` : "#"),

        source: {
          display_name: journal
        }

      },

      concepts: [],

      type:
        normalizeDocumentType([record.type]),

      doi:
        doi ? `https://doi.org/${doi}` : "",

      pmid: "",

      cited_by_count:
        typeof record["is-referenced-by-count"] === "number"
          ? record["is-referenced-by-count"]
          : undefined

    };

  }


  // ==========================================
  // ARXIV
  // ------------------------------------------
  // arXiv has a real search endpoint, but its query
  // grammar is field-prefixed (all:term) rather than
  // the plain-OR syntax buildSourceQuery() produces for
  // JSON APIs, and it returns Atom XML rather than JSON.
  // ==========================================

  async function searchArxiv(query) {

    const params =
      new URLSearchParams();


    params.set(
      "search_query",
      buildArxivQuery(query)
    );

    params.set("start", "0");

    params.set("max_results", "100");

    params.set("sortBy", "relevance");


    const url =
      "https://export.arxiv.org/api/query?" +
      params.toString();


    const xmlText =
      await fetchText(url);


    const doc =
      new DOMParser().parseFromString(
        xmlText,
        "text/xml"
      );


    const entries =
      Array.from(
        doc.getElementsByTagName("entry")
      );


    return entries
      .map(mapArxivEntry)
      .filter(Boolean);

  }


  function buildArxivQuery(query) {

    const terms =
      splitOrQuery(query);


    if (!terms.length) {

      return `all:${query}`;

    }


    return terms
      .map(
        term =>
          `all:${
            term.includes(" ")
              ? `"${term}"`
              : term
          }`
      )
      .join(" OR ");

  }


  function mapArxivEntry(entry) {

    const getText =
      tag =>
        entry.getElementsByTagName(tag)[0]
          ?.textContent
          ?.trim() || "";


    const idUrl =
      getText("id");

    const arxivId =
      idUrl.split("/abs/")[1] || "";


    const title =
      getText("title").replace(/\s+/g, " ");

    const summary =
      getText("summary").replace(/\s+/g, " ");

    const published =
      getText("published");


    const authors =
      Array.from(
        entry.getElementsByTagName("author")
      )
        .map(
          node =>
            node.getElementsByTagName("name")[0]
              ?.textContent
              ?.trim() || ""
        )
        .filter(Boolean)
        .join(", ");


    const arxivNs =
      "http://arxiv.org/schemas/atom";

    const doiNode =
      entry.getElementsByTagNameNS(arxivNs, "doi")[0];

    const doi =
      doiNode
        ? doiNode.textContent.trim()
        : "";


    const journalRefNode =
      entry.getElementsByTagNameNS(
        arxivNs,
        "journal_ref"
      )[0];

    const journalRef =
      journalRefNode
        ? journalRefNode.textContent.trim()
        : "";


    const categoryNode =
      entry.getElementsByTagName("category")[0];

    const primaryCategory =
      categoryNode
        ? categoryNode.getAttribute("term") || ""
        : "";


    if (!title && !arxivId) {

      return null;

    }


    return {

      id:
        arxivId
          ? `arxiv:${arxivId}`
          : doi
            ? `doi:${doi}`
            : `arxiv:${title}`,

      title:
        title || "Untitled",

      publication_date:
        published
          ? published.slice(0, 10)
          : "",

      authorship:
        authors,

      authorships:
        authors
          ? authors
              .split(", ")
              .map(
                name => ({
                  author: { display_name: name.trim() }
                })
              )
          : [],

      journal_name:
        journalRef || "arXiv preprint",

      abstract_text:
        summary,

      source_name:
        "arXiv",

      primary_location: {

        landing_page_url:
          idUrl ||
          (arxivId ? `https://arxiv.org/abs/${arxivId}` : "#"),

        source: {
          display_name: journalRef || "arXiv"
        }

      },

      concepts:
        primaryCategory ? [primaryCategory] : [],

      type: "preprint",

      doi:
        doi ? `https://doi.org/${doi}` : "",

      pmid: ""

    };

  }


  // ==========================================
  // BIORXIV / MEDRXIV
  // ------------------------------------------
  // Neither service exposes a keyword-search endpoint —
  // only a date-range "details" feed (api.biorxiv.org /
  // api.medrxiv.org, same schema). A rolling recent window
  // is fetched (capped at a few pages to bound cost) and
  // filtered client-side against the query terms, so this
  // source still behaves like a search from the app's
  // point of view.
  // ==========================================

  async function searchBiorxivFamily(server, query) {

    // Each OR-term is matched as "all of its significant
    // words are present" rather than an exact phrase — this
    // mirrors how PubMed/Europe PMC treat a space-joined
    // query (implicit AND of words, not a literal phrase)
    // so this client-side fallback isn't stricter than the
    // sources that do have a real search endpoint.

    const termWordGroups =
      splitOrQuery(query)
        .map(
          term =>
            term
              .toLowerCase()
              .split(/\s+/)
              .filter(Boolean)
        )
        .filter(words => words.length > 0);


    if (!termWordGroups.length) {

      return [];

    }


    const today =
      new Date();

    const from =
      new Date(today);

    from.setDate(
      from.getDate() - 180
    );


    const fromStr =
      from.toISOString().slice(0, 10);

    const toStr =
      today.toISOString().slice(0, 10);


    const MAX_PAGES = 3;

    const matches = [];


    for (let page = 0; page < MAX_PAGES; page++) {

      const cursor =
        page * 100;

      const url =
        `https://api.biorxiv.org/details/${server}/` +
        `${fromStr}/${toStr}/${cursor}/json`;


      let data;


      try {

        data =
          await fetchJson(url);

      } catch (error) {

        if (page === 0) {

          throw error;

        }

        break;

      }


      const collection =
        Array.isArray(data?.collection)
          ? data.collection
          : [];


      collection.forEach(
        record => {

          const haystack =
            `${record.title || ""} ${record.abstract || ""}`
              .toLowerCase();


          if (
            termWordGroups.some(
              words =>
                words.every(
                  word => haystack.includes(word)
                )
            )
          ) {

            matches.push(
              mapBiorxivFamilyRecord(
                record,
                server
              )
            );

          }

        }
      );


      if (collection.length < 100) {

        break;

      }

    }


    return matches;

  }


  function mapBiorxivFamilyRecord(record, server) {

    const doi =
      record.doi || "";

    const sourceName =
      server === "medrxiv"
        ? "medRxiv"
        : "bioRxiv";

    const authors =
      record.authors || "";


    return {

      id:
        doi
          ? `doi:${doi}`
          : `${server}:${record.doi || Date.now()}`,

      title:
        record.title || "Untitled",

      publication_date:
        record.date || "",

      authorship:
        authors,

      authorships:
        authors
          ? authors
              .split("; ")
              .map(
                name => ({
                  author: { display_name: name.trim() }
                })
              )
          : [],

      journal_name:
        sourceName,

      abstract_text:
        record.abstract || "",

      source_name:
        sourceName,

      primary_location: {

        landing_page_url:
          doi ? `https://doi.org/${doi}` : "#",

        source: {
          display_name: sourceName
        }

      },

      concepts:
        record.category ? [record.category] : [],

      type: "preprint",

      doi:
        doi ? `https://doi.org/${doi}` : "",

      pmid: ""

    };

  }


  async function searchBioRxiv(query) {

    return searchBiorxivFamily(
      "biorxiv",
      query
    );

  }


  async function searchMedRxiv(query) {

    return searchBiorxivFamily(
      "medrxiv",
      query
    );

  }


  // ==========================================
  // CORE
  // ------------------------------------------
  // CORE's v3 API requires a free API key (register at
  // https://core.ac.uk/services/api). Paste it below to
  // activate this source — until then it is treated as
  // "not configured" and simply contributes no results,
  // the same graceful way any other unavailable source
  // is handled.
  // ==========================================

  const CORE_API_KEY = "";


  async function searchCORE(query) {

    if (!CORE_API_KEY) {

      return [];

    }


    const params =
      new URLSearchParams();


    params.set("q", query);

    params.set("limit", "100");


    const url =
      "https://api.core.ac.uk/v3/search/works?" +
      params.toString();


    const data =
      await fetchJson(url, {

        headers: {
          Authorization: `Bearer ${CORE_API_KEY}`
        }

      });


    const items =
      Array.isArray(data?.results)
        ? data.results
        : [];


    return items.map(
      mapCoreRecord
    );

  }


  function mapCoreRecord(record) {

    const doi =
      record.doi || "";


    const authors =
      Array.isArray(record.authors)
        ? record.authors
            .map(author => author.name || "")
            .filter(Boolean)
            .join(", ")
        : "";


    const journal =
      record.publisher ||
      record.journals?.[0]?.title ||
      "";


    const publicationDate =
      record.publishedDate ||
      (
        record.yearPublished
          ? `${record.yearPublished}-01-01`
          : ""
      );


    return {

      id:
        doi
          ? `doi:${doi}`
          : `core:${record.id || Date.now()}`,

      title:
        record.title || "Untitled",

      publication_date:
        publicationDate,

      authorship:
        authors,

      authorships:
        authors
          ? authors
              .split(", ")
              .map(
                name => ({
                  author: { display_name: name.trim() }
                })
              )
          : [],

      journal_name:
        journal,

      abstract_text:
        record.abstract || "",

      source_name:
        "CORE",

      primary_location: {

        landing_page_url:
          record.downloadUrl ||
          (doi ? `https://doi.org/${doi}` : "") ||
          record.sourceFulltextUrls?.[0] ||
          "#",

        source: {
          display_name: journal
        }

      },

      concepts: [],

      type:
        normalizeDocumentType([record.documentType]),

      doi:
        doi ? `https://doi.org/${doi}` : "",

      pmid: "",

      cited_by_count:
        typeof record.citationCount === "number"
          ? record.citationCount
          : undefined

    };

  }


  // ==========================================
  // DOAJ
  // ==========================================

  async function searchDOAJ(query) {

    const url =
      `https://doaj.org/api/search/articles/${encodeURIComponent(query)}` +
      "?pageSize=100";


    const data =
      await fetchJson(url);


    const items =
      Array.isArray(data?.results)
        ? data.results
        : [];


    return items.map(
      mapDoajRecord
    );

  }


  function mapDoajRecord(record) {

    const bibjson =
      record.bibjson || {};


    const doiEntry =
      Array.isArray(bibjson.identifier)
        ? bibjson.identifier.find(
            item => item.type === "doi"
          )
        : null;

    const doi =
      doiEntry?.id || "";


    const authors =
      Array.isArray(bibjson.author)
        ? bibjson.author
            .map(author => author.name || "")
            .filter(Boolean)
            .join(", ")
        : "";


    const journal =
      bibjson.journal?.title || "";


    const year =
      bibjson.year || "";

    const month =
      bibjson.month
        ? String(bibjson.month).padStart(2, "0")
        : "01";

    const publicationDate =
      year ? `${year}-${month}-01` : "";


    const links =
      Array.isArray(bibjson.link)
        ? bibjson.link
        : [];

    const fulltextLink =
      links.find(link => link.type === "fulltext") ||
      links[0] ||
      null;


    return {

      id:
        doi
          ? `doi:${doi}`
          : `doaj:${record.id || Date.now()}`,

      title:
        bibjson.title || "Untitled",

      publication_date:
        publicationDate,

      authorship:
        authors,

      authorships:
        authors
          ? authors
              .split(", ")
              .map(
                name => ({
                  author: { display_name: name.trim() }
                })
              )
          : [],

      journal_name:
        journal,

      abstract_text:
        bibjson.abstract || "",

      source_name:
        "DOAJ",

      primary_location: {

        landing_page_url:
          fulltextLink?.url ||
          (doi ? `https://doi.org/${doi}` : "#"),

        source: {
          display_name: journal
        }

      },

      concepts:
        Array.isArray(bibjson.keywords)
          ? bibjson.keywords
          : [],

      type: "article",

      doi:
        doi ? `https://doi.org/${doi}` : "",

      pmid: ""

    };

  }


  // ==========================================
  // AGRIS (FAO)
  // ------------------------------------------
  // AGRIS does not currently expose a public JSON/CORS
  // search API — only an HTML results page, and
  // agris.fao.org's robots.txt disallows automated
  // access to it. AGRIS is fully wired into the
  // multi-source architecture (orchestration, dedup,
  // normalized shape, UI source label) so it will start
  // contributing results automatically the moment FAO
  // publishes a proper API; until then it deliberately
  // contributes no results rather than scraping a page
  // the site has asked automated tools not to access.
  // ==========================================

  async function searchAGRIS(query) {

    return [];

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
  // KEYWORD TERM MATCH (single keyword vs its
  // own selected fields)
  // ==========================================

  // ==========================================
  // WHOLE-WORD / WHOLE-PHRASE KEYWORD MATCH
  // ==========================================
  //
  // Prevents substring false-positives such as a
  // keyword "old" matching inside "holds", "bold",
  // "fold", or "older". Multi-word keywords (e.g.
  // "oxidative stress") are matched as a phrase —
  // boundaries are enforced only at the start and
  // end of the whole phrase, so internal whitespace
  // still matches normally.

  function keywordMatchesText(
    text,
    keyword
  ) {

    const term =
      String(keyword || "")
        .trim();


    if (!term) {

      return false;

    }


    const haystack =
      String(text || "");


    const escapedTerm =
      term.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );


    // Collapse any run of whitespace in the term so
    // "oxidative   stress" still matches normally-
    // spaced text.

    const pattern =
      escapedTerm.replace(
        /\s+/g,
        "\\s+"
      );


    let regex;

    try {

      regex =
        new RegExp(
          "\\b" + pattern + "\\b",
          "i"
        );

    } catch (error) {

      // Fall back to substring matching if the term
      // somehow produces an invalid pattern.

      return haystack
        .toLowerCase()
        .includes(
          term.toLowerCase()
        );

    }


    return regex.test(haystack);

  }


  function keywordTermMatches(
    item,
    fieldTextsMap,
    allText
  ) {

    const fields =
      Array.isArray(item?.fields)
        ? item.fields
        : [];


    const fieldTexts = [];


    if (fields.includes("title")) {

      fieldTexts.push(
        fieldTextsMap.title
      );

    }


    if (fields.includes("abstract")) {

      fieldTexts.push(
        fieldTextsMap.abstract
      );

    }


    if (fields.includes("authors")) {

      fieldTexts.push(
        fieldTextsMap.authors
      );

    }


    if (fields.includes("journal")) {

      fieldTexts.push(
        fieldTextsMap.journal
      );

    }


    if (fields.includes("concepts")) {

      fieldTexts.push(
        fieldTextsMap.concepts
      );

    }


    /*
     * If this particular keyword has no fields
     * selected, search across every field (same
     * fallback behavior as before groups existed).
     */

    const searchableText =
      fieldTexts.length > 0
        ? fieldTexts
            .join(" ")
            .toLowerCase()
        : allText;


    return keywordMatchesText(
      searchableText,
      item?.keyword
    );

  }


  // ==========================================
  // KEYWORD GROUP MATCH
  // (ANY = OR between its keywords,
  //  ALL = AND between its keywords)
  // ==========================================

  function keywordGroupMatches(
    group,
    fieldTextsMap,
    allText
  ) {

    const items =
      Array.isArray(group?.keywords)
        ? group.keywords
        : [];


    if (!items.length) {

      // An empty group imposes no constraint.

      return true;

    }


    const itemMatches =
      items.map(
        item =>
          keywordTermMatches(
            item,
            fieldTextsMap,
            allText
          )
      );


    return group?.mode === "all"
      ? itemMatches.every(Boolean)
      : itemMatches.some(Boolean);

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


  const fieldTextsMap = {

    title:
      title.toLowerCase(),

    abstract:
      abstract.toLowerCase(),

    authors:
      authors.toLowerCase(),

    journal:
      journal.toLowerCase(),

    concepts:
      concepts.toLowerCase()

  };


  // ========================================
  // EXCLUDED KEYWORDS
  // ========================================

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


    if (keywordMatchesText(allText, term)) {

      return false;

    }

  }


  // ========================================
  // REQUIRED KEYWORDS — GROUPS (AND / OR)
  // ========================================

  /*
   * keywordGroups is the current data model:
   *
   *   [
   *     { keywords: [{keyword, fields}, ...], mode: "any" | "all" },
   *     { keywords: [{keyword, fields}, ...], mode: "any" | "all" },
   *     ...
   *   ]
   *
   * Groups are always combined with AND. Inside a
   * group, "any" means OR between its keywords and
   * "all" means AND between its keywords. Each
   * keyword keeps its own field selection.
   */

  const keywordGroups =
    Array.isArray(
      safeCriteria.keywordGroups
    )
      ? safeCriteria.keywordGroups
      : [];


  if (keywordGroups.length > 0) {

    const allGroupsMatch =
      keywordGroups.every(
        group =>
          keywordGroupMatches(
            group,
            fieldTextsMap,
            allText
          )
      );


    if (!allGroupsMatch) {

      return false;

    }

  }


  // ========================================
  // REQUIRED KEYWORDS — LEGACY FORMATS
  // ========================================

  /*
   * Kept so tracking profiles saved before the
   * keyword-group feature existed keep matching
   * exactly the way they used to.
   */

  else if (
    Array.isArray(safeCriteria.keywordData) &&
    safeCriteria.keywordData.length > 0
  ) {

    const keywordData =
      safeCriteria.keywordData
        .filter(
          item =>
            item &&
            String(
              item.keyword || ""
            ).trim()
        )
        .map(
          item => ({

            keyword:
              String(
                item.keyword
              )
                .trim()
                .toLowerCase(),

            fields:
              Array.isArray(item.fields)
                ? item.fields
                : []

          })
        );


    const keywordMode =
      safeCriteria.keywordMode === "any"
        ? "any"
        : "all";


    const keywordMatches =
      keywordData.map(
        item =>
          keywordTermMatches(
            item,
            fieldTextsMap,
            allText
          )
      );


    if (keywordMode === "any") {

      if (
        !keywordMatches.some(Boolean)
      ) {

        return false;

      }

    } else {

      if (
        !keywordMatches.every(Boolean)
      ) {

        return false;

      }

    }

  }


  // ========================================
  // REQUIRED KEYWORDS — FLAT LEGACY FALLBACK
  // ========================================

  else {

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


    let searchableText =
      allText;


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
              keywordMatchesText(
                searchableText,
                keyword
              )
          );


        if (!anyMatch) {

          return false;

        }

      }

      else {

        const allMatch =
          keywords.every(
            keyword =>
              keywordMatchesText(
                searchableText,
                keyword
              )
          );


        if (!allMatch) {

          return false;

        }

      }

    }

  }


  // ========================================
  // AUTHOR
  // ========================================

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


  // ========================================
  // JOURNAL
  // ========================================

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


  // ========================================
  // RESEARCH FIELD
  // ========================================

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


  // ========================================
  // DATE RANGE
  // ========================================

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


  // ========================================
  // DOCUMENT TYPE
  // ========================================

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
      !paperType.includes(
        documentType
      )
    ) {

      return false;

    }

  }


  return true;

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

      ${ICONS.bell}
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

        <span class="badge badge-new">
          ${ICONS.bell} New
        </span>

      `;

    } else if (
      paper.isPreviouslySeenByTracker
    ) {

      badges += `

        <span class="badge badge-seen">
          ${ICONS.layers} Previously seen
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


    if (
      typeof paper.cited_by_count === "number" &&
      paper.cited_by_count >= 0
    ) {

      badges += `

        <span class="badge">
          Cited by ${paper.cited_by_count}
        </span>

      `;

    }


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
        class="paper-link"
        href="${escapeAttribute(link)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View paper ${ICONS.external}
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

    const safeCriteria =
      criteria || {};


    const hasGroups =
      Array.isArray(
        safeCriteria.keywordGroups
      ) &&
      safeCriteria.keywordGroups.length > 0;


    /*
     * Groups are combined with AND, which is
     * commutative, so the profile key sorts
     * groups (and the keywords within each
     * group) into a canonical order. That way
     * the same set of groups always produces
     * the same key, no matter what order they
     * were added in the UI.
     */

    const normalizedGroups =
      hasGroups
        ? safeCriteria.keywordGroups
            .map(
              group => ({

                mode:
                  group?.mode === "all"
                    ? "all"
                    : "any",

                keywords:
                  Array.isArray(group?.keywords)
                    ? group.keywords
                        .map(
                          item => ({

                            keyword:
                              normalizeString(
                                item?.keyword
                              ),

                            fields:
                              normalizeStringArray(
                                item?.fields
                              )

                          })
                        )
                        .filter(
                          item =>
                            item.keyword
                        )
                        .sort(
                          (a, b) =>
                            a.keyword.localeCompare(
                              b.keyword
                            )
                        )
                    : []

              })
            )
            .filter(
              group =>
                group.keywords.length > 0
            )
            .sort(
              (a, b) =>
                JSON.stringify(a)
                  .localeCompare(
                    JSON.stringify(b)
                  )
            )
        : [];


    const normalized = {

      keywordGroups:
        normalizedGroups,


      // Legacy fields, only populated when this
      // criteria object predates keyword groups.
      // Keeping them in the key means an old
      // tracker and a brand-new group-based
      // tracker never collide.

      keywords:
        !hasGroups
          ? normalizeStringArray(
              safeCriteria.keywords
            )
          : [],

      keywordData:
        !hasGroups &&
        Array.isArray(safeCriteria.keywordData)
          ? safeCriteria.keywordData
              .map(
                item => ({

                  keyword:
                    normalizeString(
                      item?.keyword
                    ),

                  fields:
                    normalizeStringArray(
                      item?.fields
                    )

                })
              )
              .sort(
                (a, b) =>
                  a.keyword.localeCompare(
                    b.keyword
                  )
              )
          : [],

      keywordFields:
        !hasGroups
          ? normalizeStringArray(
              safeCriteria.keywordFields
            )
          : [],

      keywordMode:
        safeCriteria.keywordMode === "any"
          ? "any"
          : "all",


      excluded:
        normalizeStringArray(
          safeCriteria.excluded
        ),

      author:
        normalizeString(
          safeCriteria.author
        ),

      journal:
        normalizeString(
          safeCriteria.journal
        ),

      field:
        normalizeString(
          safeCriteria.field
        ),

      dateRange:
        String(
          safeCriteria.dateRange || "all"
        )
          .trim()
          .toLowerCase(),

      documentType:
        normalizeString(
          safeCriteria.documentType
        ),

      accuracy:
        Number(
          safeCriteria.accuracy || 0
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

    const safeCriteria =
      criteria || {};


    const hasGroups =
      Array.isArray(
        safeCriteria.keywordGroups
      ) &&
      safeCriteria.keywordGroups.length > 0;


    const clonedGroups =
      hasGroups
        ? safeCriteria.keywordGroups.map(
            group => ({

              keywords:
                Array.isArray(group?.keywords)
                  ? group.keywords.map(
                      item => ({

                        keyword:
                          String(
                            item?.keyword || ""
                          ),

                        fields:
                          Array.isArray(item?.fields)
                            ? [...item.fields]
                            : []

                      })
                    )
                  : [],

              mode:
                group?.mode === "all"
                  ? "all"
                  : "any"

            })
          )
        : [];


    // Flat keyword list, regenerated from the
    // groups when present. Used to build the
    // free-text search query and for the
    // "is anything filled in" check — grouping
    // itself is preserved separately above.

    const flatKeywords =
      hasGroups
        ? clonedGroups.flatMap(
            group =>
              group.keywords.map(
                item =>
                  item.keyword
              )
          )
        : (
            Array.isArray(safeCriteria.keywords)
              ? [...safeCriteria.keywords]
              : []
          );


    const cloned = {

      keywordGroups:
        clonedGroups,

      keywords:
        flatKeywords,

      excluded:
        Array.isArray(safeCriteria.excluded)
          ? [...safeCriteria.excluded]
          : [],

      author:
        safeCriteria.author ||
        "",

      journal:
        safeCriteria.journal ||
        "",

      field:
        safeCriteria.field ||
        "",

      dateRange:
        safeCriteria.dateRange ||
        "all",

      documentType:
        safeCriteria.documentType ||
        "",

      accuracy:
        Number(
          safeCriteria.accuracy || 0
        )

    };


    // Preserve pre-migration fields verbatim so a
    // tracker saved before keyword groups existed
    // keeps using its original ALL/ANY behavior.

    if (!hasGroups) {

      if (
        Array.isArray(safeCriteria.keywordData)
      ) {

        cloned.keywordData =
          safeCriteria.keywordData.map(
            item => ({

              keyword:
                String(
                  item?.keyword || ""
                ),

              fields:
                Array.isArray(item?.fields)
                  ? [...item.fields]
                  : []

            })
          );

      }


      if (safeCriteria.keywordMode) {

        cloned.keywordMode =
          safeCriteria.keywordMode === "any"
            ? "any"
            : "all";

      }


      if (
        Array.isArray(safeCriteria.keywordFields)
      ) {

        cloned.keywordFields =
          [...safeCriteria.keywordFields];

      }

    }


    return cloned;

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

        icon: ICONS.help,

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

        icon: ICONS.clock,

        className: "tracker-status-never"

      };

    }


    if (lastNew > 0) {

      return {

        label:
          `${lastNew} new paper${lastNew === 1 ? "" : "s"}`,

        icon: ICONS.bell,

        className: "tracker-status-new"

      };

    }


    return {

      label: "No new papers",

      icon: ICONS.check,

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
    Array.isArray(criteria.keywordGroups) &&
    criteria.keywordGroups.length
  ) {

    topic =
      criteria.keywordGroups
        .map(group => {

          const words =
            Array.isArray(group.keywords)
              ? group.keywords
                  .map(item => item.keyword)
                  .filter(Boolean)
              : [];

          if (!words.length) {
            return "";
          }

          const joiner =
            group.mode === "all"
              ? " AND "
              : " OR ";

          const text =
            words.join(joiner);

          return words.length > 1
            ? `(${text})`
            : text;

        })
        .filter(Boolean)
        .join(" AND ");

  }

  if (!topic && Array.isArray(criteria.keywords) && criteria.keywords.length) {

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

    <div class="tracker-criteria-text tracker-topic-name">
      ${escapeHtml(topic)}
    </div>

  `;

}

  // ==========================================
  // TRACKER STATISTICS HTML
  // ==========================================

    // ==========================================
  // TRACKER STATISTICS HTML
  // ==========================================

  function buildTrackerStatisticsHtml(
    tracker
  ) {

    const papersTracked =
      getSeenCount(tracker);

    const newOnLastCheck =
      Number(
        tracker.lastCheckNewPapers || 0
      );

    const totalNewDiscovered =
      Number(
        tracker.totalNewPapers || 0
      );

    const lastChecked =
      tracker.lastChecked || "Never";

    return `

      <div class="tracker-readout">

        <div class="tracker-readout-cell">
          <span class="tracker-readout-value">${papersTracked}</span>
          <span class="tracker-readout-label">Papers tracked</span>
        </div>

        <div class="tracker-readout-cell${newOnLastCheck > 0 ? " tracker-readout-cell-active" : ""}">
          <span class="tracker-readout-value">${newOnLastCheck}</span>
          <span class="tracker-readout-label">New last check</span>
        </div>

        <div class="tracker-readout-cell">
          <span class="tracker-readout-value">${totalNewDiscovered}</span>
          <span class="tracker-readout-label">Total discovered</span>
        </div>

        <div class="tracker-readout-cell tracker-readout-cell-date">
          <span class="tracker-readout-value tracker-readout-date">${escapeHtml(lastChecked)}</span>
          <span class="tracker-readout-label">Last checked</span>
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

  const trackers = getAdvancedTrackers();

  if (!trackers.length) {

    trackedTopics.innerHTML = `
      <div class="card tracker-empty">
        <div class="section-eyebrow">${ICONS.flask}<span>My tracked research</span></div>
        <h2>No research profiles yet</h2>
        <p>
          Build an Advanced Research Tracker below to start
          monitoring a topic — new matching papers will appear
          here every time you check it.
        </p>
      </div>
    `;

    return;
  }

  const activeCount =
    trackers.filter(
      tracker => Number(tracker.lastCheckNewPapers || 0) > 0
    ).length;

  trackedTopics.innerHTML = `

    <div class="card tracker-dashboard">

      <div class="tracker-dashboard-header">
        <div class="section-eyebrow">${ICONS.flask}<span>My tracked research</span></div>
        <h2>Research monitors</h2>
        <p class="tracker-dashboard-sub">
          ${trackers.length} profile${trackers.length === 1 ? "" : "s"} being watched
          ${activeCount > 0 ? `&nbsp;·&nbsp; <span class="tracker-dashboard-highlight">${activeCount} with new results</span>` : ""}
        </p>
      </div>

      <div class="tracker-list">

        ${trackers.map((tracker, index) => {

          const trackerId = escapeAttribute(tracker.id || "");
          const specimenNumber = String(index + 1).padStart(2, "0");

          return `

            <article
              class="tracked-topic tracker-card"
              data-tracker-id="${trackerId}"
            >

              <div class="tracker-card-header">

                <div class="tracker-card-title">
                  <span class="tracker-specimen-no">${specimenNumber}</span>
                  <h3 class="tracker-id-label">
                    ${escapeHtml(getTrackerShortLabel(tracker))}
                  </h3>
                </div>

                <div class="tracker-card-status">
                  ${getTrackerStatusHtml(tracker)}
                </div>

              </div>

              <div class="tracker-section">
                ${buildTrackerStatisticsHtml(tracker)}
              </div>

              <div class="tracker-actions">

                <button
                  type="button"
                  class="ghost-button view-tracker-button"
                  data-tracker-id="${trackerId}"
                >
                  ${ICONS.eye} View results
                </button>

                <button
                  type="button"
                  class="ghost-button check-tracker-button"
                  data-tracker-id="${trackerId}"
                >
                  ${ICONS.refresh} Check now
                </button>

                <button
                  type="button"
                  class="ghost-button ghost-button-danger delete-tracker-button"
                  data-tracker-id="${trackerId}"
                >
                  ${ICONS.trash} Delete
                </button>

              </div>

            </article>

          `;

        }).join("")}

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


    // ----------------------------------------
    // NEW FORMAT: keyword groups
    // ----------------------------------------

    if (
      Array.isArray(criteria.keywordGroups) &&
      criteria.keywordGroups.length
    ) {

      const groupLabels =
        criteria.keywordGroups
          .map(
            group => {

              const words =
                Array.isArray(group.keywords)
                  ? group.keywords
                      .map(
                        item =>
                          item.keyword
                      )
                      .filter(Boolean)
                  : [];


              if (!words.length) {

                return "";

              }


              const joiner =
                group.mode === "all"
                  ? " AND "
                  : " OR ";


              const text =
                words.join(joiner);


              return words.length > 1
                ? `(${text})`
                : text;

            }
          )
          .filter(Boolean);


      if (groupLabels.length) {

        const combined =
          groupLabels.join(" AND ");


        return combined.length > 60
          ? `${combined.slice(0, 57)}...`
          : combined;

      }

    }


    // ----------------------------------------
    // LEGACY FORMAT: flat keywords
    // ----------------------------------------

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
                  Tracker deleted
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
        Tracker not found
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
          Invalid tracking profile
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
      "Checking tracked research…",
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
            No matching papers
          </h2>

          <p>
            No papers currently match
            this tracking profile.
            The tracker was checked successfully.
          </p>

          ${buildTrackerStatisticsHtml(tracker)}

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
          ? `Tracked research — ${check.newPapers.length} new`
          : "Tracked research — no new papers"
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
          ${Math.min(10, markedPapers.length)}
          of
          ${markedPapers.length}
          papers

        `;

        counter.insertAdjacentHTML(
          "afterend",
          buildTrackerStatisticsHtml(tracker)
        );

      }


    } catch (error) {

      console.error(
        "Tracking search error:",
        error
      );


      showMessage(`

        <h2>
          Tracking search failed
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

  // Start the Advanced Research Tracker with one
  // empty keyword group so the AND/OR UI is ready
  // to use right away.

  createKeywordGroup();


  updateAdvancedFiltersSummary();


  displayTrackedTopics();

});
