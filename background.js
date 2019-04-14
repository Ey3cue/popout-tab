
if (chrome) { browser = chrome }

const togglePopout = () => {
  // Get the current active tab (not popup)
  browser.tabs.query({ currentWindow: true, active: true, windowType: 'normal' }, tabs => {
    // If we got something...
    if (tabs.length) {
      // The current tab is a tab (not a popup); open it as a popup
      browser.windows.create({ tabId: tabs[0].id, type: 'popup', width: 1000, height: 700 })
    } else {
      // The current tab might be a popup (not a tab)
      browser.tabs.query({ currentWindow: true, active: true, windowType: 'popup' }, tabs => {
        // If it's a popup...
        if (tabs.length) {
          // Get the "main" window; we'll assume this is the first normal type
          browser.windows.getAll({ windowTypes: ['normal'] }, (windows) => {
            if (windows.length) {
              // Move the popup to the main window
              browser.tabs.move(tabs[0].id, { windowId: windows[0].id, index: -1 }, tab => {
                // Activate it, since it was active when we moved it
                browser.windows.update(windows[0].id, { focused: true })
                browser.tabs.update(tabs[0].id, { active: true })
              })
            }
          })
        }
      })
    }
  })
}

browser.browserAction.onClicked.addListener(togglePopout)
browser.commands.onCommand.addListener(command => {
  if (command === 'toggle_popout') { togglePopout() }
})

browser.contextMenus.create({ title: 'Toggle Popout', contexts: ['page'], onclick: togglePopout })
