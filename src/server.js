import app from './app.js'
import { env } from './config/env.js'

app.listen(env.port, () => {
  console.log(`XilotCode API escuchando en el puerto ${env.port}`)
})
