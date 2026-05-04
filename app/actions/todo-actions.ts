"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

const createTodoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
})

export async function createTodo(prevState: any, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { message: "Unauthorized" }
  }

  const validatedFields = createTodoSchema.safeParse({
    title: formData.get("title"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    }
  }

  try {
    await prisma.todo.create({
      data: {
        title: validatedFields.data.title,
        userId: session.user.id,
      },
    })
    
    // Clear the form and show success
    revalidatePath("/todos")
    return { message: "Todo added successfully", success: true }
  } catch (error) {
    return { message: "Failed to create todo" }
  }
}

export async function toggleTodo(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const todo = await prisma.todo.findUnique({
    where: { id, userId: session.user.id }
  })

  if (!todo) {
    throw new Error("Todo not found")
  }

  const completed = !todo.completed
  
  const updateData: any = { completed }
  
  if (completed) {
    updateData.completedAt = new Date()
    if (!todo.completionEventCounted) {
      updateData.completionEventCounted = true
    }
  } else {
    updateData.completedAt = null
  }

  await prisma.todo.update({
    where: { id },
    data: updateData
  })

  revalidatePath("/todos")
}

export async function deleteTodo(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.todo.update({
    where: { id, userId: session.user.id },
    data: { deleted: true }
  })

  revalidatePath("/todos")
}

export async function updateTodoTitle(id: string, title: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  if (title.trim().length < 3) {
    throw new Error("Title must be at least 3 characters")
  }

  await prisma.todo.update({
    where: { id, userId: session.user.id },
    data: { title: title.trim() }
  })

  revalidatePath("/todos")
}
