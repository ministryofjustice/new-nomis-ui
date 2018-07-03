package specs

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.interfaces.DecodedJWT
import mockapis.JwtFactory
import spock.lang.Specification

class JwtFactorySpecification extends Specification {

  def 'create a Token'() {
    when:
    String token = JwtFactory.token()

    then:
    token != null
  }

  def 'tokens are valid'() {
    given:
    String token = JwtFactory.token()
    JWTVerifier verifier = JWT.require(JwtFactory.ALGORITHM).withIssuer(JwtFactory.ISSUER).build()

    when:
    DecodedJWT decoded = verifier.verify(token)

    then:
    decoded != null
    decoded.expiresAt != null
    decoded.issuedAt != null

    final now = new Date().time

    decoded.expiresAt.time > now
    decoded.issuedAt.time < (now + 1) // 1ms leeway
  }

}
