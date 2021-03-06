package model

import groovy.transform.TupleConstructor

import static model.Caseload.*
import static model.StaffMember.*
import static model.UserType.GENERAL

@TupleConstructor
enum UserAccount {

    ELITE2_API_USER('ELITE2_API_USER', SM_1, GENERAL, NWEB, []),
    ITAG_USER('ITAG_USER', SM_2, GENERAL, LEI, [BXI, LEI, MDI, SYI, WAI]),
    API_TEST_USER('API_TEST_USER', SM_4, GENERAL, MUL, [MUL]),
    EXOFF5('EXOFF5', SM_10, GENERAL, LEI, []),
    GLOBAL_USER('GLOBAL_USER', SM_7, GENERAL, BXI, [BXI, MDI, SYI, WAI]),

    NOT_KNOWN('NOT_KNOWN', null, null, null, [])

    String username
    StaffMember staffMember
    UserType type
    Caseload workingCaseload
    List<Caseload> caseloads
}