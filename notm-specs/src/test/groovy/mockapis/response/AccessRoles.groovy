package mockapis.response

class AccessRoles {
  static def keyworker = [
    role           : 'KW',
    roleDescription: 'Key Worker'
  ]

  static def omicAdmin = [
    roleId: 0,
    roleCode: "OMIC_ADMIN",
    roleName: "Omic admin",
    parentRoleCode: "code",
    caseloadId: "LEI"
  ]

  static def globalSearch = [
    roleId: 0,
    roleCode: "GLOBAL_SEARCH",
    roleName: "Global search",
    parentRoleCode: "code",
    caseloadId: "LEI"
  ]

  static def prison = [
    roleId: 0,
    roleCode: "PRISON",
    roleName: "Prison role",
    parentRoleCode: "code",
  ]

  static def addBulkAppointments = [
          roleId: 1,
    roleCode: 'BULK_APPOINTMENTS',
    roleName:  'Bulk appointments'
  ]

  static def categoriser = [
    roleId: 2,
    roleCode: "CREATE_CATEGORISATION",
    roleName: "Create Categorisation"
  ]

  static def prisonOffenderManager = [
    roleId: 3,
    roleCode: "VIEW_PROBATION_DOCUMENTS",
    roleName: "View probation documents"
  ]

  static def pathfinderUser = [
    roleId: 4,
    roleCode: "PF_STD_PRISON",
    roleName: "Pathfinder prison role"
  ]
}
