
// replace current page with reflect block page
function loadBlockPage(): void {
  const strippedURL: string = '';
  const prompt_page_url: string = chrome.runtime.getURL('res/pages/prompt.html')
  const options_page_url: string = chrome.runtime.getURL('res/pages/options.html')
}

function addFormListener(strippedURL: string): void {
  const form: HTMLFormElement | null = document.forms.namedItem('inputForm')
  const button: HTMLElement | null = document.getElementById('submitButton')

  // add listener for form submit
  form?.addEventListener('submit', (event) => {
    // prevent default submit
    event.preventDefault()

    // change button to loading state
    button?.setAttribute('disabled', 'disabled')

    // extract entry
    const intentForm: HTMLFormElement | null = event.target as HTMLFormElement
    const intent: FormDataEntryValue = new FormData(intentForm).get('intent')
    const intentString: string = intent.toString()

    callBackgroundWithIntent(intentString, strippedURL)
  })
}

function callBackgroundWithIntent(intent: string, url: string): void {
  // open connection to runtime (background.ts)
  const port: chrome.runtime.Port = chrome.runtime.connect({
    name: 'intentStatus',
  })

  // send message then wait for response
  port.postMessage({ intent: intent, url: window.location.href })
  port.onMessage.addListener((msg) => {
    switch (msg.status) {
      case 'ok':
        // show success message
        // getStorage().then((storage) => {
        //   const WHITELIST_PERIOD: number = storage.whitelistTime
        //   displayStatus(`got it! ${WHITELIST_PERIOD} minutes starting now.`, 3000, REFLECT_INFO)
        //   location.reload()
        // })
        break

      case 'too_short':
        invalidIntent('your response is a little short. be more specific!')
        break

      case 'invalid':
        invalidIntent("that doesn't seem to be productive. try being more specific.")
        break
    }

    // change button back to normal state
    const button: HTMLElement | null = document.getElementById('submitButton')
    button?.removeAttribute('disabled')

    const accepted: string = msg.status === 'ok' ? 'yes' : 'no'
    const intentDate: Date = new Date()
    // logIntentToStorage(intent, intentDate, url, accepted)

    // close connection
    port.disconnect()
  })
}

function invalidIntent(msg: string) {
  $('#inputFields').effect('shake', { times: 3, distance: 5 })
  // displayStatus(msg, 3000, REFLECT_ERR)
  $('#textbox').val('')
}
