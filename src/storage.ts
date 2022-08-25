// storage.ts provides a thin wrapper around the chrome storage api to make it easier to read/write from it
// you can also find helper functions that read/write to chrome storage

import { Storage, Intent } from './types'
import { addMinutes, cleanDomain } from './util'

// helper function to retrive chrome storage object
// usage:
//
// getStorage(null).then(storage => {
//     ...
// })
export function getStorage(): Promise<Storage> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (storage) => {
      if (chrome.runtime.lastError !== undefined) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(storage)
      }
    })
  })
}

// helper function to set fields in chrome storage
// usage:
//
// getStorage({enableBlobs: false}).then(storage => {
//     ...
// })
export function setStorage(key: Storage): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(key, () => {
      if (chrome.runtime.lastError !== undefined) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}

// Add a single url to blocklist (does nothing if url is already in list)
export function addToBlocked(url: string, callback?: () => any): void {
  getStorage().then((storage) => {
    // url = cleanDomain([url]) === '' ? url : cleanDomain([url])
    if (!storage.blockedSites.includes(url)) {
      storage.blockedSites.push(url)
      setStorage({ blockedSites: storage.blockedSites }).then(() => {
        console.log(`${url} added to blocked sites`)
        callback ? callback() : () => {}
      })
    }
  })
}

// Remove single url from blocklist (does nothing if url is not in list)
export function removeFromBlocked(url: string): void {
  getStorage().then((storage) => {
    let blockedSites: string[] = storage.blockedSites
    blockedSites = blockedSites.filter((e) => e !== url)
    setStorage({ blockedSites: blockedSites }).then(() => {
      console.log(`removed ${url} from blocked sites`)
    })
  })
}

// Add a single url to whitelist with associated whitelist duration
// (replaces any existing entries)
export function addToWhitelist(url: string, minutes: number): void {
  getStorage().then((storage) => {
    let whitelistedSites: { [key: string]: string } = storage.whitelistedSites
    let expiry: Date = addMinutes(new Date(), minutes)
    whitelistedSites[url] = expiry.toJSON()

    setStorage({ whitelistedSites: whitelistedSites }).then(() => {
      console.log(`${url} added to whitelisted sites`)
    })
  })
}

export function logIntentToStorage(
  intentString: string,
  intentDate: Date,
  url: string,
  accepted: string
): void {
  getStorage().then((storage) => {
    let intentList: { [key: string]: Intent } = storage.intentList

    // getting oldest date value from intent list map
    let oldest_date: Date = new Date()
    for (const rawDate in intentList) {
      const date: Date = new Date(rawDate)
      if (date < oldest_date) {
        oldest_date = date
      }
    }

    // deleting oldest intent to keep intent count under limit
    if (Object.keys(intentList).length > storage.numIntentEntries) {
      console.log(`list full, popping ${oldest_date.toJSON()}`)
      delete intentList[oldest_date.toJSON()]
    }

    // adding new intent and date to intent list
    intentList[intentDate.toJSON()] = {
      intent: intentString,
      url: url,
      accepted: accepted,
    }

    // saving intentList to chrome storage
    setStorage({ intentList: intentList }).then(() => {
      console.log(`logged intent "${intentString}"`)
    })
  })
}
