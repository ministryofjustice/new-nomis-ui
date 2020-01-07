package mockapis.response

class CaseNoteTypes {
  static def referenceCaseNoteTypes =
    [
      [
        domain     : "TASK_TYPE",
        code       : "ACP",
        description: "Accredited Programme",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ASSESSMENT",
            description: "Assessment",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CONS_WRK",
            description: "Consolidation Work",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GEN_VISIT",
            description: "General Visit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GS",
            description: "Group Session",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POEM",
            description: "Post Programme Evaluation Measure",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POS5",
            description: "Post Programme OM Session five",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POS4",
            description: "Post Programme OM Session four",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POS1",
            description: "Post Programme OM Session one",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POS6",
            description: "Post Programme OM Session six",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POS3",
            description: "Post Programme OM Session three",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POS2",
            description: "Post Programme OM Session two",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPREP",
            description: "Post Programme Report",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPREPC",
            description: "Post Programme Report Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPR",
            description: "Post Programme Review meeting",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPRM",
            description: "Post Programme Review Meeting",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPS5",
            description: "Pre Programme OM Session five",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPS4",
            description: "Pre Programme OM Session four",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPS1",
            description: "Pre Programme OM Session one",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPS6",
            description: "Pre Programme OM Session six",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPS3",
            description: "Pre Programme OM Session three",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPS2",
            description: "Pre Programme OM Session two",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPEM",
            description: "Pre-Programme Evaluation Measure",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PROG_FIN",
            description: "Programme Finish",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PROG_START",
            description: "Programme Start",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RE-VISIT",
            description: "Re-Visit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SOU",
            description: "Statement Of Understanding Signed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TSP_SESSION",
            description: "TSP 'Catch up' Session",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "ACHIEVEMENTS",
        description: "Achievements",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CIAS",
            description: "CIAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "EDUCATION",
            description: "Education",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GYM",
            description: "Gym",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "H&S",
            description: "Health and Safety",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IMB",
            description: "IMB",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LNG & SKILLS",
            description: "Learning and Skills",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REGIMES",
            description: "Regimes",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VIOLENCE RED",
            description: "Violence Reduction",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VISITS",
            description: "Visits",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKSHOPS",
            description: "Workshops / Work Areas",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "ATR",
        description: "Alcohol Treatment Requirement",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "TCOUN",
            description: "Alcohol Counselling Session",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "AREH-C",
            description: "Alcohol Rehab - community",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "AREH-R",
            description: "Alcohol Rehab - residential",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ATEST",
            description: "Alcohol Test",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ATREA",
            description: "Alcohol Treatment Session",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ATRIATP",
            description: "Initial Appointment with treatment provi",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ATRRTO",
            description: "Report to Office",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ATRRTTP",
            description: "Report To Treatment Provider",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "ALERT",
        description: "Alert",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ACTIVE",
            description: "Made Active",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "INACTIVE",
            description: "Made Inactive",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "APP",
        description: "Appointment",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "OUTCOME",
            description: "Outcome of Schedule",
            activeFlag : "N",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "BR",
        description: "Breach",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "BRP",
            description: "Breach Report Sent to Breach Unit/Court",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CCD",
            description: "Confirm Court Date",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "OMIC",
        description: "OMiC",
        source     : "OCNS",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "TEST_OMIC",
            description: "Omic Case Note",
            source     : "OCNS",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "CNOTE",
        description: "Case Note",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "FWD",
            description: "Forwarded",
            activeFlag : "N",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "CHAP",
        description: "Chaplaincy",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "BERSERILL",
            description: "Bereavement/Serious illness",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "COMLINKS",
            description: "Community Links",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FAITH",
            description: "Faith Specific Action",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FAMMAR",
            description: "Family Contacts/Marriage",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GPS",
            description: "General Pastoral Support",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HSY",
            description: "Healthcare / Statutory",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OPV",
            description: "OPV Requests",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RECSTAT",
            description: "Reception/Statutory Duty",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SSY",
            description: "Segregation / Statutory",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "COMMS",
        description: "Communication",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "COM_IN",
            description: "Communication IN",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "COM_OUT",
            description: "Communication OUT",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CUST",
            description: "Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FINANCE",
            description: "Finance",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MAIL ROOM",
            description: "Mail Room",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SECURITY",
            description: "Security",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "CAB",
        description: "Conduct & Behaviour",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CIAS",
            description: "CIAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CUST",
            description: "Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DIVERSITY",
            description: "Diversity",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "EDUCATION",
            description: "Education",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GYM",
            description: "Gym",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IMB",
            description: "IMB",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LNG & SKILLS",
            description: "Learning and Skills",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MDT",
            description: "MDT",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RECEPTION",
            description: "Reception",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REGIMES",
            description: "Regimes",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VID LINK",
            description: "Video Link",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VISITS",
            description: "Visits",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKSHOPS",
            description: "Workshops / Work Areas",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "CRT",
        description: "Court",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "CRTPSI",
            description: "Post Sentence Interview",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "CVM",
        description: "Custodial Violence Management Model",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMC",
            description: "Alerts Closed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMO",
            description: "Alerts Open",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMB",
            description: "Behaviour Monitoring",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMDOC",
            description: "CVM Document Saved",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMG",
            description: "General",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMI",
            description: "Intervention Care Plan",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMK",
            description: "Key Worker Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMM",
            description: "Monitoring Care Plan",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMR",
            description: "Referral",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMV",
            description: "Violence Reduction Investigation Report",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "DRR",
        description: "Drug Rehabilitation Requirement",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "DCOUN",
            description: "Drug Counselling Session",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DREH-R",
            description: "Drug Rehab - residential",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DTEST",
            description: "Drug Test",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DTREA",
            description: "Drug Treatment Session",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DRRIATP",
            description: "Initial Appointment w.Treatment Provider",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ITP",
            description: "Initial Appointment with Treatment Provi",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DRRRTO",
            description: "Report to Office",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DRRRTTP",
            description: "Report To Treatment Provider",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "DSPD",
        description: "DSPD Offender",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMREF",
            description: "Offender Manager Referral sent",
            activeFlag : "N",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "EARNED_HDC",
        description: "Earned HDC Scheme",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ACTIVITY_ATT",
            description: "Activity Attendance at Private Prison",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "ETE",
        description: "Education, Training and Employment",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ETERTO",
            description: "Report to Office",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ETERTTP",
            description: "Report to Third Party",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "EN",
        description: "Enforcement",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "CSUA2",
            description: "ACO Warning Letter",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CSUA",
            description: "Confirm 2nd UA/UB + Breach Action Taken",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CFUA",
            description: "Confirm First Warning",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FTA1LTR",
            description: "Explanation Letter following 1st FTA/FTC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FTA2LTR",
            description: "Explanation Letter following 2nd FTA/FTC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FTA3LTR",
            description: "Explanation Letter following 3rd FTA/FTC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RW1",
            description: "Rescind Warning",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RW2",
            description: "Rescind Warning following Second FTA/FTC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RW3",
            description: "Rescind Warning following Third FTA/ FTC",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "Incentive level ENTRY",
        description: "Entry Level Incentive level information",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ENTRY ASSESS",
            description: "Entry Level Incentive level Assessment information",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ENTRY REVIEW",
            description: "Entry Level Incentive level Review Information",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ENTRY WARN",
            description: "Entry Level Incentive level Warning Information",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "GEN",
        description: "General",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "HIST",
            description: "History Sheet Entry",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HIS",
            description: "History Sheet Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OSE",
            description: "Offender Supervisor Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESET",
            description: "Resettlement",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "INTERVENTION",
        description: "Interventions",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ACTIVITY",
            description: "Activities",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CUST",
            description: "Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DIVERSITY",
            description: "Diversity",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FINANCE",
            description: "Finance",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MAIL ROOM",
            description: "Mail Room",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OCA",
            description: "OCA",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SECURITY",
            description: "Security",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VIOLENCE RED",
            description: "Violence Reduction",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VISITS",
            description: "Visits",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "KA",
        description: "Key Worker Activity",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "KE",
            description: "Key Worker Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "KS",
            description: "Key Worker Session",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "LAB_ALLOC",
        description: "Labour Allocation",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "LAB_APP",
            description: "Labour Application",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "LTR",
        description: "Letter",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "FO",
            description: "From Offender",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LTRFO",
            description: "From Offender",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FTP",
            description: "From Third Party",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LTRFTP",
            description: "From Third Party",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TO",
            description: "To Offender",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LTRTO",
            description: "To Offender",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TTP",
            description: "To Third Party",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LTRTTP",
            description: "To Third Party",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "MCHECK",
        description: "Management Check",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "MCHECK",
            description: "Management Check",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "MHT",
        description: "Mental Health Treatment Requirement",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "MHTIATP",
            description: "Initial Appointment w.Treatment Provider",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ITP",
            description: "Initial Appointment with Treatment Provi",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MHTRTO",
            description: "Report to Office",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MHTRTTP",
            description: "Report To Treatment Provider",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "NCS",
        description: "National Career Service",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "FOLLOW-UP",
            description: "Follow-up",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IND",
            description: "Induction",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PRE-RELEASE",
            description: "Pre-release",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "NEG",
        description: "Negative Behaviour",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "BEHAVEWARN",
            description: "Behaviour Warning",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "NEG_GEN",
            description: "General Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IEP_WARN",
            description: "Incentive level Warning",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKWARN",
            description: "Work Effort Warning",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "OBSERVE",
        description: "Observations",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "EDUCATION",
            description: "Education",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OBS_GEN",
            description: "General Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GYM",
            description: "Gym",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IMB",
            description: "IMB",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LNG & SKILLS",
            description: "Learning and Skills",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "NEWS",
            description: "News from Home",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RECEPTION",
            description: "Reception",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SECURITY",
            description: "Security",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "THREAT_PR",
            description: "Threats to Prisoners",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "THREAT_ST",
            description: "Threats to Staff",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VID LINK",
            description: "Video Link",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VISITS",
            description: "Visits",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKSHOPS",
            description: "Workshops / Work Areas",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "OM",
        description: "Offender Management",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ASSIGN_OM",
            description: "Assign/Reassign Offender Manager",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "PADVIS",
        description: "Personal Advisor",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "PAV",
            description: "Visit",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "PA",
        description: "Planned Appointments",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "PACC",
            description: "Case conference",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CRI",
            description: "Court Report Interview",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HV",
            description: "Home Visit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "APV",
            description: "Hostel or Approved Premises Visit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "INI",
            description: "Initial Appointment with OM",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PAIAOM",
            description: "Initial Appointment with OM",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MM",
            description: "MAPPA meeting",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MAPPA",
            description: "MAPPA meeting",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PV",
            description: "Prison Visit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PARTO",
            description: "Report to Office",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PARTTP",
            description: "Report to Third Party",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WTP",
            description: "With Third Party",
            activeFlag : "N",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "POS",
        description: "Positive Behaviour",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "POS_GEN",
            description: "General Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IEP_ENC",
            description: "Incentives Encouragement",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "QUAL_ATT",
            description: "Quality Attitude",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "QUAL_WK",
            description: "Quality Work",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "PRISON",
        description: "Prison",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "RELEASE",
            description: "Release",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "TRANSFER",
        description: "Prison Transfer",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "FROMTOL",
            description: "From/ To Location",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "REC",
        description: "Recall",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "RECRP",
            description: "Recall Report Prepared",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "REPORT",
        description: "Report",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "BRCOMP",
            description: "Breach Report Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CIAS",
            description: "CIAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REPORT_COMPL",
            description: "Court Report Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REPORT_DONE",
            description: "Court Report Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CRTREPREQ",
            description: "Court Report Request",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REPORT_DUE",
            description: "Court Report Requested",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CRTREV",
            description: "Court Review Report Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CUST",
            description: "Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DEFSENT",
            description: "Deferred Sentence Report Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DIVERSITY",
            description: "Diversity",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DRRASS",
            description: "DRR Suitability Assessment Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "EDUCATION",
            description: "Education",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FTPSR",
            description: "Fast Track PSR Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FINANCE",
            description: "Finance",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GYM",
            description: "Gym",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "H&S",
            description: "Health and Safety",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LNG & SKILLS",
            description: "Learning and Skills",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MAIL ROOM",
            description: "Mail Room",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MDT",
            description: "MDT",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OCA",
            description: "OCA",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PRCOMP",
            description: "Parole Report Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POE",
            description: "Personal Officer Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LSP1F",
            description: "Post Sentence Report LSP1F Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REGIMES",
            description: "Regimes",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SECURITY",
            description: "Security",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "STDPSR",
            description: "Standard Delivery PSR Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VIOLENCE RED",
            description: "Violence Reduction",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKSHOPS",
            description: "Workshops / Work Areas",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "REPORTS",
        description: "Reports",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REP_GEN",
            description: "General Report",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REP_IEP",
            description: "Incentive level Report",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REP_WNG",
            description: "Wing Conduct Report",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "REQUIREMENT",
        description: "Requirement",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "REQTERM",
            description: "Requirement Terminated",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "SENTENCE",
        description: "Sentence",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "IMPOSED",
            description: "Imposed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SENTERM",
            description: "Terminated",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "SC",
        description: "Social Care",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "SC",
            description: "Social Care",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "SA",
        description: "Specified Activity Requirement",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAITP",
            description: "Initial Appointment with Activity Provid",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ITP",
            description: "Initial Appointment with Treatment Provi",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SARTO",
            description: "Report to Office",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SARTTP",
            description: "Report to Third Party",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "SUPERVISION",
        description: "Supervision",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "SUPREQTERM",
            description: "Terminated",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "SUPPLAN",
        description: "Supervision Plan",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ISPCOMP",
            description: "Initial Sentence Plan Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RSPCOMP",
            description: "Review Sentence Plan Completed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TSPCOMP",
            description: "Termination Sentence Plan Completed",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "TC",
        description: "Telephone call",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "FO",
            description: "From Offender",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TCFO",
            description: "From Offender",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FTP",
            description: "From Third Party",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TCFTP",
            description: "From Third Party",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TO",
            description: "To Offender",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TCTO",
            description: "To Offender",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TTP",
            description: "To Third Party",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TCTTP",
            description: "To Third Party",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "TRNG",
        description: "Training",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "TRNGALL",
            description: "ALLOCATED (State Course in Case Notes)",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TRNGCOM",
            description: "COMPLETED (State Course in Case Notes)",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TRNGREM",
            description: "REMOVED(Put Reason/Course in Case Notes)",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "UW",
        description: "Unpaid Work",
        activeFlag : "N",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "PSI",
            description: "Post Sentence Interview",
            activeFlag : "N",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "UWTERM",
            description: "Terminated",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "UPC",
        description: "Unplanned contact",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "UPCRTO",
            description: "Report to Office",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "UPCRTTP",
            description: "Unscheduled Visit to Third Party",
            activeFlag : "Y",
          ]
        ]
      ]
    ]

  static def myCaseNoteTypes =
    [
      [
        domain     : "TASK_TYPE",
        code       : "ACP",
        description: "Accredited Programme",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ASSESSMENT",
            description: "Assessment",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CONS_WRK",
            description: "Consolidation Work",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GEN_VISIT",
            description: "General Visit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PPR",
            description: "Post Programme Review meeting",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PROG_FIN",
            description: "Programme Finish",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PROG_START",
            description: "Programme Start",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RE-VISIT",
            description: "Re-Visit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TSP_SESSION",
            description: "TSP 'Catch up' Session",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "OMIC",
        description: "OMiC",
        source     : "OCNS",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "TEST_OMIC",
            description: "Omic Case Note",
            source     : "OCNS",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "ACHIEVEMENTS",
        description: "Achievements",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CIAS",
            description: "CIAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "EDUCATION",
            description: "Education",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GYM",
            description: "Gym",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "H&S",
            description: "Health and Safety",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IMB",
            description: "IMB",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LNG & SKILLS",
            description: "Learning and Skills",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REGIMES",
            description: "Regimes",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VIOLENCE RED",
            description: "Violence Reduction",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VISITS",
            description: "Visits",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKSHOPS",
            description: "Workshops / Work Areas",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "CHAP",
        description: "Chaplaincy",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "BERSERILL",
            description: "Bereavement/Serious illness",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "COMLINKS",
            description: "Community Links",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FAITH",
            description: "Faith Specific Action",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FAMMAR",
            description: "Family Contacts/Marriage",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GPS",
            description: "General Pastoral Support",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HSY",
            description: "Healthcare / Statutory",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OPV",
            description: "OPV Requests",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RECSTAT",
            description: "Reception/Statutory Duty",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SSY",
            description: "Segregation / Statutory",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "COMMS",
        description: "Communication",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "COM_IN",
            description: "Communication IN",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "COM_OUT",
            description: "Communication OUT",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CUST",
            description: "Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FINANCE",
            description: "Finance",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MAIL ROOM",
            description: "Mail Room",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SECURITY",
            description: "Security",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "CAB",
        description: "Conduct & Behaviour",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CIAS",
            description: "CIAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CUST",
            description: "Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DIVERSITY",
            description: "Diversity",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "EDUCATION",
            description: "Education",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GYM",
            description: "Gym",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IMB",
            description: "IMB",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LNG & SKILLS",
            description: "Learning and Skills",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MDT",
            description: "MDT",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RECEPTION",
            description: "Reception",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REGIMES",
            description: "Regimes",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VID LINK",
            description: "Video Link",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VISITS",
            description: "Visits",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKSHOPS",
            description: "Workshops / Work Areas",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "CVM",
        description: "Custodial Violence Management Model",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMC",
            description: "Alerts Closed",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMO",
            description: "Alerts Open",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMB",
            description: "Behaviour Monitoring",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMG",
            description: "General",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMI",
            description: "Intervention Care Plan",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMK",
            description: "Key Worker Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMM",
            description: "Monitoring Care Plan",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMR",
            description: "Referral",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CVMV",
            description: "Violence Reduction Investigation Report",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "EARNED_HDC",
        description: "Earned HDC Scheme",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ACTIVITY_ATT",
            description: "Activity Attendance at Private Prison",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "Incentive level ENTRY",
        description: "Entry Level Incentive level information",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ENTRY ASSESS",
            description: "Entry Level Incentive level Assessment information",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ENTRY REVIEW",
            description: "Entry Level Incentive level Review Information",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "ENTRY WARN",
            description: "Entry Level Incentive level Warning Information",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "GEN",
        description: "General",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "HIS",
            description: "History Sheet Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OSE",
            description: "Offender Supervisor Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESET",
            description: "Resettlement",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "INTERVENTION",
        description: "Interventions",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "ACTIVITY",
            description: "Activities",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CUST",
            description: "Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DIVERSITY",
            description: "Diversity",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FINANCE",
            description: "Finance",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MAIL ROOM",
            description: "Mail Room",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OCA",
            description: "OCA",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SECURITY",
            description: "Security",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VIOLENCE RED",
            description: "Violence Reduction",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VISITS",
            description: "Visits",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "KA",
        description: "Key Worker Activity",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "KE",
            description: "Key Worker Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "KS",
            description: "Key Worker Session",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "LAB_ALLOC",
        description: "Labour Allocation",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "LAB_APP",
            description: "Labour Application",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "MCHECK",
        description: "Management Check",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "MCHECK",
            description: "Management Check",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "NCS",
        description: "National Career Service",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "FOLLOW-UP",
            description: "Follow-up",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IND",
            description: "Induction",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "PRE-RELEASE",
            description: "Pre-release",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "NEG",
        description: "Negative Behaviour",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "BEHAVEWARN",
            description: "Behaviour Warning",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "NEG_GEN",
            description: "General Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IEP_WARN",
            description: "Incentive level Warning",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKWARN",
            description: "Work Effort Warning",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "OBSERVE",
        description: "Observations",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "EDUCATION",
            description: "Education",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OBS_GEN",
            description: "General Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GYM",
            description: "Gym",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IMB",
            description: "IMB",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LNG & SKILLS",
            description: "Learning and Skills",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "NEWS",
            description: "News from Home",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RECEPTION",
            description: "Reception",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SECURITY",
            description: "Security",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "THREAT_PR",
            description: "Threats to Prisoners",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "THREAT_ST",
            description: "Threats to Staff",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VID LINK",
            description: "Video Link",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VISITS",
            description: "Visits",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKSHOPS",
            description: "Workshops / Work Areas",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "PADVIS",
        description: "Personal Advisor",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "PAV",
            description: "Visit",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "POS",
        description: "Positive Behaviour",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "POS_GEN",
            description: "General Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "IEP_ENC",
            description: "Incentives Encouragement",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "QUAL_ATT",
            description: "Quality Attitude",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "QUAL_WK",
            description: "Quality Work",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "REPORT",
        description: "Report",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "APAS",
            description: "APAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CIAS",
            description: "CIAS",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CUST",
            description: "Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "DIVERSITY",
            description: "Diversity",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "EDUCATION",
            description: "Education",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "FINANCE",
            description: "Finance",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "GYM",
            description: "Gym",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "HCC",
            description: "HCC",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "H&S",
            description: "Health and Safety",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "LNG & SKILLS",
            description: "Learning and Skills",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MAIL ROOM",
            description: "Mail Room",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "MDT",
            description: "MDT",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OCA",
            description: "OCA",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OMU",
            description: "Offender Management Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "OTHER",
            description: "Other",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "POE",
            description: "Personal Officer Entry",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REGIMES",
            description: "Regimes",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "RESIDENCE",
            description: "Residence",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SAFER CUST",
            description: "Safer Custody",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SECURITY",
            description: "Security",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "SEG UNIT",
            description: "Segregation Unit",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "CARATS",
            description: "Substance Misuse",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "VIOLENCE RED",
            description: "Violence Reduction",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "WORKSHOPS",
            description: "Workshops / Work Areas",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "REPORTS",
        description: "Reports",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "CHAPLAINCY",
            description: "Chaplaincy",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REP_GEN",
            description: "General Report",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REP_IEP",
            description: "Incentive level Report",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "REP_WNG",
            description: "Wing Conduct Report",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "SC",
        description: "Social Care",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "SC",
            description: "Social Care",
            activeFlag : "Y",
          ]
        ]
      ],
      [
        domain     : "TASK_TYPE",
        code       : "TRNG",
        description: "Training",
        activeFlag : "Y",
        subCodes   : [
          [
            domain     : "TASK_SUBTYPE",
            code       : "TRNGALL",
            description: "ALLOCATED (State Course in Case Notes)",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TRNGCOM",
            description: "COMPLETED (State Course in Case Notes)",
            activeFlag : "Y",
          ],
          [
            domain     : "TASK_SUBTYPE",
            code       : "TRNGREM",
            description: "REMOVED(Put Reason/Course in Case Notes)",
            activeFlag : "Y",
          ]
        ]
      ]
    ]
}
