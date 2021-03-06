package mockapis

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm

class JwtFactory {
  static Algorithm ALGORITHM = Algorithm.HMAC256("secret")
  static ISSUER = "Paddy McGinty's Goat"

  static String token() {
    Date now = new Date()

    Date tenMinutesLater = new Date(now.getTime() + (10 * 60 * 1000))

    JWT
      .create()
      .withIssuer(ISSUER)
      .withIssuedAt(now)
      .withExpiresAt(tenMinutesLater)
      .sign ALGORITHM
  }
}
