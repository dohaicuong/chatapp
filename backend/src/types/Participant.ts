import { objectType } from '@nexus/schema'

export const Participant = objectType({
  name: 'Participant',
  definition: t => {
    t.implements('Node')
    t.model.user()
    t.model.createdAt()
    t.model.updatedAt()

    t.model.conversation()
  }
})