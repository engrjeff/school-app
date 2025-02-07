"use client"

import { useState } from "react"
import { CURRICULUM_SETUP_REDIRECT } from "@/routes"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { arrayToMap } from "@/lib/utils"
import { useCities, useProvinces, useRegions } from "@/hooks/use-addresses"
import { AppCombobox } from "@/components/ui/app-combobox"
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
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

import { createSchool } from "./action"
import { SchoolInputs, schoolSchema } from "./schema"

export function SchoolForm() {
  const { update: updateSession } = useSession()

  const form = useForm<SchoolInputs>({
    defaultValues: {
      // name: "Morong National High School",
      // schoolId: "301452",
      // address: "T. Claudio Street, Barangay San Juan",
      // zipCode: "1960",
      // fullAddress: "",
      // phone: "+639211231234",
      // email: "admin@mnhs.edu",
      // website: "https://mnhs.edu",
      // logo: "",
      // slogan: "Education is first.",
      name: "",
      shortName: "",
      schoolId: "",
      address: "",
      zipCode: "",
      fullAddress: "",
      phone: "",
      email: "",
      website: "",
      logo: "",
      slogan: "",
    },
    resolver: zodResolver(schoolSchema),
    mode: "onChange",
  })

  const [step, setStep] = useState(1)

  const action = useAction(createSchool, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "An error occurred."),
  })

  // addresses
  const { data: regions } = useRegions()

  const { data: provinces } = useProvinces(form.watch("region"))

  const { data: cities } = useCities(form.watch("province"))

  async function goToNext() {
    if (step === 1) {
      const isStepOneValid = await form.trigger(
        ["name", "shortName", "schoolId"],
        {
          shouldFocus: true,
        }
      )
      if (!isStepOneValid) return
    }

    if (step === 2) {
      const isStepTwoValid = await form.trigger(
        ["address", "region", "province", "town"],
        { shouldFocus: true }
      )
      if (!isStepTwoValid) return
    }

    if (step === 3) {
      const isStepThreeValid = await form.trigger(
        ["phone", "email", "website"],
        { shouldFocus: true }
      )
      if (!isStepThreeValid) return
    }

    setStep((currentStep) => currentStep + 1)
  }

  function goBack() {
    setStep((currentStep) =>
      currentStep === 1 ? currentStep : currentStep - 1
    )
  }

  const onError: SubmitErrorHandler<SchoolInputs> = (errors) => {
    console.error("Setup School Errors: ", errors)
  }

  const onSubmit: SubmitHandler<SchoolInputs> = async (data) => {
    const regionName = arrayToMap(
      regions ?? [],
      "region_code",
      "region_name"
    ).get(form.getValues("region"))

    const provinceName = arrayToMap(
      provinces ?? [],
      "province_code",
      "province_name"
    ).get(form.getValues("province"))

    const townName = arrayToMap(cities ?? [], "city_code", "city_name").get(
      form.getValues("town")
    )

    const fullAddress = [
      form.getValues("address"),
      townName,
      provinceName,
      regionName,
      form.getValues("zipCode"),
    ].join(", ")

    const result = await action.executeAsync({
      ...data,
      fullAddress,
    })

    if (result?.data?.school) {
      toast.success("Your school has been set up successfully.")

      await updateSession()

      window.location.href = CURRICULUM_SETUP_REDIRECT
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset className="space-y-3" disabled={action.isPending}>
          {step === 1 ? (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is the name of your school?</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Enter school name"
                        id="name"
                        className="dark:bg-muted/30 h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      What is the short name of your school?
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Enter school short name"
                        id="name"
                        className="dark:bg-muted/30 h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>ex. Morong NHS or MNHS</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is its School ID?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter school ID"
                        id="schoolId"
                        className="dark:bg-muted/30 h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The unique ID that identifies your school.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-6">
                <Button type="button" size="lg" onClick={goToNext}>
                  Next <ArrowRight />
                </Button>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where is your school located?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter school address"
                        id="address"
                        className="dark:bg-muted/30"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Region</FormLabel>
                    <AppCombobox
                      label="Region"
                      inputPlaceholder="Search region..."
                      value={field.value}
                      className="dark:bg-muted/30 h-12"
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue("province", "")
                        form.setValue("town", "")
                      }}
                      options={
                        regions?.map((item) => ({
                          label: item.region_name,
                          value: item.region_code,
                        })) ?? []
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Province</FormLabel>
                      <AppCombobox
                        label="Province"
                        inputPlaceholder="Search province..."
                        value={field.value}
                        className="dark:bg-muted/30 h-12"
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.setValue("town", "")
                        }}
                        options={
                          provinces?.map((item) => ({
                            label: item.province_name,
                            value: item.province_code,
                          })) ?? []
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="town"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Town/City</FormLabel>
                      <AppCombobox
                        label="City/Town"
                        inputPlaceholder="Search town or city..."
                        value={field.value}
                        className="dark:bg-muted/30 h-12"
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                        options={
                          cities?.map((item) => ({
                            label: item.city_name,
                            value: item.city_code,
                          })) ?? []
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Zip Code"
                          autoComplete="new-zipcode"
                          className="dark:bg-muted/30 h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  onClick={goBack}
                >
                  <ArrowLeft /> Back
                </Button>
                <Button type="button" size="lg" onClick={goToNext}>
                  Next <ArrowRight />
                </Button>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Your school's phone number"}</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Enter phone number"
                        id="phone"
                        className="dark:bg-muted/30 h-12"
                        inputMode="tel"
                        type="tel"
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
                  <FormItem>
                    <FormLabel>{"Your school's email address"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email address"
                        id="phone"
                        className="dark:bg-muted/30 h-12"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Your school's website"}{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter school website URL"
                        id="website"
                        className="dark:bg-muted/30 h-12"
                        type="url"
                        inputMode="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  onClick={goBack}
                >
                  <ArrowLeft /> Back
                </Button>
                <Button type="button" size="lg" onClick={goToNext}>
                  Next <ArrowRight />
                </Button>
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Upload your school's logo"} </FormLabel>
                    <FormControl>
                      <Input
                        className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
                        type="file"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slogan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"What's your school slogan?"} </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter school slogan"
                        id="slogan"
                        className="dark:bg-muted/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  onClick={goBack}
                >
                  <ArrowLeft /> Back
                </Button>
                <SubmitButton
                  type="submit"
                  size="lg"
                  loading={action.isPending}
                >
                  Finish <ArrowRight />
                </SubmitButton>
              </div>
            </>
          ) : null}
        </fieldset>
      </form>
    </Form>
  )
}
