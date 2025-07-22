import { Elysia } from 'elysia'

const app = new Elysia().get('/', () => {
  return 'Welcome to PizzaShop API!'
})

app.listen(3333, () => {
  console.log('Server is running')
})
