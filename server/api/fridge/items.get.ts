import prisma from "~/generated/prisma/client";

export default defineEventHandler(async (event) => {
    const fridge = await prisma.fridge.findUnique({ where: {
        userId: 
    }})
})