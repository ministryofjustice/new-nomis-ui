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
      options.addArguments('headless', '--lang=en-GB');
      options.setExperimentalOption("prefs", ['browser.custom_chrome_frame': false, 'intl.accept_languages': 'en-GB'])
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
          .addArguments('--lang=en-GB')
          .setExperimentalOption('mobileEmulation', ['deviceName': 'Nexus 5'])
          .setExperimentalOption('prefs', ['intl.accept_languages': 'en-GB']))
    }
  }
}

// Default if geb.env is not set to one of 'chrome', or 'chromeHeadless'
driver = {
  new ChromeDriver()
}

baseUrl = "http://localhost:3007/"

reportsDir = "build/geb-reports"
reportOnTestFailureOnly = true

// Close browser on shutdown - uncomment to enable
// quitCachedDriverOnShutdown = false
