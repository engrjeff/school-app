"use client"

import { useEffect, useState } from "react"
import { ChevronDown, PlusIcon } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

import { cn } from "@/lib/utils"
import { usePageState } from "@/hooks/use-page-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface TableFacetFilterProps {
  title: string
  filterKey: string
  selectedLabelKey?: "label" | "value"
  options: {
    label: string
    value: string
  }[]
  singleSelection?: boolean
  onChangeCallback?: VoidFunction
  shouldSetToOnlyOption?: boolean
}

export function TableFacetFilter({
  filterKey,
  title,
  selectedLabelKey = "value",
  options,
  singleSelection,
  onChangeCallback,
  shouldSetToOnlyOption,
}: TableFacetFilterProps) {
  const [queryParam, setQueryParam] = useQueryState(
    filterKey,
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false })
  )

  useEffect(() => {
    if (!shouldSetToOnlyOption) return

    if (options.length === 1 && !queryParam?.length) {
      setQueryParam([options[0].value])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, options.length, queryParam, shouldSetToOnlyOption])

  return (
    <FilterComponent
      key={queryParam.length.toString()}
      title={title}
      selectedLabelKey={selectedLabelKey}
      options={options}
      queryParam={queryParam}
      onApply={setQueryParam}
      singleSelection={singleSelection}
      onChangeCallback={onChangeCallback}
    />
  )
}

function FilterComponent({
  queryParam,
  title,
  options,
  selectedLabelKey,
  singleSelection,
  onChangeCallback,
  onApply,
}: Omit<TableFacetFilterProps, "filterKey"> & {
  queryParam: string[]
  onApply: (values: string[]) => void
}) {
  const [open, setOpen] = useState(false)

  const [selected, setSelected] = useState<string[]>(queryParam)

  const [page, setPage] = usePageState()

  const labels = selectedLabelKey
    ? options
        .filter((o) => selected.includes(o.value))
        .map((i) => i[selectedLabelKey])
    : selected

  return (
    <Popover
      open={open}
      modal
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelected(queryParam)
        }

        setOpen(isOpen)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="secondaryOutline"
          size="sm"
          className={cn(
            "dark:bg-secondary/40 hover:bg-secondary dark:hover:bg-secondary h-10 justify-start rounded-lg bg-transparent px-2 disabled:cursor-not-allowed md:h-8"
            // selected.length === 0 ? "border-dashed" : ""
          )}
          type="button"
          disabled={options.length === 0}
        >
          <PlusIcon className="size-4" />
          {title}
          {selected.length ? (
            <>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal capitalize"
              >
                {labels[0]}
                {selected.length > 1 ? (
                  <span className="pl-1.5 normal-case">
                    {" "}
                    +{selected.length - 1} more
                  </span>
                ) : null}
              </Badge>
            </>
          ) : null}
          <ChevronDown className="ml-auto size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-popover-trigger-width min-w-[220px] rounded-lg"
      >
        <p className="mb-3 text-sm font-medium ">Filter by {title}</p>
        <div className="max-h-[300px] overflow-y-auto px-1">
          {options.map((option) => (
            <div
              key={title + "-option-" + option.value}
              className="hover:bg-muted -ml-1 mb-0.5 flex items-center space-x-2 rounded-md px-1"
            >
              <Checkbox
                id={option.value}
                checked={selected.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (singleSelection) {
                    setSelected([option.value])
                    return
                  }

                  setSelected((old) =>
                    checked
                      ? [...old, option.value]
                      : old.filter((i) => i !== option.value)
                  )
                }}
              />
              <label
                htmlFor={option.value}
                className="flex-1 py-1.5 text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <Button
            type="button"
            size="sm"
            className="h-[30px] w-full"
            onClick={() => {
              onApply(selected)

              if (onChangeCallback) {
                onChangeCallback()
              }

              setOpen(false)

              if (page) {
                setPage(null)
              }
            }}
          >
            Apply
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-[30px] w-full"
            onClick={() => {
              setSelected([])
              onApply([])
            }}
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
