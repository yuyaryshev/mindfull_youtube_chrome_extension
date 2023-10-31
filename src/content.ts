hideEvilElements();

// re-check page everytime this page gets focus again
window.addEventListener("focus", hideEvilElements);
setInterval(hideEvilElements, 300);

interface YRemoveOpts {
    keepFirst?: number;
}

function yRemove(a: any, opts: YRemoveOpts = {}) {
    if (typeof a === "string") {
        a = document.querySelectorAll(a);
    }

    let itemsLeft = 0;
    if (!a) {
        return;
    }

    if (a.forEach) {
        // console.log("CURRENT_DEBUG0001", { a });
        let keepFirst = opts.keepFirst || 0;
        for (let elem of a) {
            if (keepFirst-- > 0) {
                itemsLeft++;
                // console.log("CURRENT_DEBUG0002", { keepFirst, a, itemsLeft, elem, cond: elem.constructor.name });
                continue;
            }
            if (elem.remove) {
                // console.log("CURRENT_DEBUG0003", { keepFirst, a, itemsLeft, elem, cond: elem.constructor.name });
                elem.remove();
            }
        }
    } else if (a.remove) {
        a.remove();
    }

    return { itemsLeft };
}

function hideEvilElements() {
    function setElementVisibility(cssSelectorOrElement: string | Element | null, visible: boolean) {
        const element: Element | null =
            typeof cssSelectorOrElement === "string" ? document.querySelector(cssSelectorOrElement) : cssSelectorOrElement;
        if (element) {
            (element as HTMLElement).hidden = !visible;
        }
    }

    const visibleElements = {
        nextVideos: false,
        mainPageVideos: false,
        subscriptionVideosRightPane: false,
        navigationPage: false,
        shortsAll: true,
        shortsNext: false,
        visibleElements: false,
        yourVideos: false,
        nextComments: false,
        other: false,
    };

    const forbiddenUrls = {
        "youtube.com/shorts/": visibleElements.shortsAll,
        "youtube.com/feed/explore": visibleElements.navigationPage,
    };

    const forbiddenSelectors = {
        ".ytp-endscreen-content": visibleElements.nextVideos,
        ".ytd-watch-flexy#secondary": visibleElements.nextVideos,
        '[href="/feed/explore"]': visibleElements.navigationPage,
        '[Title="Shorts"]': visibleElements.shortsAll,
        // '[Title="Ваши видео"]':visibleElements.shortsAll,
    };

    const forbiddenTabs = {
        ["Главная"]: visibleElements.mainPageVideos,
    };

    const forbiddenSidebarItems = {
        ["Ваши видео"]: visibleElements.yourVideos,
        ["Навигатор"]: visibleElements.navigationPage,
        ["Подписки"]: visibleElements.subscriptionVideosRightPane,
        ["Shorts"]: visibleElements.shortsAll,
        ["Творческая студия"]: visibleElements.other,
        ["YouTube TV"]: visibleElements.other,
        ["Видеоигры"]: visibleElements.other,
        ["Трансляции"]: visibleElements.other,
        ["Спорт"]: visibleElements.other,
        ["Игры"]: visibleElements.other,
        ["Фильмы"]: visibleElements.other,
        ["Библиотека"]: visibleElements.other,
    };

    if (!document.location.href.includes("youtube.com") || document.location.href.includes("music.youtube.com")) {
        return;
    }

    // Hide notifications
    setElementVisibility("ytd-notification-topbar-button-renderer", false);

    // Hide mini sidebar
    setElementVisibility("ytd-mini-guide-renderer", false);

    const selectedTabElem = document.querySelector("[aria-selected=true]") as HTMLElement | null;
    const selectedTabName = (selectedTabElem && selectedTabElem.innerText) || "";

    let contentVisible = true;

    if (selectedTabName === "") {
        contentVisible = false;
    }

    for (const forbiddenUrl in forbiddenUrls) {
        const doHide = !forbiddenUrls[forbiddenUrl];
        if (doHide && document.location.href.includes(forbiddenUrl) && document.body) {
            contentVisible = false;
        }
    }

    if (forbiddenTabs.hasOwnProperty(selectedTabName) && !forbiddenTabs[selectedTabName]) {
        contentVisible = false;
    }
    setContentVisibility(contentVisible);

    if (!contentVisible) {
        return;
    }

    let allSidebarItems = document.querySelectorAll("ytd-guide-entry-renderer") as any;
    for (const forbiddenText in forbiddenSidebarItems) {
        if (!forbiddenSidebarItems[forbiddenText]) {
            for (const sideBarItem of allSidebarItems) {
                if (sideBarItem.innerText.includes(forbiddenText)) {
                    setElementVisibility(sideBarItem, false);
                }
            }
        }
    }

    function setContentVisibility(visible) {
        setElementVisibility("#page-manager", visible);
        if (!visible) {
            // stopVideo();
        }
    }

    for (const selector in forbiddenSelectors) {
        const doHide = !forbiddenUrls[selector];

        if (doHide) {
            setElementVisibility(document.querySelector(selector), false);
        }
    }

    if (!visibleElements.nextVideos || !visibleElements.shortsAll) {
        yRemove("ytd-reel-video-renderer", { keepFirst: !visibleElements.shortsAll ? 0 : 1 });
    }

    if (document.location.href.endsWith(".com/") && !visibleElements.mainPageVideos) {
        yRemove("#contents");
    }

    if (!visibleElements.nextComments) {
        const keepFirst = 3;
        let { itemsLeft } = yRemove("ytd-comment-thread-renderer", { keepFirst });
        if (itemsLeft >= keepFirst) {
            yRemove("#more-replies");
            yRemove("ytd-continuation-item-renderer");
        }
    }
}
