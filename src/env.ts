import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url({ message: 'DATABASE_URL precisa ser uma URL válida' }),
})

export const env = envSchema.parse(process.env)
