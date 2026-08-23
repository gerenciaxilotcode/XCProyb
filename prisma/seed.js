import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import 'dotenv/config'
import { slugify } from '../src/utils/slugify.js'

const prisma = new PrismaClient()

async function seedAdmin() {
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

async function seedHero() {
  await prisma.homeHero.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      eyebrow: 'Desarrollo de software para negocios reales',
      title: 'Software hecho para tu negocio.',
      subtitle:
        'Desarrollamos soluciones digitales a la medida para pequeños y medianos negocios, adaptadas a sus necesidades, procesos y presupuesto.',
      ctaPrimaryLabel: 'Quiero mi proyecto',
      ctaSecondaryLabel: 'Ver servicios',
      tagline: 'Automatiza. Optimiza. Crece.'
    }
  })
}

async function seedCta() {
  await prisma.ctaBlock.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      title: '¿Tienes una idea para tu negocio?',
      description: 'Convirtámosla en software. Sin compromiso, podemos platicarlo en una llamada o videollamada.',
      buttonLabel: 'Hablar por WhatsApp'
    }
  })
}

async function seedBrand() {
  await prisma.brandSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      name: 'XilotCode',
      tagline: 'Automatiza. Optimiza. Crece.',
      description: 'Desarrollamos software a la medida para pequeños y medianos negocios.'
    }
  })
}

async function seedContactInfo() {
  await prisma.contactInfo.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      whatsappNumber: '524421319153',
      whatsappMessage: 'Hola, me llamo '
    }
  })
}

async function seedProcessSteps() {
  const steps = [
    { key: 'analizamos', title: 'Analizamos', description: 'Conocemos tu negocio y entendemos qué necesitas.', order: 1 },
    { key: 'disenamos', title: 'Diseñamos', description: 'Convertimos tus necesidades en una experiencia digital clara.', order: 2 },
    { key: 'desarrollamos', title: 'Desarrollamos', description: 'Construimos el sistema utilizando tecnologías modernas.', order: 3 },
    { key: 'probamos', title: 'Probamos', description: 'Validamos funcionalidades, seguridad y experiencia.', order: 4 },
    { key: 'entregamos', title: 'Entregamos', description: 'Ponemos tu solución en funcionamiento y te acompañamos.', order: 5 }
  ]

  for (const step of steps) {
    await prisma.processStep.upsert({ where: { key: step.key }, update: {}, create: step })
  }
}

async function seedServices() {
  const services = [
    {
      key: 'sitios-web',
      title: 'Sitios web profesionales',
      iconKey: 'Globe',
      description: 'Presencia digital clara y rápida que representa lo que tu negocio realmente hace.',
      order: 1
    },
    {
      key: 'sistemas-administrativos',
      title: 'Sistemas administrativos',
      iconKey: 'LayoutDashboard',
      description: 'Centraliza clientes, ventas, inventario, usuarios y procesos en una sola plataforma.',
      order: 2
    },
    {
      key: 'tiendas-en-linea',
      title: 'Tiendas en línea',
      iconKey: 'ShoppingCart',
      description: 'Vende tus productos o servicios con un flujo de compra simple y confiable.',
      order: 3
    },
    {
      key: 'plataformas-digitales',
      title: 'Plataformas digitales',
      iconKey: 'Boxes',
      description: 'Herramientas a medida para operar, coordinar equipos y dar seguimiento a tu negocio.',
      order: 4
    },
    {
      key: 'automatizacion',
      title: 'Automatización de procesos',
      iconKey: 'Workflow',
      description: 'Reduce tareas repetitivas y libera tiempo para lo que realmente importa.',
      order: 5
    },
    {
      key: 'sistemas-personalizados',
      title: 'Sistemas personalizados',
      iconKey: 'Wrench',
      description: 'Cuando ninguna herramienta genérica se ajusta a tu operación, construimos una que sí.',
      order: 6
    }
  ]

  for (const service of services) {
    await prisma.service.upsert({ where: { key: service.key }, update: {}, create: service })
  }
}

async function seedSectors() {
  const sectors = [
    'Taquerías', 'Restaurantes', 'Hoteles', 'Colegios', 'Inmobiliarias',
    'Agencias de viajes', 'Clínicas', 'Despachos contables', 'Salones de belleza',
    'Tiendas', 'Talleres automotrices', 'Ferreterías', 'Servicios profesionales'
  ]

  for (const [index, name] of sectors.entries()) {
    const key = slugify(name)

    await prisma.sector.upsert({
      where: { key },
      update: {},
      create: { key, name, order: index + 1 }
    })
  }
}

async function seedDifferentiators() {
  const items = [
    { key: 'a-medida', title: 'A medida', iconKey: 'Target', description: 'No necesitas adaptar tu negocio a un software genérico.', order: 1 },
    { key: 'presupuesto', title: 'Presupuesto', iconKey: 'Wallet', description: 'Desarrollamos soluciones considerando el tamaño y presupuesto de tu negocio.', order: 2 },
    { key: 'escalable', title: 'Escalable', iconKey: 'TrendingUp', description: 'Construimos pensando en que tu negocio pueda crecer.', order: 3 },
    { key: 'cercano', title: 'Cercano', iconKey: 'Handshake', description: 'Trabajamos directamente contigo para entender lo que realmente necesitas.', order: 4 }
  ]

  for (const item of items) {
    await prisma.differentiator.upsert({ where: { key: item.key }, update: {}, create: item })
  }
}

async function main() {
  await seedAdmin()
  await seedHero()
  await seedCta()
  await seedBrand()
  await seedContactInfo()
  await seedProcessSteps()
  await seedServices()
  await seedSectors()
  await seedDifferentiators()
  console.log('Contenido inicial sembrado correctamente.')
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
