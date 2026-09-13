const quickForm = document.querySelector("#quickRequestForm");
const quickInput = document.querySelector("#quickRequest");
const suggestionButtons = document.querySelectorAll("[data-suggestion]");
const draftPanel = document.querySelector("#draftPanel");
const draftDialog = document.querySelector(".draft-dialog");
const draftRequest = document.querySelector("#draftRequest");
const draftLocation = document.querySelector("#draftLocation");
const draftTiming = document.querySelector("#draftTiming");
const draftBudget = document.querySelector("#draftBudget");
const requestSummary = document.querySelector("#requestSummary");
const copySummary = document.querySelector("#copySummary");
const copyStatus = document.querySelector("#copyStatus");
const closeButtons = document.querySelectorAll("[data-close-draft]");

let lastFocusedElement = null;

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
].join(",");

function clean(value) {
    return value.trim().replace(/\s+/g, " ");
}

function buildSummary() {
    const request = clean(draftRequest.value) || "Not specified yet";
    const location = clean(draftLocation.value) || "Optional / not added";
    const timing = clean(draftTiming.value) || "Optional / not added";
    const budget = clean(draftBudget.value) || "Optional / not added";

    return [
        "AVAMRU request draft",
        "",
        `Request: ${request}`,
        `Location: ${location}`,
        `Timing: ${timing}`,
        `Budget: ${budget}`,
        "",
        "Status: Draft only. This has not been sent."
    ].join("\n");
}

function updateSummary() {
    requestSummary.textContent = buildSummary();
    copyStatus.textContent = "";
}

function openDraft(startingRequest) {
    lastFocusedElement = document.activeElement;
    draftRequest.value = clean(startingRequest);
    draftLocation.value = "";
    draftTiming.value = "";
    draftBudget.value = "";
    updateSummary();

    draftPanel.hidden = false;
    document.body.classList.add("panel-open");
    draftDialog.focus();
}

function closeDraft() {
    draftPanel.hidden = true;
    document.body.classList.remove("panel-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}

function trapFocus(event) {
    if (event.key !== "Tab" || draftPanel.hidden) {
        return;
    }

    const focusable = Array.from(draftDialog.querySelectorAll(focusableSelector));
    if (!focusable.length) {
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

quickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const request = clean(quickInput.value);

    if (!request) {
        quickInput.focus();
        return;
    }

    openDraft(request);
});

suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        quickInput.value = button.dataset.suggestion;
        quickInput.focus();
    });
});

[draftRequest, draftLocation, draftTiming, draftBudget].forEach((field) => {
    field.addEventListener("input", updateSummary);
});

closeButtons.forEach((button) => {
    button.addEventListener("click", closeDraft);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !draftPanel.hidden) {
        closeDraft();
    }

    trapFocus(event);
});

copySummary.addEventListener("click", async () => {
    const text = buildSummary();

    try {
        await navigator.clipboard.writeText(text);
        copyStatus.textContent = "Copied.";
    } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(requestSummary);
        selection.removeAllRanges();
        selection.addRange(range);
        copyStatus.textContent = "Summary selected. Press Ctrl+C to copy.";
    }
});
