import prisma from '../prisma/client.js'

export async function getMediaReferences(mediaAssetId) {
  const [hero, brandLogo, brandFavicon, sectors, services, differentiators, offers] = await Promise.all([
    prisma.homeHero.findFirst({ where: { imageAssetId: mediaAssetId } }),
    prisma.brandSettings.findFirst({ where: { logoAssetId: mediaAssetId } }),
    prisma.brandSettings.findFirst({ where: { faviconAssetId: mediaAssetId } }),
    prisma.sector.findMany({ where: { imageAssetId: mediaAssetId }, select: { id: true, name: true } }),
    prisma.service.findMany({ where: { imageAssetId: mediaAssetId }, select: { id: true, title: true } }),
    prisma.differentiator.findMany({ where: { imageAssetId: mediaAssetId }, select: { id: true, title: true } }),
    prisma.offer.findMany({ where: { imageAssetId: mediaAssetId }, select: { id: true, title: true } })
  ])

  const references = []

  if (hero) references.push('Inicio (Hero)')
  if (brandLogo) references.push('Marca (logo)')
  if (brandFavicon) references.push('Marca (favicon)')
  sectors.forEach((sector) => references.push(`Sector: ${sector.name}`))
  services.forEach((service) => references.push(`Servicio: ${service.title}`))
  differentiators.forEach((item) => references.push(`Diferenciador: ${item.title}`))
  offers.forEach((offer) => references.push(`Oferta: ${offer.title}`))

  return references
}
