"use server"

import bcrypt from "bcryptjs"

import prisma from "@/lib/db"
import { actionClient, authActionClient } from "@/lib/safe-action"

import { employeeSchema } from "./schema"

export const createEmployeByInvite = actionClient
  .metadata({ actionName: "createEmployeByInvite" })
  .schema(employeeSchema)
  .action(async ({ parsedInput }) => {
    const store = await prisma.store.findUnique({
      where: {
        id: parsedInput.storeId,
      },
    })

    if (!store) {
      throw new Error("Invalid store.")
    }

    const hashedPin = await bcrypt.hash(parsedInput.pin, 10)

    const employee = await prisma.employee.create({
      data: {
        ...parsedInput,
        employerId: store.ownerId,
        pin: hashedPin,
      },
      select: {
        id: true,
      },
    })

    return {
      employee,
    }
  })

export const createEmployee = authActionClient
  .metadata({ actionName: "createEmployee" })
  .schema(employeeSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const hashedPin = await bcrypt.hash(parsedInput.pin, 10)

    const employee = await prisma.employee.create({
      data: {
        ...parsedInput,
        employerId: user.userId,
        pin: hashedPin,
      },
      select: {
        id: true,
      },
    })

    return {
      employee,
    }
  })
