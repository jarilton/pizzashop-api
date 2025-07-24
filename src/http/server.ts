import { Elysia } from 'elysia'
import { db } from '../db/connection'
import { restaurants, users } from '../db/schema'

const app = new Elysia().post('/restaurants', async ({ body, set }) => {
  const { restaurantName, name, email, phone } = body as any

  const [manager] = await db
    .insert(users)
    .values({
      name,
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
})

app.listen(3333, () => {
  console.log('Server is running')
})
