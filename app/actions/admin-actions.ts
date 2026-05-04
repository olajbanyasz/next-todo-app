"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function verifyAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required")
  }
  return session.user.id
}

export async function deleteUser(id: string) {
  const adminId = await verifyAdmin()
  
  const userToDelete = await prisma.user.findUnique({ where: { id } })
  if (!userToDelete) throw new Error("User not found")
  if (userToDelete.role === "admin") throw new Error("Cannot delete an admin user directly. Demote them first.")

  await prisma.user.update({
    where: { id },
    data: { 
      deleted: true,
      deletedAt: new Date(),
      deletedReason: "Admin soft delete"
    }
  })

  revalidatePath("/admin")
}

export async function restoreUser(id: string) {
  await verifyAdmin()

  await prisma.user.update({
    where: { id },
    data: { 
      deleted: false,
      deletedAt: null,
      deletedReason: null
    }
  })

  revalidatePath("/admin")
}

export async function promoteUser(id: string) {
  const adminId = await verifyAdmin()
  
  if (adminId === id) {
    throw new Error("Cannot promote self")
  }

  await prisma.user.update({
    where: { id },
    data: { role: "admin" }
  })

  revalidatePath("/admin")
}

export async function demoteUser(id: string) {
  const adminId = await verifyAdmin()
  
  if (adminId === id) {
    throw new Error("Cannot demote self")
  }

  await prisma.user.update({
    where: { id },
    data: { role: "user" }
  })

  revalidatePath("/admin")
}
