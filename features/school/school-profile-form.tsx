"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { School } from "@prisma/client"
import { ArrowLeftIcon } from "lucide-react"
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

import { updateSchool } from "./action"
import { SchoolInputs, schoolSchema } from "./schema"

export function SchoolProfileForm({ school }: { school: School }) {
  const form = useForm<SchoolInputs>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: school.name,
      shortName: school.shortName,
      schoolId: school.schoolId,
      address: school.address,
      region: school.region,
      province: school.province,
      town: school.town,
      zipCode: school.zipCode,
      phone: school.phone,
      email: school.email,
      website: school.website ?? "",
      logo: school.logo ?? "",
      slogan: school.slogan ?? "",
    },
  })

  const router = useRouter()

  // addresses
  const { data: regions } = useRegions()

  const { data: provinces } = useProvinces(form.watch("region"))

  const { data: cities } = useCities(form.watch("province"))

  const action = useAction(updateSchool, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "An error occurred."),
  })

  const onError: SubmitErrorHandler<SchoolInputs> = (errors) => {
    console.error(`School Profile Errors: `, errors)
  }

  const onSubmit: SubmitHandler<SchoolInputs> = async (values) => {
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
      id: school.id,
      ...values,
      fullAddress,
    })

    if (result?.data?.school) {
      toast.success("Changes were saved successfully.")
      form.reset()
      window.location.reload()
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
            onClick={router.back}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              School information
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage your school&apos;s details.
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <Button
              size="sm"
              variant="secondary"
              type="button"
              onClick={router.back}
            >
              Discard
            </Button>
            <SubmitButton
              size="sm"
              disabled={!form.formState.isDirty}
              loading={action.isPending}
            >
              Save Changes
            </SubmitButton>
          </div>
        </div>

        <fieldset
          disabled={action.isPending}
          className="grid grid-cols-3 gap-10 disabled:cursor-wait disabled:opacity-90"
        >
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              School Logo
            </h3>
            <p className="text-muted-foreground text-sm">
              Give your school a unique identity by uploading your school&apos;s
              logo.
            </p>
          </div>
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem className="bg-accent/40 col-span-2 rounded-lg border p-4">
                <FormLabel>{"Upload your school's logo"} </FormLabel>
                <FormControl>
                  <Input
                    className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
                    type="file"
                    accept="image/*"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              School Information
            </h3>
            <p className="text-muted-foreground text-sm">
              Basic information about your school.
            </p>
          </div>
          <div className="bg-accent/40 col-span-2 space-y-3 rounded-lg border p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is the name of your school?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter school name"
                      id="name"
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
                  <FormLabel>What is the short name of your school?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter school short name"
                      id="name"
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
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The unique ID that identifies your school. Refer to DepEd or
                    CHED.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {"What's your school slogan?"}{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter school slogan"
                      id="slogan"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your school tag line.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              School Address
            </h3>
            <p className="text-muted-foreground text-sm">
              The physical location of your school.
            </p>
          </div>
          <div className="bg-accent/40 col-span-2 space-y-3 rounded-lg border p-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter school street address"
                      id="address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                      className="h-9 bg-transparent"
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
                      className="h-9 bg-transparent"
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
                      disabled={!form.watch("region")}
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
                      className="h-9 bg-transparent"
                      onValueChange={(value) => {
                        field.onChange(value)
                      }}
                      options={
                        cities?.map((item) => ({
                          label: item.city_name,
                          value: item.city_code,
                        })) ?? []
                      }
                      disabled={
                        !form.watch("region") || !form.watch("province")
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              Contact Information
            </h3>
            <p className="text-muted-foreground text-sm">
              Ways for your school to be reached.
            </p>
          </div>
          <div className="bg-accent/40 col-span-2 space-y-3 rounded-lg border p-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Your school's phone number"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      id="phone"
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
                      type="url"
                      inputMode="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        <div className="ml-auto mt-8 flex items-center justify-end space-x-3">
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={router.back}
          >
            Discard
          </Button>
          <SubmitButton
            size="sm"
            disabled={!form.formState.isDirty}
            loading={action.isPending}
          >
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
