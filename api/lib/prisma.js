// src/lib/db.js
import { PrismaClient } from '@prisma/client'

// This creates a single instance so you don't exhaust 
// your MongoDB connection limit.
const prisma = new PrismaClient()

export default prisma