import { PrismaClient } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { Request, Response } from 'express'
import { getUserId } from './utils'

const prisma = new PrismaClient({
  log: ['query'],
})
const pubsub = new PubSub()

export type Context = {
  prisma: PrismaClient
  req: Request
  res: Response
  pubsub: PubSub
  getUserId: () => string
}
export const createContext = (ctx: any): Context => {
  return {
    ...ctx,
    getUserId: () => getUserId(ctx),
    prisma,
    pubsub,
  }
}



