import { KeyboardEventHandler } from "react"

export const handleGradeCellNavigation: KeyboardEventHandler<
  HTMLTableSectionElement
> = (e) => {
  const tableInput = e.target as HTMLElement

  if (tableInput.tagName !== "INPUT") return

  if (!e.key) return

  // current position
  const pos = tableInput.dataset.pos?.split("-").map(Number)

  if (!pos) return

  const [row, col] = pos

  if (e.key === "ArrowUp") {
    const input = document.querySelector<HTMLInputElement>(
      `[data-pos="${row - 1}-${col}"]`
    )

    if (!input) return

    input.focus()
    input.select()

    return
  }

  if (e.key === "ArrowDown") {
    const input = document.querySelector<HTMLInputElement>(
      `[data-pos="${row + 1}-${col}"]`
    )

    if (!input) return

    input.focus()

    return
  }

  if (e.key === "ArrowLeft") {
    const input = document.querySelector<HTMLInputElement>(
      `[data-pos="${row}-${col - 1}"]`
    )

    if (!input) return

    input.focus()

    return
  }

  if (e.key === "ArrowRight") {
    const input = document.querySelector<HTMLInputElement>(
      `[data-pos="${row}-${col + 1}"]`
    )

    if (!input) return

    input.focus()

    return
  }
}
