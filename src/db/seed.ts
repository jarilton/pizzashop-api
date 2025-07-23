/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from '@faker-js/faker'
import { users, restaurants } from './schema'
import { db } from './connection'
import chalk from 'chalk'

/**
 * reset the database and seed it with initial data
 */
await db.delete(users)
await db.delete(restaurants)

console.log(chalk.yellow('Database reset successfully!'))

/**
 * Create customers
 */
await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
])

console.log(chalk.yellow('Customers created successfully!'))

/**
 * Create restaurant managers
 */
const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.yellow('Restaurant managers created successfully!'))

/**
 * Create restaurants
 */
await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager?.id,
  },
])

console.log(chalk.yellow('Restaurants created successfully!'))

console.log(chalk.green('Database seeded successfully!'))

process.exit() // Exit the process after seeding
