import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  migrate: {
    schemaPath: 'prisma/schema.prisma',
    // In Prisma 7, the Migrate connection URL is configured here
    // rather than inside the schema.prisma datasource block.
    url: process.env.DATABASE_URL,
  },
})
