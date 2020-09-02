import { scalarType } from '@nexus/schema'
import { DateTimeResolver } from 'graphql-scalars'

export const DateTime = scalarType(DateTimeResolver)