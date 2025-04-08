import { CorrectResponse, CorrectResponseItem } from "@prisma/client"

import { cn } from "@/lib/utils"

export function CorrectResponseTally({
  correctResponse,
}: {
  correctResponse: CorrectResponse & { items: CorrectResponseItem[] }
}) {
  return (
    <ul className="max-h-[460px] space-y-2 overflow-y-auto pr-2">
      {correctResponse?.items?.map((question) => (
        <li key={question.id}>
          <div className="bg-accent/60 rounded border p-3">
            <p className="text-sm">{question.question}</p>
            <span className="text-xs font-semibold">Correct Response: </span>
            <span
              className={cn(
                "text-xs font-semibold",
                question.correctCountPercent < 70
                  ? "text-red-500"
                  : "text-emerald-500"
              )}
            >
              {question.correctCount}
            </span>{" "}
            <span
              className={cn(
                "text-xs font-semibold",
                question.correctCountPercent < 70
                  ? "text-red-500"
                  : "text-emerald-500"
              )}
            >
              ({question.correctCountPercent.toFixed(1)}%)
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
