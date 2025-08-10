console.log(`CODE00000000 version 001`);

// window.y = document.y = document.querySelector("html").y;

const y: any = ((window as any).y = (document as any).y = {});
setInterval(() => {
    (window as any).y = (document as any).y = y;
}, 300);
console.log(`CODE00000000 y`, (window as any).y);
console.log(`CODE00000000 y`, (document as any).y);

interface HiddenElementExt {
    keepFirstVisible: boolean;
    selector: any;
    cpl: string;
}

const MINDFULL_YT_KEY: "__mindfull_youtube" = "__mindfull_youtube";
interface HiddenElementWithExt {
    __mindfull_youtube: HiddenElementExt;
}

const y_hidden_elements: Set<HTMLElement & HiddenElementWithExt> = (y.hidden_elements = new Set<any>());
function printHiddenWithSelectors() {
    console.log(`CODE00000000 All hidden elements:`, y_hidden_elements);
    for (let element of y_hidden_elements) {
        console.log(`CODE00000000 Hidden element: `, element[MINDFULL_YT_KEY].cpl, element[MINDFULL_YT_KEY].selector, element);
    }
}
setTimeout(printHiddenWithSelectors, 8000);

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

interface YHideOpts {
    keepFirst?: number;
    show?: boolean;
}

function yHideElementInternal(element: HTMLElement) {
    const v_hidden = !!element[MINDFULL_YT_KEY]?.keepFirstVisible;
    if (v_hidden) {
        element.hidden = true;
        if (element.style) {
            element.style.display = "none";
        }
        y_hidden_elements.add(element as any);
        // document.removeChild(element);
    }

    exportY(element);
}

function yHide(cpl: string, cssSelectorOrElement: string | Element | null, keepFirstVisible?: boolean) {
    let firstFound = false;
    if (typeof cssSelectorOrElement === "string") {
        for (let element of document.querySelectorAll(cssSelectorOrElement) as any as Iterable<HTMLElement>) {
            if (!element[MINDFULL_YT_KEY]) {
                element[MINDFULL_YT_KEY] = { keepFirstVisible: !firstFound, selector: cssSelectorOrElement, cpl };
                firstFound = true;
            }

            yHideElementInternal(element);
        }
    } else if (!cssSelectorOrElement) {
        return;
    } else {
        const element = cssSelectorOrElement as HTMLElement;
        if (!element[MINDFULL_YT_KEY]) {
            element[MINDFULL_YT_KEY] = {
                // keepFirstVisible: !firstFound,
                selector: cssSelectorOrElement,
                cpl,
            };
            // firstFound = true;
        }
        yHideElementInternal(element);
    }
}

let consoleLogsLeft = 50;

function switchYoutubeMusicToAudio(): void {
    // Find the <ytmusic-player> element in the DOM
    const playerElement = document.querySelector<HTMLElement>("ytmusic-player");

    if (playerElement) {
        // Check if the element has the expected ID and playback-mode attribute
        if (playerElement.id === "player" && playerElement.getAttribute("playback-mode") === "OMV_PREFERRED") {
            // Change the playback-mode attribute to ATV_PREFERRED
            playerElement.setAttribute("playback-mode", "ATV_PREFERRED");
            console.log("Playback mode switched to ATV_PREFERRED.");
        }
    }
}

let exportY_done = false;
function exportY(element0: HTMLElement) {
    if (exportY_done) {
        return;
    }
    let element = element0;
    while (element.parentElement) {
        element = element.parentElement;
    }
    if (!(element as any).y) {
        (element as any).y = y;
        exportY_done = true;
        console.log(`CODE00000000 exportY_done`, element);
    }
}

function hideEvilElements() {
    const isOnMainPage = document.location.href.endsWith(".com/");

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
        // "youtube.com/shorts/": visibleElements.shortsAll,
        "youtube.com/feed/explore": visibleElements.navigationPage,
    };

    // /html/body/ytd-app/div[1]/ytd-page-manager/ytd-shorts/div[3]/div[2]/div[2]
    //<div class="reel-video-in-sequence-new style-scope ytd-shorts" style="--ytd-shorts-player-ratio: 0.5625" id="8" overlay-density="1">
    //           <div class="reel-video-in-sequence-thumbnail style-scope ytd-shorts" style="background-image:url(&quot;https://i.ytimg.com/vi/pq6-B4TzoHY/frame0.jpg&quot;);">
    //           </div>
    //         </div>

    const forbiddenSelectors = {
        ".ytp-endscreen-content": visibleElements.nextVideos,
        ".ytd-watch-flexy#secondary": visibleElements.nextVideos,
        '[href="/feed/explore"]': visibleElements.navigationPage,
        // '[Title="Shorts"]': visibleElements.shortsAll,
        // ".ytd-shorts": visibleElements.shortsAll,
        // '[Title="Ваши видео"]':visibleElements.shortsAll,
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

    if (!document.location.href.includes("youtube.com")) {
        return;
    }

    switchYoutubeMusicToAudio();

    if (document.location.href.includes("music.youtube.com")) {
        return;
    }

    // Hide notifications
    yHide("CODE00000001", "ytd-notification-topbar-button-renderer", false);

    // Hide mini sidebar
    yHide("CODE00000002", "ytd-mini-guide-renderer", false);

    const selectedTabElem = document.querySelector("[aria-selected=true]") as HTMLElement | null;
    const selectedTabName = (selectedTabElem && selectedTabElem.innerText) || "";

    let contentVisible = true;

    for (const forbiddenUrl in forbiddenUrls) {
        const doHide = !forbiddenUrls[forbiddenUrl];
        if (doHide && document.location.href.includes(forbiddenUrl) && document.body) {
            contentVisible = false;
        }
    }

    if (isOnMainPage && !visibleElements.mainPageVideos) {
        contentVisible = false;
    }

    let allSidebarItems = document.querySelectorAll("ytd-guide-entry-renderer") as any;
    for (const forbiddenText in forbiddenSidebarItems) {
        if (!forbiddenSidebarItems[forbiddenText]) {
            for (const sideBarItem of allSidebarItems) {
                if (sideBarItem.innerText.includes(forbiddenText)) {
                    yHide("CODE00000003", sideBarItem, false);
                }
            }
        }
    }

    for (const selector in forbiddenSelectors) {
        const doHide = !forbiddenUrls[selector];

        if (doHide) {
            yHide("CODE00000004", selector, false);
        }
    }

    // if (!visibleElements.shortsAll || !visibleElements.shortsNext) {

    const shortsContainer = document.querySelector<HTMLElement>("#page-manager > ytd-shorts");
    if (document.location.href.includes("/shorts/") && shortsContainer && !shortsContainer.hidden) {
        const firstShortVideo0 = shortsContainer.querySelector("div.ytd-shorts");
        if (firstShortVideo0) {
            const firstShortVideo = firstShortVideo0; //.parentElement;
            const shortsDiv = document.createElement("div") as HTMLDivElement;
            shortsDiv.id = MINDFULL_YT_KEY + "_shorts";
            firstShortVideo.parentElement.removeChild(firstShortVideo);
            // shortsContainer.parentElement.insertBefore(shortsContainer, firstShortVideo);
            shortsContainer.parentElement.prepend(shortsDiv);
            // shortsContainer.parentElement.appendChild(shortsDiv);
            shortsDiv.appendChild(firstShortVideo);
            yHideElementInternal(shortsContainer);
        }
    }

    // yHide("CODE00000005", ".ytd-shorts", true);
    // yHide("CODE00000015", "div.ytd-shorts", true);
    // }

    let nextVideosR = false;
    // if (!visibleElements.nextVideos || !visibleElements.shortsAll) {
    //     yRemove("ytd-reel-video-renderer", { keepFirst: !visibleElements.shortsAll ? 0 : 1 });
    //     nextVideosR = true;
    // }

    let mainPageVideosR = false;
    if (!visibleElements.mainPageVideos) {
        if (isOnMainPage) {
            yHide("CODE00000006", "#contents");
        }
        mainPageVideosR = true;
    }

    let nextCommentsR = false;
    if (!visibleElements.nextComments) {
        const keepFirst = 3;
        let { itemsLeft } = yRemove("ytd-comment-thread-renderer", { keepFirst });
        if (itemsLeft >= keepFirst) {
            yRemove("#more-replies");
            yRemove("ytd-continuation-item-renderer");
        }
        nextCommentsR = true;
    }

    if (consoleLogsLeft-- > 0) {
        // console.log("hideEvilElements", { isOnMainPage, contentVisible, nextVideosR, mainPageVideosR, nextCommentsR });
    }

    if (!contentVisible) {
        yHide("CODE00000007", "#page-manager");
    }
}

function onVideoStart(e) {
    console.log("CODE00000000 onVideoStart", e);
    const fromUser = (navigator as any).userActivation.isActive;
    console.log("CODE00000000 onVideoStart", { fromUser });

    if (!fromUser) {
        console.log("CODE00000000 Auto-play detected, pausing...");
        e.target.pause();
    }

    //debugger;
}

function onVideoPaused() {
    console.log("CODE00000000 onVideoPaused");
}

function onVideoStopped() {
    console.log("CODE00000000 onVideoStopped");
}

function onVideoPlaying() {
    console.log("CODE00000000 onVideoPlaying");
}

function allVidePlayers() {
    return document.querySelectorAll("video.html5-main-video");
}

function pauseAllVideos() {
    for (let element of allVidePlayers() as any) {
        element?.pause();
    }
}

window.addEventListener("yt-navigate-finish", () => {
    console.log("CODE00000000 Navigation happened — pausing video");
    pauseAllVideos();
});

function attachToAllVideoPlayers() {
    for (let element of allVidePlayers() as any) {
        if (!element.addEventListener || element[MINDFULL_YT_KEY]) {
            continue;
        }
        element[MINDFULL_YT_KEY] = {};
        element.addEventListener("play", onVideoStart, { capture: true });
        element.addEventListener("pause", onVideoPaused, { capture: true });
        element.addEventListener("stop", onVideoStopped, { capture: true });
        element.addEventListener("playing", onVideoPlaying, { capture: true });
    }
}

setInterval(attachToAllVideoPlayers, 300);
attachToAllVideoPlayers();
pauseAllVideos();
for (let i = 0; i < 20; i++) {
    setTimeout(pauseAllVideos, i * 300);
}
