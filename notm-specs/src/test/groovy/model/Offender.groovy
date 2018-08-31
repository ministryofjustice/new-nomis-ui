package model

class Offender {

  Integer bookingId
  String bookingNo
  String offenderNo
  String firstName
  String middleName
  String lastName
  String dateOfBirth
  Integer Age
  String agencyId
  Integer assignedLivingUnitId
  String assignedLivingUnitDesc
  Integer facialImageId
  String iepLevel
  List<String> alertsDetails

  private Offender(
    Integer bookingId,
    String bookingNo,
    String offenderNo,
    String firstName,
    String middleName,
    String lastName,
    String dateOfBirth,
    Integer Age,
    String agencyId,
    Integer assignedLivingUnitId,
    String assignedLivingUnitDesc,
    Integer facialImageId,
    String iepLevel,
    List<String> alertsDetails = null) {

    this.bookingId = bookingId
    this.bookingNo = bookingNo
    this.offenderNo = offenderNo
    this.firstName = firstName
    this.middleName = middleName
    this.lastName = lastName
    this.dateOfBirth = dateOfBirth
    this.Age = Age
    this.agencyId = agencyId
    this.assignedLivingUnitId = assignedLivingUnitId
    this.assignedLivingUnitDesc = assignedLivingUnitDesc
    this.facialImageId = facialImageId
    this.iepLevel = iepLevel
    this.alertsDetails = alertsDetails
  }

  static def BOB() {
    return new Offender(-11,'A00121','A1234AK','DARIUS',null ,'BOB','1979-12-31', 38, 'LEI',-9,'A-1-7',-11, 'Standard')
  }

  static def SMITH() {
    return new Offender(-10,'A00120','A1234AJ','DANIEL','JOSEPH','SMITH','1958-01-01',60, 'LEI',-8,'A-1-6', -10, 'Standard', ['XA','PEEP'])
  }

  static def SMELLEY() {
    return new Offender(-12,'A00122','A1234AL','DANIEL','JOHN','SMELLEY','1968-01-01',50,'LEI',-10,'A-1-8',-12,'Standard')
  }

}
