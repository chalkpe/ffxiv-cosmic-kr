import { PrismaClient } from '~/generated/prisma/client'

const client = new PrismaClient()
const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient }

export const prisma: PrismaClient = globalForPrisma.prisma ?? client
if (import.meta.env.DEV) globalForPrisma.prisma = prisma
