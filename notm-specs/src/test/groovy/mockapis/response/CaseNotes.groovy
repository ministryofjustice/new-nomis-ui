package mockapis.response

class CaseNotes {

  static def getCaseNotes =

    [
      "content"         : [
        [
          "caseNoteId"        : "1",
          "offenderIdentifier": "A1234AJ",
          "type"              : "CHAP",
          "typeDescription"   : "Chaplaincy",
          "subType"           : "FAITH",
          "subTypeDescription": "Faith Specific Action",
          "source"            : "EXT",
          "creationDateTime"  : "2018-05-16T13:18:09.915",
          "occurrenceDateTime": "2017-10-31T14:38:53",
          "authorUsername"    : "1111111",
          "authorName"        : "User, Api",
          "text"              : "Case note body text",
          "locationId"        : "MDI",
          "amendments"        : []
        ],
        [
          "caseNoteId"        : "-5",
          "offenderIdentifier": "A1234AJ",
          "type"              : "COMMS",
          "typeDescription"   : "Communication",
          "subType"           : "COM_OUT",
          "subTypeDescription": "Communication OUT",
          "source"            : "EXT",
          "creationDateTime"  : "2017-05-06T17:11:00",
          "occurrenceDateTime": "2017-05-06T17:11:00",
          "authorUsername"    : "111111",
          "authorName"        : "User, Api",
          "text"              : "Test outward communication one.",
          "locationId"        : "MDI",
          "amendments"        : []
        ]
      ],
      "pageable"        : [
        "sort"      : [
          "sorted"  : true,
          "unsorted": false,
          "empty"   : false
        ],
        "pageSize"  : 10,
        "pageNumber": 0,
        "offset"    : 0,
        "paged"     : true,
        "unpaged"   : false
      ],
      "totalPages"      : 1,
      "totalElements"   : 2,
      "last"            : false,
      "number"          : 0,
      "size"            : 20,
      "numberOfElements": 20,
      "sort"            : [
        "sorted"  : true,
        "unsorted": false,
        "empty"   : false
      ],
      "first"           : true,
      "empty"           : false
    ]
}