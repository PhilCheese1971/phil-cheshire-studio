const body = document.body;
const html = document.documentElement;
const dialogTriggers = document.querySelectorAll("[data-dialogtrigger]");
let verticalWindowScrollPosition;
dialogTriggers.forEach((currentDialog) => {
    currentDialog.addEventListener("click", () => {
        const getCurrentDialogTarget = currentDialog.getAttribute("data-target");
        const dialog = document.querySelector("[data-name=" + getCurrentDialogTarget + "]");
        if (dialog.hasAttribute("open")) {
            closeCurrentDialog(dialog);
        } else {
            addPaddingToBodyToReplaceScrollbar(dialog);
            dialog.showModal();
            closeDialogOnBackdropClick(dialog);
            closeCurrentDialogOnPressingEscapeKey(dialog);
            setDialogFocusElements(dialog)
        }
    });
});

function closeCurrentDialog(dialog) {
    dialog.close('dismiss');
    resetDialogChanges(dialog);
}

function setDialogFocusElements(dialog) {
    const firstFocusableElement = dialog.querySelector('.close-button');
    setTimeout(() => {
        firstFocusableElement.focus();
    }, 200);
    //trapFocusInDialog(dialog);
}

function closeCurrentDialogOnPressingEscapeKey(dialog) {
    dialog.addEventListener('keydown', (event) => {
        if (event.keyCode === 27) {
            closeCurrentDialog(dialog);
            event.stopPropagation();
        }
    }); 
}

function closeDialogOnBackdropClick(dialog) {
    dialog.addEventListener("click", ({target:dialog}) => {
        if (dialog.nodeName === 'DIALOG') {
            closeCurrentDialog(dialog);
        }
    });
}

function addPaddingToBodyToReplaceScrollbar(dialog) {
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    body.style.paddingRight = scrollbarWidth + 'px';
    maintainWindowPosition(dialog);
}

function setBodyScrollLock(open) {
    body.classList[open ? 'add' : 'remove']('width-100', 'position-fixed');
}

function maintainWindowPosition(dialog) {
    verticalWindowScrollPosition = window.pageYOffset;
    setTopPosition(body)
    html.style.scrollBehavior = "auto";
    document.addEventListener('touchmove', stopBodyScrollOnMobile, {passive: false});
    setBodyScrollLock(true);
}

function setTopPosition(element) {
    element.style.top = (verticalWindowScrollPosition * -1) + 'px';
}

const stopBodyScrollOnMobile = (event) => {
    event.preventDefault();
}

function resetDialogChanges(dialog) {
    setBodyScrollLock(false);
    window.scrollTo(0, verticalWindowScrollPosition);
    body.removeAttribute('style');
    html.removeAttribute('style');
    dialog.removeAttribute('style');
    document.removeEventListener('touchmove', stopBodyScrollOnMobile);
}
