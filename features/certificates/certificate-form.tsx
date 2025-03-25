/* eslint-disable jsx-a11y/alt-text */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { School } from "@prisma/client"
import {
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { createCertificateTemplate } from "./actions"
import { CertificateInputs, certificateSchema } from "./schema"

// Register font
Font.register({
  family: "LibreBaskerville",
  src: "https://fonts.gstatic.com/s/librebaskerville/v4/pR0sBQVcY0JZc_ciXjFsKwAUTJOA6-irsSazDq377BE.ttf",
})

Font.register({
  family: "AlexBrush",
  src: "https://fonts.gstatic.com/s/alexbrush/v6/IdwaSrUcr-IskDo5YUNTVS3USBnSvpkopQaUR-2r7iU.ttf",
})

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Times-Roman",
    paddingVertical: 32,
    paddingHorizontal: 120,
  },
  heading: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
  },
  logo: {
    width: 80,
    height: 80,
  },
  headingText: {
    flexGrow: 1,
    alignItems: "center",
  },
  headingTextLine1: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: "semibold",
  },
  headingTextLine2: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  headingTextLine3: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  headingTextLine4: {
    fontSize: 12,
    fontWeight: "semibold",
    textTransform: "uppercase",
  },
  mainText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  mainText2: {
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "AlexBrush",
    marginVertical: 16,
  },
  body: {
    fontSize: 20,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 1.2,
  },
  strong: {
    fontWeight: "semibold",
  },
  signatory: {
    fontWeight: "semibold",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 16,
    textDecoration: "underline",
  },
  signatoryPos: {
    textAlign: "center",
    fontSize: 16,
  },
})

export function CertificateTemplate({
  schoolName,
  name,
  details,
}: {
  schoolName: string
  name: string
  details: CertificateInputs
}) {
  return (
    <Document title={details.name ?? "Name of Certificate"}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        >
          <Image
            src={process.env.NEXT_PUBLIC_SITE_URL + details.frameSrc}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={styles.heading}>
          <Image
            src={process.env.NEXT_PUBLIC_SITE_URL + details.logo1}
            style={styles.logo}
          />
          <View style={styles.headingText}>
            <Text style={styles.headingTextLine1}>{details.headingLine1}</Text>
            <Text style={styles.headingTextLine2}>{details.headingLine2}</Text>
            <Text style={styles.headingTextLine3}>{details.headingLine3}</Text>
            <Text style={styles.headingTextLine3}>{details.headingLine4}</Text>
            <Text style={styles.headingTextLine4}>{schoolName}</Text>
          </View>
          <Image
            src={process.env.NEXT_PUBLIC_SITE_URL + details.logo2}
            style={styles.logo}
          />
        </View>

        <Text style={styles.mainText}>{details.mainTitle}</Text>
        <Text style={styles.mainText2}>{details.bodyLine1}</Text>
        <Text style={styles.name}>{name}</Text>

        <View style={{ marginVertical: 8 }}>
          <Text style={styles.body}>{details.bodyLine2}</Text>
          <Text style={styles.body}>{details.bodyLine3}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            justifyContent:
              details.signatories.length === 1 ? "center" : "space-between",
          }}
        >
          {details.signatories.map((signatory, sIndex) => (
            <View key={sIndex} style={{ alignItems: "center" }}>
              <Text style={styles.signatory}>{signatory.name}</Text>
              <Text style={styles.signatoryPos}>{signatory.designation}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export function CertificateViewer(props: {
  schoolName: string
  name: string
  details: CertificateInputs
}) {
  return (
    <PDFViewer showToolbar={false} className="h-[85%] w-full">
      <CertificateTemplate {...props} />
    </PDFViewer>
  )
}

export function CertificateForm({ school }: { school: School }) {
  const router = useRouter()

  const form = useForm<CertificateInputs>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: "",
      frameSrc: "/images/cert-media/cert_frame_2.png",
      logo1: "/images/cert-media/deped_logo.png",
      logo2: "/images/cert-media/mnhs.jpeg",
      headingLine1: "Republic of the Philippines",
      headingLine2: "Department of Education",
      headingLine3: "Region IV-A CALABARZON",
      headingLine4: "Division of Rizal",
      mainTitle: "Certificate of Recognition",
      bodyLine1: "This certificate is awarded to",
      bodyLine2: `In recognition of his/her exceptional performance as {{ rank }}, achieving an average of {{ average }} during the School Year {{ schoolYear }}.`,
      bodyLine3: `Given this 12th day of March at ${school.name}, Morong, Rizal.`,
      signatories: [
        { name: "Sarah Smith", designation: "Principal" },
        { name: "James Peterson", designation: "Grade Level Coordinator" },
      ],
    },
  })

  const [certDetails, setCertDetails] = useState({
    name: "",
    frameSrc: "/images/cert-media/cert_frame_2.png",
    logo1: "/images/cert-media/deped_logo.png",
    logo2: "/images/cert-media/mnhs.jpeg",
    headingLine1: "Republic of the Philippines",
    headingLine2: "Department of Education",
    headingLine3: "Region IV-A CALABARZON",
    headingLine4: "Division of Rizal",
    mainTitle: "Certificate of Recognition",
    bodyLine1: "This certificate is awarded to",
    bodyLine2: `In recognition of his/her exceptional performance as {{ rank }}, achieving an average of {{ average }} during the School Year {{ schoolYear }}.`,
    bodyLine3: `Given this 12th day of March at ${school.name}, Morong, Rizal.`,
    signatories: [
      { name: "Sarah Smith", designation: "Principal" },
      { name: "James Peterson", designation: "Grade Level Coordinator" },
    ],
  })

  const signatories = useFieldArray({
    control: form.control,
    name: "signatories",
  })

  const action = useAction(createCertificateTemplate, {
    onError({ error }) {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  const onError: SubmitErrorHandler<CertificateInputs> = (errors) => {
    console.log(`Create certificate template error: `, errors)
  }

  const onSubmit: SubmitHandler<CertificateInputs> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.certTemplate?.id) {
      toast.success("Certificate template created successfully.")

      router.replace("/certificates")
    }
  }

  return (
    <div className="grid h-full grid-cols-5 gap-4">
      <div className="col-span-2 border-r pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <fieldset
              className="space-y-3 disabled:cursor-not-allowed"
              disabled={action.isPending}
            >
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Certificate Details
              </p>

              <Tabs defaultValue="heading">
                <TabsList>
                  <TabsTrigger value="heading" type="button">
                    Heading
                  </TabsTrigger>
                  <TabsTrigger value="body" type="button">
                    Body
                  </TabsTrigger>
                  <TabsTrigger value="signatory" type="button">
                    Signatory
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="heading" className="space-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Certificate for Recognition"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Name your template.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="headingLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading Line 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Republic of the Philippines"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="headingLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading Line 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Department of Education"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="headingLine3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading Line 3</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Region IV-A CALABARZON"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="headingLine4"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading Line 4</FormLabel>
                        <FormControl>
                          <Input placeholder="Division of Rizal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="body" className="space-y-3">
                  <FormField
                    control={form.control}
                    name="mainTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Title</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Certificate of Recognition"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bodyLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Line 1</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="This certificate is awarded to..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bodyLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Line 2</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="In recognition of his/her exceptional performance as..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          rank, avergage, and schoolYear are dynamic values.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bodyLine3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Line 3</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Given this 12th day of March..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="signatory" className="space-y-3">
                  {signatories.fields.map((field, fieldIndex) => (
                    <div
                      key={`signatory-${field.id}`}
                      className={cn(
                        "grid grid-cols-[1fr_1fr_40px] gap-2",
                        fieldIndex === 0 ? "items-end" : ""
                      )}
                    >
                      <FormField
                        control={form.control}
                        name={`signatories.${fieldIndex}.name`}
                        render={({ field }) => (
                          <FormItem
                            className={cn(fieldIndex > 0 ? "space-y-0" : "")}
                          >
                            <FormLabel
                              className={cn(fieldIndex > 0 ? "sr-only" : "")}
                            >
                              Name
                            </FormLabel>
                            <Input placeholder="Name" {...field} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`signatories.${fieldIndex}.designation`}
                        render={({ field }) => (
                          <FormItem
                            className={cn(fieldIndex > 0 ? "space-y-0" : "")}
                          >
                            <FormLabel
                              className={cn(fieldIndex > 0 ? "sr-only" : "")}
                            >
                              Teacher
                            </FormLabel>
                            <Input placeholder="Designation" {...field} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        aria-label="remove signatory"
                        className="hover:text-red-500"
                        disabled={signatories.fields.length === 1}
                        onClick={() => signatories.remove(fieldIndex)}
                      >
                        <XCircleIcon />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    size="sm"
                    variant="secondaryOutline"
                    disabled={signatories.fields.length === 3}
                    onClick={async () => {
                      const isValidSoFar = await form.trigger("signatories")

                      if (!isValidSoFar) return

                      signatories.append({ name: "", designation: "" })
                    }}
                  >
                    <PlusIcon /> Add Signatory
                  </Button>
                </TabsContent>
              </Tabs>
            </fieldset>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                size="sm"
                variant="secondaryOutline"
                onClick={() => {
                  setCertDetails(form.getValues())
                }}
              >
                Preview Data
              </Button>
              <SubmitButton size="sm" loading={action.isPending}>
                Save Template
              </SubmitButton>
            </div>
          </form>
        </Form>
      </div>
      <div className="col-span-3 flex items-center justify-center">
        <PDFViewer showToolbar={false} className="size-full">
          <CertificateTemplate
            name="Firstname Middle Lastname"
            schoolName={school.name}
            details={certDetails}
          />
        </PDFViewer>
      </div>
    </div>
  )
}
