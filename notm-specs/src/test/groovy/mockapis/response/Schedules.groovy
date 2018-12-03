package mockapis.response

import groovy.json.JsonOutput

import java.time.LocalDate
import java.time.format.DateTimeFormatter

class Schedules {

  static final TODAY_DATE = LocalDate.now()
  static final TODAY = TODAY_DATE.format(DateTimeFormatter.ISO_LOCAL_DATE)

  static final TOMORROW_DATE = LocalDate.now().plusDays(1)
  static final TOMORROW = TOMORROW_DATE.format(DateTimeFormatter.ISO_LOCAL_DATE)

  static final activity1_1 = [
    offenderNo      : "A1234AJ",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    cellLocation    : "LEI-A-1-1",
    event           : "PA",
    eventDescription: "Prison Activities",
    comment         : "Activity 1",
    startTime       : TOMORROW + "T09:00:00",
    endTime         : TOMORROW + "T10:30:00",
    locationId      : 2,
    excluded        : false,
  ]

  static final activity1_2 = [
    offenderNo      : "A1234AJ",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    cellLocation    : "LEI-A-1-1",
    event           : "PA",
    eventDescription: "Prison Activities",
    comment         : "Activity 2",
    startTime       : TOMORROW + "T14:00:00",
    endTime         : TOMORROW + "T15:30:00",
    locationId      : 2,
    excluded        : true
  ]

  static final activity1_3 = [
    offenderNo      : "A1234AJ",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    cellLocation    : "LEI-A-1-1",
    event           : "PA",
    eventDescription: "Prison Activities",
    comment         : "Activity 3",
    startTime       : TOMORROW + "T17:00:00",
    endTime         : TOMORROW + "T18:30:00",
    locationId      : 2
  ]

  static final appointment1 = [
    offenderNo      : "A1234AJ",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    cellLocation    : "LEI-A-1-1",
    comment         : "Appt details",
    event           : "MEDE",
    eventDescription: "Appointment 1",
    startTime       : TOMORROW + "T15:30:00",
    locationId      : 4
  ]

  static final visit = [
    offenderNo      : "A1234AJ",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    cellLocation    : "LEI-A-1-1",
    event           : "VISIT",
    eventType       : "VISIT",
    eventStatus     : "SCH",
    eventDescription: "Visits",
    comment         : "Friends",
    startTime       : TOMORROW + "T18:00:00",
    endTime         : TOMORROW + "T18:30:00",
  ]
  static final visitCanc = [
    offenderNo      : "A1234AJ",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    cellLocation    : "LEI-A-1-1",
    event           : "VISIT",
    eventType       : "VISIT",
    eventStatus     : "CANC",
    eventDescription: "Visit Canc",
    comment         : "Friends",
    startTime       : TOMORROW + "T18:30:00",
    endTime         : TOMORROW + "T18:45:00",
  ]

  static final externalTransfer1 = [
    eventDescription: "Transfer to high security prison",
    eventStatus     : "SCH",
    eventType       : "COURT",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    offenderNo      : "A1234AJ",
    startTime       : TOMORROW
  ]

  static final externalTransfer2 = [
    eventDescription: "Transfer to high sec - cancelled",
    eventStatus     : "CANC",
    eventType       : "COURT",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    offenderNo      : "A1234AJ",
    startTime       : TOMORROW
  ]

  static final courtEvent1 = [
    event           : "19",
    eventDescription: "Court Appearance - Police Product Order",
    eventId         : 349360017,
    eventStatus     : "SCH",
    eventType       : "COURT",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    offenderNo      : "A1234AJ",
    startTime       : TOMORROW + "T15:00:00"
  ]

  static final courtEvent2 = [
    event           : "19",
    eventDescription: "Court Appearance - Police Product Order",
    eventId         : 349360019,
    eventStatus     : "CANC",
    eventType       : "COURT",
    firstName       : "ARTHUR",
    lastName        : "ANDERSON",
    offenderNo      : "A1234AJ",
    startTime       : TOMORROW + "T14:00:00"
  ]

  static final sentence1 = [
    offenderNo    : "A1234AJ",
    sentenceDetail: [releaseDate: TOMORROW]
  ]

  static final sentenceOther = [
    offenderNo    : "A1234AJ",
    sentenceDetail: [releaseDate: '2018-11-25']
  ]

  static final courtEventsResponse = JsonOutput.toJson([
    courtEvent1,
    courtEvent2,
  ])

  static final externalTransfersResponse = JsonOutput.toJson([
    externalTransfer1,
    externalTransfer2,
  ])

  static final sentences = JsonOutput.toJson([
    sentence1,
    sentenceOther,
  ])

  static final activities = JsonOutput.toJson([
    activity1_1,
    activity1_2,
    activity1_3,
  ])
  static final visits = JsonOutput.toJson([
    visit,
    visitCanc
  ])
  static final appointments = JsonOutput.toJson([
    appointment1
  ])
}
