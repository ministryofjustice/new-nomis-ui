import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeDriverService
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.logging.LoggingPreferences
import org.openqa.selenium.remote.DesiredCapabilities

atCheckWaiting = true

waiting {
  timeout = 10
}

environments {
  chrome {
    driver = { new ChromeDriver() }
  }

  chromeHeadless {
    driver = {
      DesiredCapabilities capabilities = DesiredCapabilities.chrome()
      ChromeOptions options = new ChromeOptions()
      options.addArguments('headless')
      options.setExperimentalOption("prefs", ["browser.custom_chrome_frame": false])
      capabilities.setCapability(ChromeOptions.CAPABILITY, options)
      LoggingPreferences logPrefs = new LoggingPreferences()
      logPrefs.enable(BROWSER, ALL)
      capabilities.setCapability(LOGGING_PREFS, logPrefs)

      new ChromeDriver(options)
    }
  }

  chromeMobile {
    driver = {
      new ChromeDriver(
        new ChromeDriverService.Builder()
          .withVerbose(true)
          .withLogFile(new File('build/chromedriver.log'))
          .build(),
        new ChromeOptions()
          .setExperimentalOption(
          "mobileEmulation",
          ['deviceName': 'Nexus 5']))
    }
  }
}

// Default if geb.env is not set to one of 'chrome', or 'chromeHeadless'
driver = {
  new ChromeDriver()
//  new ChromeDriver(
//    new ChromeDriverService.Builder()
//      .withVerbose(true)
//      .withLogFile(new File('build/chromedriver.log'))
//      .build(),
//    new ChromeOptions()
//      .setExperimentalOption(
//      "mobileEmulation",
//      ['deviceName': 'Nexus 5']))
}

baseUrl = "http://localhost:3007/"

reportsDir = "build/geb-reports"
reportOnTestFailureOnly=true

// Close browser on shutdown - uncomment to enable
quitCachedDriverOnShutdown = false
