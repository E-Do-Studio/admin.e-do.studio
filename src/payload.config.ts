// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'

import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Gallery } from './collections/Gallery'
import { Categories } from './collections/Categories'
import { SubCategories } from './collections/SubCategories'
import { Brands } from './collections/Brands'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(__dirname),
    },
  },
  collections: [Users, Media, Gallery, Categories, SubCategories, Brands],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
  upload: {},
  cors: [
    '*',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://e-do.studio',
    'https://jtdn1hw7-3001.uks1.devtunnels.ms',
  ],
  email: resendAdapter({
    defaultFromAddress: 'dev@payloadcms.com',
    defaultFromName: 'Payload CMS',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
