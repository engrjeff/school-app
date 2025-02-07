import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// const programOfferings: Pick<
//   ProgramOffering,
//   "title" | "code" | "description"
// >[] = [
//   {
//     title: "High School",
//     code: "HS",
//     description: "Junior High School program",
//   },
//   {
//     title: "Senior High School",
//     code: "SHS",
//     description:
//       "Senior High School program with STEM, ABM, HUMMS, TVL strands.",
//   },
// ]

async function main() {
  // find first user with role = School Admin
  // const user = await prisma.user.findFirst({
  //   where: { role: ROLE.SCHOOLADMIN },
  // })
  // if (!user) {
  //   console.log("No School Admin user is registered yet.")
  //   return
  // }
  // if (!user?.schoolId) {
  //   console.log(`No school is associated with user ${user.email} yet.`)
  //   return
  // }
  // // find first school
  // const school = await prisma.school.findFirst({ where: { id: user.schoolId } })
  // if (!school) {
  //   console.log(`No school is associated with user ${user.email} yet.`)
  //   return
  // }
  // // generate program offerings
  // const programs = await prisma.programOffering.createMany({
  //   data: programOfferings.map((p) => ({ ...p, schoolId: school?.id })),
  // })
  // const programOne = programs[0]
  // const programTwo = programs[1]
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    if (e instanceof Error) {
      console.error(e.message)
    } else {
      console.error(e)
    }

    await prisma.$disconnect()
    process.exit(1)
  })
