import { PrismaClient } from '../../prisma/client'

const client = new PrismaClient()
const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient }

export const prisma: PrismaClient = globalForPrisma.prisma ?? client
if (import.meta.env.DEV) globalForPrisma.prisma = prisma

export * from '../../prisma/client'
export type * from '../../prisma/client.d.ts'

export * from '../../prisma/models'
export type * from '../../prisma/models.d.ts'
