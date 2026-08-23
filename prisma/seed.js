import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Administrador XilotCode'

  if (!email || !password) {
    throw new Error('Define ADMIN_EMAIL y ADMIN_PASSWORD en tu archivo .env antes de ejecutar el seed.')
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD debe tener al menos 8 caracteres.')
  }

  const passwordHash = await argon2.hash(password)

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name }
  })

  console.log(`Usuario administrador listo: ${admin.email}`)
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
