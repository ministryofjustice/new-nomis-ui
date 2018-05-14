import org.openqa.selenium.chrome.ChromeDriver
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
          ChromeOptions options = new ChromeOptions()
          Map<String, String> mobileEmulation = new HashMap<>()

          mobileEmulation.put("deviceName", "Nexus 5")

          options.setExperimentalOption("mobileEmulation", mobileEmulation)
         
          new ChromeDriver(options)
        }
    }
}

// Default if geb.env is not set to one of 'chrome', or 'chromeHeadless'
driver = {
    new ChromeDriver()
}

baseUrl = "http://localhost:3000/"

reportsDir = "build/geb-reports"