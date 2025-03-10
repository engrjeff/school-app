"use client"

import { useState } from "react"
import { Section } from "@prisma/client"
import { GripVerticalIcon, PencilIcon } from "lucide-react"
import { Reorder, useDragControls } from "motion/react"

import { Button } from "@/components/ui/button"

import { SectionListItemActions } from "./section-list-item-actions"
import { SectionUpdateForm } from "./section-update-form"

export function SectionListItem({ section }: { section: Section }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const controls = useDragControls()

  if (isUpdating)
    return (
      <SectionUpdateForm
        section={section}
        onCancel={() => setIsUpdating(false)}
      />
    )

  return (
    <Reorder.Item
      key={section.id}
      value={section}
      dragListener={false}
      dragControls={controls}
      as="li"
    >
      <div className="bg-secondary/20 text-secondary-foreground flex h-9 items-center justify-between gap-2 rounded-md border p-2 px-1 text-sm shadow-sm">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="text-muted-foreground hover:text-primary cursor-grabbing"
        >
          <GripVerticalIcon className="size-3" />
        </button>
        <p>{section.name}</p>
        <div className="ml-auto flex items-center">
          <Button
            type="button"
            size="iconXXs"
            variant="ghost"
            aria-label="Edit"
            className="hover:border [&_svg]:size-3"
            onClick={() => setIsUpdating(true)}
          >
            <PencilIcon className="size-3" />
          </Button>
          <SectionListItemActions section={section} />
        </div>
      </div>
    </Reorder.Item>
  )
}
