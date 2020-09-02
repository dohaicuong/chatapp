import { objectType, extendType, inputObjectType, arg, subscriptionField } from '@nexus/schema'
import { connectionFromPromisedArray } from 'graphql-relay'

export const Conversation = objectType({
  name: 'Conversation',
  definition: t => {
    t.implements('Node')
    t.model.title()
    t.model.creator()
    t.model.createdAt()
    t.model.updatedAt()

    // t.model.participants()
    t.connectionField('participantConnection', {
      type: 'Participant',
      // @ts-ignore
      resolve: async (root, args, ctx) => {
        // @ts-ignore
        const conversationId = root.id
        const participantConnection = await connectionFromPromisedArray(
          ctx.prisma.conversation.findOne({ where: { id: conversationId } }).participants(),
          args
        )
        return participantConnection
      }
    })
    // t.model.messages()
    t.connectionField('messageConnection', {
      type: 'Message',
      // @ts-ignore
      resolve: async (root, args, ctx) => {
        // @ts-ignore
        const conversationId = root.id
        const messageConnection = await connectionFromPromisedArray(
          ctx.prisma.conversation.findOne({ where: { id: conversationId }}).messages(),
          args
        )
        return messageConnection
      }
    })
  }
})

// QUERY
export const ConversationQuery = extendType({
  type: 'Query',
  definition: t => {
    t.connectionField('conversationConnection', {
      type: 'Conversation',
      // @ts-ignore
      resolve: async (_root, args, ctx) => {
        const conversationConnection = await connectionFromPromisedArray(
          ctx.prisma.conversation.findMany({}),
          args
        )
        return conversationConnection
      }
    })
  }
})

// createConversation
export const CreateConversationInput = inputObjectType({
  name: 'CreateConversationInput',
  definition: t => {
    t.string('title', { required: true })
    t.list.id('participantIds')
  }
})
export const CreateConversationPayload = objectType({
  name: 'CreateConversationPayload',
  definition: t => {
    t.field('conversation', { type: 'Conversation' })
  }
})
export const CreateConversationMutation = extendType({
  type: 'Mutation',
  definition: t => {
    t.field('createConversation', {
      type: 'CreateConversationPayload',
      args: {
        input: arg({
          type: 'CreateConversationInput',
          required: true,
        })
      },
      resolve: async (_root, { input }, ctx) => {
        const userId = ctx.getUserId()
        if (!userId) throw new Error('Could not authenticate user.')
        const participants = input.participantIds?.map(id => ({ id })) ?? undefined

        const conversation = await ctx.prisma.conversation.create({
          data: {
            title: input.title,
            creator: {
              connect: {
                id: userId
              }
            },
            participants: {
              connect: participants
            }
          }
        })
        return {
          conversation,
        }
      }
    })
  }
})

// invitePeople
export const InvitePeopleInput = inputObjectType({
  name: 'InvitePeopleInput',
  definition: t => {
    t.id('conversationId', { required: true })
    t.list.id('participantIds', { required: true })
  }
})
export const InvitePeoplePayload = objectType({
  name: 'InvitePeoplePayload',
  definition: t => {
    t.id('conversationId')
    t.field('conversation', { type: 'Conversation' })

    t.list.id('participantIds')
    // t.list.field('participants', { type: 'Participant' })
  }
})
export const InvitePeopleMutation = extendType({
  type: 'Mutation',
  definition: t => {
    t.field('invitePeople', {
      type: 'InvitePeoplePayload',
      args: {
        input: arg({
          type: 'InvitePeopleInput',
          required: true,
        })
      },
      resolve: async (_root, { input }, ctx) => {
        const userId = ctx.getUserId()
        if (!userId) throw new Error('Could not authenticate user.')

        const currentConversation = await ctx.prisma.conversation.findOne({
          where: {
            id: input.conversationId,
          }
        })
        if (currentConversation.creatorId !== userId) throw new Error('Have no permission')

        const participants = input.participantIds?.map(id => ({ id })) ?? undefined
        const conversation = await ctx.prisma.conversation.update({
          where: { id: input.conversationId },
          data: {
            participants: {
              connect: participants
            }
          }
        })

        return {
          conversation,
          conversationId: input.conversationId,
          participantIds: input.participantIds,
        }
      }
    })
  }
})

// removePeople
export const RemovePeopleInput = inputObjectType({
  name: 'RemovePeopleInput',
  definition: t => {
    t.id('conversationId', { required: true })
    t.list.id('participantIds', { required: true })
  }
})
export const RemovePeoplePayload = objectType({
  name: 'RemovePeoplePayload',
  definition: t => {
    t.id('conversationId')
    t.field('conversation', { type: 'Conversation' })

    t.list.id('participantIds')
  }
})
export const RemovePeopleMutation = extendType({
  type: 'Mutation',
  definition: t => {
    t.field('removePeople', {
      type: 'RemovePeoplePayload',
      args: {
        input: arg({
          type: 'RemovePeopleInput',
          required: true,
        })
      },
      resolve: async (_root, { input }, ctx) => {
        const userId = ctx.getUserId()
        if (!userId) throw new Error('Could not authenticate user.')

        const currentConversation = await ctx.prisma.conversation.findOne({
          where: {
            id: input.conversationId,
          }
        })
        if (currentConversation.creatorId !== userId) throw new Error('Have no permission')

        const participants = input.participantIds?.map(id => ({ id })) ?? undefined
        const conversation = await ctx.prisma.conversation.update({
          where: { id: input.conversationId },
          data: {
            participants: {
              disconnect: participants
            }
          }
        })

        return {
          conversation,
          conversationId: input.conversationId,
          participantIds: input.participantIds,
        }
      }
    })
  }
})

// SUBSCRIPTION to conversation
export const ConversationSubscriptionPayload = objectType({
  name: 'ConversationSubscriptionPayload',
  definition: t => {
    t.id('conversationId')
    t.field('message', { type: 'Message' })
  }
})
export const ConversationSubscription = subscriptionField('conversation', {
  type: 'ConversationSubscriptionPayload',
  subscribe: (_root, _args, ctx) => {
    return ctx.pubsub.asyncIterator('conversationSub')
  },
  resolve: payload => payload
})

// extendType({
//   type: 'Subscription',
//   definition: t => {
//     t.field('conversation', {
//       type: 'ConversationSubscriptionPayload',
//       subscribe(_root, _args, ctx) {
//         return ctx.pubsub.asyncIterator('latestPost')
//       },
//       resolve(payload) {
//         return payload
//       },
//     })
//   }
// })