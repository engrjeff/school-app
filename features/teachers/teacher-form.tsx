"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Gender } from "@prisma/client"
import { ArrowLeftIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { useFaculties } from "@/hooks/use-faculties"
import { useProgramOfferings } from "@/hooks/use-program-offerings"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

import { createTeacher } from "./actions"
import { TeacherInputs, teacherSchema } from "./schema"

export function TeacherForm() {
  const form = useForm<TeacherInputs>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      teacherId: "",
      firstName: "",
      lastName: "",
      middleName: "",
      suffix: "",
      address: "",
      phone: "",
      email: "",
      gender: Gender.MALE,
      programOfferingId: "",
      facultyId: "",
    },
  })

  const programs = useProgramOfferings()

  const faculties = useFaculties(form.watch("programOfferingId") ?? undefined)

  const action = useAction(createTeacher, {
    onError: ({ error }) => {
      if (error.serverError) {
        if (
          error.serverError === "Cannot have duplicate teacher/employee ID."
        ) {
          form.setError("teacherId", { message: error.serverError })
          return
        }

        toast.error(error.serverError)
        return
      }
    },
  })

  const router = useRouter()

  const onError: SubmitErrorHandler<TeacherInputs> = (errors) => {
    console.log(`Add Teacher Errors: `, errors)
  }

  const onSubmit: SubmitHandler<TeacherInputs> = async (values) => {
    const result = await action.executeAsync(values)

    if (result?.data?.teacher) {
      toast.success("Teacher saved!")

      form.reset()

      router.replace("/teachers")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="container max-w-screen-lg py-6"
      >
        <div className="mb-4 flex items-start gap-4">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go back"
            asChild
          >
            <Link href={`/teachers`}>
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Add Teacher</h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details below.
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/teachers`}>Discard</Link>
            </Button>
            <SubmitButton size="sm" loading={action.isPending}>
              Save Teacher
            </SubmitButton>
          </div>
        </div>
        <div className="grid grid-cols-3 items-start gap-6">
          <fieldset
            disabled={action.isPending}
            className="bg-accent/40 col-span-2 space-y-3 rounded-lg border p-6 disabled:cursor-wait disabled:opacity-90"
          >
            <p className="text-muted-foreground text-xs uppercase">
              Teacher Details
            </p>
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher ID (Employee ID)</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="Teacher ID or Employee ID"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The teacher&apos;s employee ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input
                      list="common-designations"
                      placeholder="Designation"
                      {...field}
                    />
                  </FormControl>
                  <datalist id="common-designations">
                    <option value="Teacher I"></option>
                    <option value="Teacher II"></option>
                    <option value="Teacher III"></option>
                    <option value="Master Teacher I"></option>
                    <option value="Master Teacher II"></option>
                    <option value="Master Teacher III"></option>
                  </datalist>
                  <FormDescription>
                    The position of the teacher.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Middle Name{" "}
                      <span className="text-muted-foreground text-xs italic">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="suffix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Suffix{" "}
                      <span className="text-muted-foreground text-xs italic">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Suffix"
                        list="common-suffixes"
                        {...field}
                      />
                    </FormControl>
                    <datalist id="common-suffixes">
                      <option value="Jr"></option>
                      <option value="Sr"></option>
                      <option value="I"></option>
                      <option value="II"></option>
                      <option value="III"></option>
                      <option value="IV"></option>
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        type="tel"
                        inputMode="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-start-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={Gender.MALE} />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={Gender.FEMALE} />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <div>
            <fieldset
              disabled={action.isPending}
              className="bg-accent/40 space-y-3 rounded-lg border p-6 disabled:cursor-wait disabled:opacity-90"
            >
              <p className="text-muted-foreground text-xs uppercase">Program</p>

              <FormField
                control={form.control}
                name="programOfferingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e)
                        form.setValue("facultyId", "")
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programs.data?.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The program in which the teacher belongs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facultyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("programOfferingId")}
                      key={form.watch("programOfferingId")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {faculties.data?.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The faculty/department in which the teacher belongs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>
        </div>
      </form>
    </Form>
  )
}
