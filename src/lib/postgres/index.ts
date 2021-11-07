import { PrismaClient } from '@prisma/client';

const pg = new PrismaClient();
global.connections.set('pg', pg);

export default pg;