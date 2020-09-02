import { objectType, inputObjectType, extendType, arg } from '@nexus/schema'
import { fromGlobalId } from 'graphql-relay'

export const Message = objectType({
  name: 'Message',
  definition: t => {
    t.implements('Node')
    t.model.message()
    t.model.createdAt()
    t.model.updatedAt()

    t.model.sender()
    t.model.conversation()
  }
})

// createMessage
export const CreateMessageInput = inputObjectType({
  name: 'CreateMessageInput',
  definition: t => {
    t.id('conversationId', { required: true })
    t.string('message', { required: true })
  }
})
export const CreateMessagePayload = objectType({
  name: 'CreateMessagePayload',
  definition: t => {
    t.id('conversationId')
    t.field('message', { type: 'Message' })
  }
})
export const CreateMessageMutation = extendType({
  type: 'Mutation',
  definition: t => {
    t.field('createMessage', {
      type: 'CreateMessagePayload',
      args: {
        input: arg({
          type: 'CreateMessageInput',
          required: true,
        })
      },
      resolve: async (_root, { input }, ctx) => {
        const userId = ctx.getUserId()
        if (!userId) throw new Error('Could not authenticate user.')

        const { id: conversationId } = fromGlobalId(input.conversationId)
        const newMessage = await ctx.prisma.message.create({
          data: {
            message: input.message,
            conversation: {
              connect: { id: conversationId }
            },
            sender: {
              connect: { id: userId }
            }
          }
        })

        ctx.pubsub.publish('conversationSub', {
          conversationId: input.conversationId,
          message: newMessage
        })

        return {
          conversationId: input.conversationId,
          message: newMessage
        }
      }
    })
  }
})