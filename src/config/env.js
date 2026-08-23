import dotenv from 'dotenv'

dotenv.config()

const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean)

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  adminName: process.env.ADMIN_NAME || 'Administrador XilotCode',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  frontendUrls
}
