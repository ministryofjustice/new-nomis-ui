package specs

import geb.spock.GebReportingSpec

import static org.openqa.selenium.logging.LogType.BROWSER

class BrowserReportingSpec extends GebReportingSpec {
  void cleanup() {
    try {
      driver.executeScript("console.log('Test finished')")
      def logEntries = driver.manage().logs().get(BROWSER).all
      println "START WebDriver $BROWSER logs"
      logEntries.each {
        println(it)
      }
      println "END WebDriver $BROWSER logs"
    } catch (error) {
      error.printStackTrace()
    }
  }
}
