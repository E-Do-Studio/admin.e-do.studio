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
import { Cyclorama } from './collections/Cyclorama'
import { PostProd } from './collections/PostProd'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(__dirname),
    },
  },
  collections: [Users, Media, Gallery, Categories, SubCategories, Brands, Cyclorama, PostProd],
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
  cors: {
    origins: ['*'],
    headers: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'Expires',
      'Netlify-Vary',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
      'Access-Control-Expose-Headers',
      'Access-Control-Max-Age',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
      'Access-Control-Expose-Headers',
    ],
  },
  email: resendAdapter({
    defaultFromAddress: 'dev@payloadcms.com',
    defaultFromName: 'Payload CMS',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
