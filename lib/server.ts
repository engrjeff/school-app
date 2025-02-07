import { v4 as uuidv4 } from "uuid"

import prisma from "@/lib/db"

export async function getVerificationTokenByEmail(email: string) {
  try {
    const result = await prisma.verificationToken.findFirst({
      where: { email },
    })

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    const result = await prisma.verificationToken.findUnique({
      where: { token: token },
    })

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function generateVerificationToken(email: string) {
  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    // remove from db
    await prisma.verificationToken.delete({
      where: { identifier: existingToken.identifier },
    })
  }

  const token = uuidv4()
  const expires =
    process.env.NODE_ENV === "development"
      ? new Date(new Date().getTime() + 20 * 1000) // 20 sec for dev env
      : new Date(new Date().getTime() + 3600 * 1000) //expires in 1 hour

  const newVerificationToken = await prisma.verificationToken.create({
    data: {
      email,
      expires,
      token,
    },
  })

  return newVerificationToken
}

export async function verifyToken(token: string) {
  if (!token) {
    return { status: "error", message: "Invalid verification token" }
  }

  const foundToken = await getVerificationTokenByToken(token)

  if (!foundToken)
    return { status: "error", message: "Invalid verification token" }

  const hasExpired = new Date() > foundToken.expires

  if (hasExpired)
    return { status: "error", message: "Invalid verification token" }

  // update the user's `emailVerified` field
  await prisma.user.update({
    where: { email: foundToken.email },
    data: { emailVerified: new Date() },
  })

  // delete the token
  await prisma.verificationToken.delete({ where: { token } })

  return { status: "success", message: "Nice! Your email was verified!" }
}

// Reset Password token
export async function getResetPasswordTokenByEmail(email: string) {
  try {
    const result = await prisma.resetPasswordToken.findFirst({
      where: { email },
    })

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getResetPasswordTokenByToken(token: string) {
  try {
    const result = await prisma.resetPasswordToken.findUnique({
      where: { token },
    })

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function generateResetPasswordToken(email: string) {
  const existingToken = await getResetPasswordTokenByEmail(email)

  if (existingToken) {
    // remove from db
    await prisma.resetPasswordToken.delete({
      where: { identifier: existingToken.identifier },
    })
  }

  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) //expires in 1 hour

  const newResetPasswordToken = await prisma.resetPasswordToken.create({
    data: {
      email,
      expires,
      token,
    },
  })

  return newResetPasswordToken
}

export async function verifyResetPasswordToken(token: string) {
  if (!token) {
    return { status: "error", token: null }
  }

  const foundToken = await getResetPasswordTokenByToken(token)

  if (!foundToken) return { status: "error", token: null }

  const hasExpired = new Date() > foundToken.expires

  if (hasExpired) return { status: "error", token: null }

  // delete the token
  await prisma.resetPasswordToken.delete({ where: { token } })

  return { status: "success", token: foundToken }
}
