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
    roleName: "global swarch",
    parentRoleCode: "code",
    caseloadId: "LEI"
  ]

}
