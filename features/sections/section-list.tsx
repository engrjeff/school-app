"use client"

import { useRef, useState } from "react"
import { Section } from "@prisma/client"
import {
  ChevronDown,
  Grid2x2CheckIcon,
  ImportIcon,
  PlusCircleIcon,
  PlusIcon,
} from "lucide-react"
import { Reorder } from "motion/react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"

import { reorderSections } from "./actions"
import { BulkSectionForm } from "./bulk-section-form"
import { SectionForm } from "./section-form"
import { SectionImportForm } from "./section-import-form"
import { SectionListItem } from "./section-list-item"

interface Props {
  gradeYearLevelId: string
  currentSections: Section[]
}

export function SectionList({ gradeYearLevelId, currentSections }: Props) {
  const [orderedSections, setOrderedSections] = useState(() => currentSections)

  const currentOrderRef = useRef(currentSections.map((s) => s.order).join(""))

  const orderChanged =
    currentOrderRef.current !== orderedSections.map((s) => s.order).join("")

  const reorderAction = useAction(reorderSections, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  async function handleReorderSave() {
    const result = await reorderAction.executeAsync(orderedSections)

    if (result?.data?.updatedSections) {
      toast.success("Sections reordered.")
    }
  }

  if (currentSections.length === 0)
    return (
      <div>
        <p className="text-muted-foreground mb-3 text-xs font-medium uppercase">
          Sections
        </p>
        <div className="w-1/2 space-y-3">
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground text-center text-sm">
              No sections listed yet.
            </p>
          </div>
          <SectionForms
            gradeYearLevelId={gradeYearLevelId}
            currentSections={currentSections}
          />
        </div>
      </div>
    )

  return (
    <div className="grid grid-cols-2 items-start gap-6">
      <ScrollArea className="h-[60dvh] pr-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Sections ({currentSections.length})
          </p>
          {orderChanged ? (
            <SubmitButton
              type="button"
              size="sm"
              className="mr-1"
              onClick={handleReorderSave}
              loading={reorderAction.isPending}
            >
              Save
            </SubmitButton>
          ) : null}
        </div>
        <Reorder.Group
          as="ul"
          values={orderedSections}
          onReorder={setOrderedSections}
          className="space-y-2 p-1"
        >
          {orderedSections.map((section) => (
            <SectionListItem key={section.id} section={section} />
          ))}
        </Reorder.Group>
      </ScrollArea>
      <SectionForms
        gradeYearLevelId={gradeYearLevelId}
        currentSections={currentSections}
      />
    </div>
  )
}

function SectionForms({ gradeYearLevelId, currentSections }: Props) {
  const [activeForm, setActiveForm] = useState<"single" | "bulk" | "import">()

  if (activeForm === "single")
    return (
      <SectionForm
        gradeYearLevelId={gradeYearLevelId}
        currentSections={currentSections}
        onCancel={() => setActiveForm(undefined)}
      />
    )

  if (activeForm === "bulk")
    return (
      <BulkSectionForm
        gradeYearLevelId={gradeYearLevelId}
        currentSections={currentSections}
        onCancel={() => setActiveForm(undefined)}
      />
    )

  return (
    <div className="space-y-2">
      <Button
        type="button"
        size="sm"
        variant="secondaryOutline"
        className="hidden w-full"
        onClick={() => setActiveForm("single")}
      >
        <PlusCircleIcon /> Add Section
      </Button>

      <Button
        type="button"
        size="sm"
        variant="secondaryOutline"
        className="w-full"
        onClick={() => setActiveForm("bulk")}
      >
        <PlusIcon /> Add Sections
      </Button>

      <div className="flex items-center">
        <Button
          type="button"
          size="sm"
          variant="secondaryOutline"
          className="flex-1 rounded-r-none"
          onClick={() => setActiveForm("import")}
        >
          <ImportIcon /> Import
        </Button>
        <Separator orientation="vertical" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="iconXs"
              variant="secondaryOutline"
              className="rounded-l-none border-l-0"
              aria-label="view menu"
            >
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a
                href="/templates/edumetrics-section-import-template.xlsx"
                download
                target="_blank"
              >
                <Grid2x2CheckIcon
                  size={16}
                  strokeWidth={2}
                  className="opacity-60"
                  aria-hidden="true"
                />
                Download Template
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={activeForm === "import"}
        onOpenChange={() => setActiveForm(undefined)}
      >
        <DialogContent className="overflow-hidden sm:max-w-screen-md">
          <DialogHeader>
            <DialogTitle>Import Sections</DialogTitle>
            <DialogDescription asChild>
              <div>
                Upload a <Badge variant="code">.xlsx</Badge> or{" "}
                <Badge variant="code">.csv</Badge> file.
              </div>
            </DialogDescription>
          </DialogHeader>
          <SectionImportForm
            gradeYearLevelId={gradeYearLevelId}
            currentSections={currentSections}
            onCancel={() => setActiveForm(undefined)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
