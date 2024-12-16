// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Gallery } from './collections/Gallery'
import { Categories } from './collections/Categories'
import { SubCategories } from './collections/SubCategories'
import { Brands } from './collections/Brands'
import { updateExistingMediaUsage } from './migrations/updateExistingMediaUsage'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Gallery, Categories, SubCategories, Brands],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  cors: ['*', 'http://localhost:3001'],
  onInit: async (payload) => {
    try {
      // Exécuter la migration
      await updateExistingMediaUsage(payload)
    } catch (error) {
      // Log l'erreur mais ne fait pas échouer l'initialisation
      console.error("Erreur lors de l'initialisation:", error)
    }
  },
})
