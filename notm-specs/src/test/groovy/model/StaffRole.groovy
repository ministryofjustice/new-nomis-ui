package model

import groovy.transform.TupleConstructor

@TupleConstructor
enum StaffRole {
  KEY_WORKER("KW", "Key Worker")

  String roleIe
  String roleDescription

}