import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'
import Elysia, { t, type Static } from 'elysia'
import { env } from '../env'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = () =>
  new Elysia({ name: 'auth' })
    .use(cookie())
    .use(
      jwt({
        secret: env.JWT_SECRET_KEY,
        schema: jwtPayload,
      }),
    )
    .derive(({ jwt, setCookie, removeCookie, cookie }) => {
      return {
        signUser: async (payload: Static<typeof jwtPayload>) => {
          const token = await jwt.sign(payload)

          console.log('TOKEN', token)

          setCookie('auth', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
          })
        },

        signOut: () => {
          removeCookie('auth')
        },

        getCurrentUser: async () => {
          const authCookie = cookie.auth

          if (!authCookie) {
            throw new Error('Unauthorized')
          }

          const payload = await jwt.verify(authCookie)

          if (!payload) {
            throw new Error('Unauthorized')
          }

          return {
            userId: payload.sub,
            restaurantId: payload.restaurantId,
          }
        },
      }
    })
