import { Payload } from 'payload'

export async function updateExistingMediaUsage(payload: Payload) {
  // Récupérer toutes les entrées de la galerie
  const galleryEntries = await payload.find({
    collection: 'gallery',
    limit: 1000,
  })

  console.log(`Mise à jour de ${galleryEntries.docs.length} entrées de galerie...`)

  // Créer un Set des IDs de médias utilisés
  const usedMediaIds = new Set(
    galleryEntries.docs
      .map((doc) => (typeof doc.image === 'string' ? doc.image : doc.image?.id))
      .filter(Boolean),
  )

  // Mettre à jour tous les médias utilisés
  for (const mediaId of usedMediaIds) {
    await payload.update({
      collection: 'media',
      id: mediaId,
      data: {
        isAssigned: true,
      },
    })
  }

  console.log('Migration terminée')
}
