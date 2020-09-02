import { nexusPrismaPlugin } from 'nexus-prisma'
import * as nexus from '@nexus/schema'
import { join } from 'path'
import { Context } from './context'
import * as types from './types'

const nexusPrisma = nexusPrismaPlugin({
  prismaClient: (ctx: Context) => ctx.prisma,
})

const connection = nexus.connectionPlugin()

export const schema = nexus.makeSchema({
  types,
  plugins: [nexusPrisma, connection],
  outputs: {
    typegen: join(__dirname, 'generated', 'index.d.ts'),
    schema: join(__dirname, 'generated', 'schema.graphql'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: join(__dirname, 'context.ts'),
        alias: 'ctx',
      },
    ],
    contextType: 'ctx.Context',
  },
})
