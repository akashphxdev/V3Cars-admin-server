import { PrismaClient } from "@prisma/client";
import 'dotenv/config'

const prisma = new PrismaClient({
  log: ['error'],
})

export default prisma