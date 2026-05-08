import { prisma } from "../lib/prisma"

async function test() {
  try {
    console.log("Prisma models:", Object.keys(prisma).filter(k => !k.startsWith("_")))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const count = await (prisma as any).account.count()
    console.log("Account count:", count)
  } catch (_err) {
    console.error("Test failed:", _err)
  }
}

test()
