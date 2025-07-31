import Elysia, { t } from 'elysia'
import { db } from '../../db/connection'
import { users, restaurants } from '../../db/schema'

export const registerRestaurant = new Elysia().post(
  '/restaurants',
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager',
      })
      .returning({
        id: users.id,
      })

    const [restaurant] = await db
      .insert(restaurants)
      .values({
        name: restaurantName,
        managerId: manager?.id,
      })
      .returning({
        id: restaurants.id,
        name: restaurants.name,
        description: restaurants.description,
        createdAt: restaurants.createdAt,
        updatedAt: restaurants.updatedAt,
      })

    set.status = 204

    return {
      message: 'Restaurant created successfully',
      restaurant,
    }
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      managerName: t.String(),
      email: t.String({ format: 'email' }),
      phone: t.String(),
    }),
  },
)
