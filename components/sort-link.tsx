"use client"

import { Suspense, useCallback, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react"
import { parseAsString, useQueryStates } from "nuqs"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SortLinkProps {
  title: string
  sortValue: string
  className?: string
}

function SortLinkComponent({ title, sortValue, className }: SortLinkProps) {
  const sortParamKey = "sort"
  const orderParamKey = "order"

  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get(sortParamKey)
  const currentOrder = searchParams.get(orderParamKey)

  const ORDERS = ["desc", "asc", null]

  const [orderIndex, setOrderIndex] = useState(() =>
    currentOrder ? ORDERS.indexOf(currentOrder) + 1 : 0
  )

  const order = ORDERS[orderIndex % 3]

  const createQueryString = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(
        searchParams ? searchParams : undefined
      )

      if (order !== null) {
        params.set(sortParamKey, sort)
        params.set(orderParamKey, order)
      } else {
        params.delete(sortParamKey)
        params.delete(orderParamKey)
      }

      return params.toString()
    },
    [searchParams, order]
  )

  return (
    <Link
      href={`${pathname}?${createQueryString(sortValue)}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "text-muted-foreground h-10 p-0 font-medium",
        className
      )}
      onClick={() => setOrderIndex((c) => c + 1)}
    >
      <span>{title}</span>
      {currentSort === sortValue ? (
        currentOrder === "desc" ? (
          <ArrowDownIcon className="ml-1.5 size-4" />
        ) : currentOrder === "asc" ? (
          <ArrowUpIcon className="ml-1.5 size-4" />
        ) : (
          <ChevronsUpDownIcon className="ml-1.5 size-4" />
        )
      ) : (
        <ChevronsUpDownIcon className="ml-1.5 size-4" />
      )}
    </Link>
  )
}

export function SortLink(props: SortLinkProps) {
  return (
    <Suspense>
      <SortLinkComponent {...props} />
    </Suspense>
  )
}

export function useSortState(initialSort?: string, initialOrder?: string) {
  const searchParams = useSearchParams()

  const sortQuery = searchParams.get("sort")
  const orderQuery = searchParams.get("order")

  const [sortOrder, setSortOrder] = useQueryStates({
    sort: parseAsString
      .withDefault(initialSort ? initialSort : sortQuery ? sortQuery : "")
      .withOptions({ shallow: false }),
    order: parseAsString
      .withDefault(initialOrder ? initialOrder : orderQuery ? orderQuery : "")
      .withOptions({ shallow: false }),
  })

  return [sortOrder, setSortOrder] as const
}
