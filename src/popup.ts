import { getStorage } from './storage'
import { cleanDomain } from './util'

// when popup is loaded, setup event listeners
document.addEventListener('DOMContentLoaded', () => {
  // setup listener for toggle
  const toggleSwitch: HTMLInputElement = document.querySelector(
    '#reflect-toggle'
  ) as HTMLInputElement
  toggleSwitch.addEventListener('change', toggleState, false)

  // get current state and set approriately
  getStorage().then((storage) => {
    // set toggle state to storage value
    toggleSwitch.checked = storage.isEnabled
    setupBlockListener(storage.blockedSites)
  })
})

// function to update background with current toggle state
function toggleState(e) {
  const port: chrome.runtime.Port = chrome.runtime.connect({
    name: 'toggleState',
  })

  port.postMessage({ state: e.target.checked })
  port.disconnect()
}

// updates the popup button when blocked or unblocked
function updateButton(unblock: boolean) {
  document.getElementById('block').innerHTML = unblock ? 'block page.' : 'unblock page.'
  document.getElementById('block').style.borderRadius = unblock ? '5px 0 0 5px' : '5px'
  document.getElementById('dropdown').style.display = unblock ? 'block' : 'none'
}

// setup listener for what block button should do
function setupBlockListener(blockedSites: string[]) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const urls: string[] = tabs.map((x) => x.url)
    const domain: string = cleanDomain(urls)
    const url: string = cleanDomain(urls, true)

    // not on a page (probably new tab)
    if (domain === '') {
      document.getElementById('curDomain').textContent = 'none.'
      return
    }

    document.getElementById('curDomain').textContent = domain

    // initial popup button configuration
    let exact = false
    if (blockedSites.includes(domain)) {
      updateButton(false)
    } else if (blockedSites.includes(url)) {
      updateButton(false)
      exact = true
    }

    //document.getElementById('block').innerHTML = getButtonText(domain, url, blockedSites)
    document.getElementById('block').addEventListener('click', () => {
      const port: chrome.runtime.Port = chrome.runtime.connect({
        name: 'blockFromPopup',
      })

      // toggle state text and update background script
      const buttonText: string = document.getElementById('block').innerHTML
      if (buttonText === 'block page.') {
        port.postMessage({ unblock: false, siteURL: domain })
        updateButton(false)
      } else {
        port.postMessage({ unblock: true, siteURL: exact ? url : domain })
        updateButton(true)
      }

      // cleanup connection
      port.disconnect()
    })

    document.getElementById('blockPath').addEventListener('click', () => {
      const port: chrome.runtime.Port = chrome.runtime.connect({
        name: 'blockFromPopup',
      })

      // toggle state text and update background script
      const buttonText: string = document.getElementById('block').innerHTML
      if (buttonText === 'block page.') {
        port.postMessage({ unblock: false, siteURL: url })
        updateButton(false)
      }

      // cleanup connection
      port.disconnect()
    })

    document.getElementById('blockPath').style.display = 'none'

    /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
    document.getElementById('dropdown').addEventListener('click', () => {
      const dropdown: HTMLElement = document.getElementById('blockPath')
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none'
    })

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event: MouseEvent) {
      const target: HTMLElement = event.target as HTMLElement
      if (!target.matches('#dropdown')) {
        const dropdown: HTMLElement = document.getElementById('blockPath')
        dropdown.style.display = 'none'
      }
    }
  })
}
