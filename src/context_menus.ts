// context_menus.ts is a module whose only job is to create the browser context menus

// closure around createContextMenus to ensure
// it will only ever be called once
export default () => {
  var setupBefore: boolean = false
  return () => {
    if (!setupBefore) {
      setupBefore = true
      createContextMenus()
    }
  }
}

function createContextMenus(): void {
  // browser actions
  chrome.contextMenus.create({
    id: 'baAddToFilterList',
    title: 'Block this:',
    contexts: ['browser_action'],
  })

  chrome.contextMenus.create({
    parentId: 'baAddToFilterList',
    id: 'baAddSiteToFilterList',
    title: 'Page',
    contexts: ['browser_action'],
  })

  chrome.contextMenus.create({
    parentId: 'baAddToFilterList',
    id: 'baAddDomainToFilterList',
    title: 'Domain',
    contexts: ['browser_action'],
  })

  chrome.contextMenus.create({
    id: 'pgAddToFilterList',
    title: 'Block this:',
    contexts: ['page'],
  })

  chrome.contextMenus.create({
    parentId: 'pgAddToFilterList',
    id: 'pgAddSiteToFilterList',
    title: 'Page',
    contexts: ['page'],
  })

  chrome.contextMenus.create({
    parentId: 'pgAddToFilterList',
    id: 'pgAddDomainToFilterList',
    title: 'Domain',
    contexts: ['page'],
  })
}
