let allFocusableElements;
let firstFocusableElement;

export function trapFocusInDialog(dialog) {
    allFocusableElements = dialog.querySelectorAll(
        'a[href]:not([disabled]), button[type="button"]:not([disabled]), button[type="submit"]:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
        );
    firstFocusableElement = allFocusableElements[0];
    dialog.addEventListener('keydown', captureTabbing);
}

function captureTabbing(event) {
    const lastFocusableElement = allFocusableElements[allFocusableElements.length-1];
    if (!checkForTabPressed(event)) {
        return;
    }
    if (event.shiftKey) {
        checkForFirstFocusableElement(firstFocusableElement, lastFocusableElement, event);
    } else {
        checkForLastFocusableElement(firstFocusableElement, lastFocusableElement, event);
    }
}

function checkForFirstFocusableElement(firstInteractiveElement, lastInteractiveElement, event) {
    if (document.activeElement === firstInteractiveElement) {
      lastInteractiveElement.focus();
      event.preventDefault();
    }
}

function checkForLastFocusableElement(firstInteractiveElement, lastInteractiveElement, event) {
    if (document.activeElement === lastInteractiveElement) {
      firstInteractiveElement.focus();
      event.preventDefault();
    }
}

function checkForTabPressed(event) {
    return event.key === 'Tab' || event.keyCode === 9;
}