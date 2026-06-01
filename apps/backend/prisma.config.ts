import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // In Prisma 7, the Migrate connection URL is configured here
  // rather than inside the schema.prisma datasource block.
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
