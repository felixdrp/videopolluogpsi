const webdriver = require('selenium-webdriver')
const {
  By,
  Condition,
  until,
} = webdriver
const path = require('path');
const assert = require('assert')

const {
  POLLING_TIME_INTERVAL,
  FAREWELL_TEXT,
} = require('../config')
const DEFAULT_AWAIT_TIME = POLLING_TIME_INTERVAL / 2

const appPath = path.join(__dirname, '..');
const driver = new webdriver.Builder()
  // The "9515" is the port opened by chrome driver.
  .usingServer('http://localhost:9515')
  .withCapabilities({
    chromeOptions: {
      // Here is the path to your Electron binary.
      binary: 'node_modules/electron/dist/electron',
      args: ['--app='+appPath]
    }
  })
  .forBrowser('electron')
  .build()

const TestName = {
  firstname: 'TestName',
  surname: 'TestSurename',
}

async function test() {
  let rootDiv
  let playPause
  let finish = false
  let videoStatus
  let formStatus
  let farewellStatus
  let pollList
  let submit
  try {
    // Set user
    await driver.findElement(By.id('firstname')).sendKeys(TestName.firstname)
    await driver.findElement(By.id('surname')).sendKeys(TestName.surname)
    await driver.findElement(By.id('nextStep')).click()

    // Wait for video to appear.
    rootDiv = await driver.findElement(By.id('root'))
    playPause = await driver.findElement(By.id('playPause'))
    // First load take time to compile babel.
    await driver.wait(until.elementIsVisible(playPause), 5000);
    playPause.click()
  } catch (error) {
    console.log(error)
  }

  // Wait for:
  //  form,
  //  video change,
  //  experiment end.
  // let form = await driver.findElement(By.id('pollForm'))

  do {
    let videoPaused = false
    videoStatus = await driver.findElement(By.id('videoMain'))
    if (videoStatus) {
      videoPaused = await videoStatus.getAttribute('paused') || false
    }

    formStatus = driver.wait(
      new Condition( 'hola', async (w) => await driver.findElement(By.id('pollForm')) ),
      // until.elementIsVisible(form),
      DEFAULT_AWAIT_TIME
    )

    try {
      formStatus = await formStatus
    } catch (error) {
      formStatus = false
    }

    // Check experiment ended
    farewellStatus = driver.wait(until.elementTextIs(rootDiv, FAREWELL_TEXT), DEFAULT_AWAIT_TIME)
    try {
      farewellStatus = await farewellStatus
      finish = true
    } catch (error) {
      farewellStatus = false
    }

    // New video need first play
    if (videoPaused && formStatus === false) {
      playPause = await driver.findElement(By.id('playPause'))
      // First load take time to compile babel.
      await driver.wait(until.elementIsVisible(playPause), 5000);
      playPause.click()
    }

    // Awaiting poll submit?
    if (videoPaused && formStatus) {
      // Fill form and submit
      try {
        pollList = await driver.findElements(By.name('poll'))
        submit = await driver.findElement(By.id('submitButton'))

        pollList[Math.floor(Math.random() * pollList.length)].click()
        submit.click()
      }  catch (error) {
        console.log(error)
      }

      // debugger
    }

    // debugger
  } while(!finish)


}

test()
