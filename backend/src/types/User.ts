import { objectType, extendType, inputObjectType, arg, queryType } from '@nexus/schema'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { connectionFromPromisedArray } from 'graphql-relay'
const { APP_SECRET } = process.env

export const User = objectType({
  name: 'User',
  definition: t => {
    t.implements('Node')
    // t.id('id')
    t.model.email()
    t.model.name()
    t.model.avatar()
    t.model.createdAt()
    t.model.updatedAt()

    // t.model.conversations()
    t.connectionField('conversationConnection', {
      type: 'Conversation',
      // @ts-ignore
      resolve: async (root, args, ctx) => {
        // @ts-ignore
        const userId = root.id
        const conversationConnection = await connectionFromPromisedArray(
          ctx.prisma.user.findOne({ where: { id: userId }}).conversations(),
          args
        )
        return conversationConnection
      }
    })
  }
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition: t => {
    t.string('token')
    t.field('user', { type: 'User' })
  }
})

// QUERY
export const Query = queryType({
  definition: t => {
    t.connectionField('userConnection', {
      type: 'User',
      // @ts-ignore
      resolve: async (_root, args, ctx) => {
        const userConnection = await connectionFromPromisedArray(
          ctx.prisma.user.findMany({}),
          args,
        )
        return userConnection
      }
    })
  }
})

// SIGNUP
export const SignupInput = inputObjectType({
  name: 'SignupInput',
  definition: t => {
    t.string('email', { required: true })
    t.string('password', { required: true })
    t.string('name')
    t.string('avatar')
  }
})
export const SignupMutation = extendType({
  type: 'Mutation',
  definition: t => {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        input: arg({ type: 'SignupInput', required: true })
      },
      resolve: async (_root, { input: { password, ...input }}, ctx) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.prisma.user.create({
          data: {
            ...input,
            password: hashedPassword,
          }
        })
        const token = sign({ userId: user.id }, APP_SECRET)
        return {
          token,
          user,
        }
      }
    })
  }
})

// LOGIN
export const LoginInput = inputObjectType({
  name: 'LoginInput',
  definition: t => {
    t.string('email', { required: true })
    t.string('password', { required: true })
  }
})
export const LoginMutation = extendType({
  type: 'Mutation',
  definition: t => {
    t.field('login', {
      type: 'AuthPayload',
      args: {
        input: arg({ type: 'LoginInput', required: true })
      },
      resolve: async (_root, { input: { email, password }}, ctx) => {
        const user = await ctx.prisma.user.findOne({ where: { email }})
        if (!user) throw new Error(`No user found for email: ${email}`)

        const isPasswordValid = await compare(password, user.password)
        if(!isPasswordValid) throw new Error('Invalid password')

        const token = sign({ userId: user.id }, APP_SECRET)
        return {
          token,
          user,
        }
      }
    })
  }
})

// export const Clean = extendType({
//   type: "Mutation",
//   definition: t => {
//     t.boolean('clean', {
//       resolve: async (_root, _args, ctx) => {
//         await ctx.prisma.user.deleteMany({})
//         return true
//       }
//     })
//   }
// })