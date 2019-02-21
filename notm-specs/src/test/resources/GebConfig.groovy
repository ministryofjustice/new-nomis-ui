import geb.report.CompositeReporter
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeDriverService
import org.openqa.selenium.chrome.ChromeOptions

atCheckWaiting = true

waiting {
  timeout = 8
}

environments {
  chrome {
    driver = { new ChromeDriver() }
  }

  chromeHeadless {
    driver = {
      ChromeOptions options = new ChromeOptions()
      options.addArguments('headless')
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
}

baseUrl = "http://localhost:3000/"

reportsDir = "build/geb-reports"

// Don't report anything
reporter = new CompositeReporter();

// Close browser on shutdown - uncomment to enable
// quitCachedDriverOnShutdown = false
