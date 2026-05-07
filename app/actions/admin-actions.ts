"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function verifyAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required")
  }

  // Update activity since the admin is active right now
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastActivityAt: new Date() }
  })

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

export async function getAdminStats() {
  await verifyAdmin()

  const onlineThreshold = new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago

  const [
    totalUsers,
    totalAdmins,
    totalTodos,
    totalCompletedTodos,
    totalActiveTodos,
    totalDeletedTodos,
    onlineUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.todo.count(),
    prisma.todo.count({ where: { completed: true } }),
    prisma.todo.count({ where: { completed: false, deleted: false } }),
    prisma.todo.count({ where: { deleted: true } }),
    prisma.user.count({
      where: {
        lastActivityAt: { gte: onlineThreshold },
        deleted: false,
      }
    })
  ])

  return {
    totalUsers,
    totalAdmins,
    onlineUsers,
    totalTodos,
    totalCompletedTodos,
    totalActiveTodos,
    totalDeletedTodos
  }
}

export async function getAdminUsers(filters: { email?: string, deleted?: string } = {}) {
  await verifyAdmin()

  const { email, deleted } = filters
  const where: any = {}

  if (email && email.length >= 3) {
    where.email = { contains: email, mode: 'insensitive' }
  }
  
  if (deleted === 'deleted') {
    where.deleted = true
  } else if (deleted === 'all') {
    // No deleted filter
  } else {
    // Default: active only
    where.deleted = false
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      deleted: true,
      lastLoginAt: true,
      _count: {
        select: { todos: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return users.map(u => ({
    ...u,
    todoCount: u._count.todos
  }))
}
