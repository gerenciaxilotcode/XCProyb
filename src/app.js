import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { errorHandler } from './middleware/errorHandler.js'
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

const app = express()

app.set('trust proxy', 1)

app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.frontendUrls.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('No permitido por CORS'))
    },
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

app.use('/health', healthRoutes)

app.use(generalLimiter)

app.get('/', (req, res) => {
  res.json({ success: true, data: { name: 'XilotCode API', status: 'online' } })
})

app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Recurso no encontrado.' })
})

app.use(errorHandler)

export default app
