import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

function ClassNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center  gap-3 text-center">
      <h2 className="text-primary text-lg font-semibold">404</h2>
      <h1 className="text-2xl font-semibold">Class Not Found</h1>
      <Link href="/classes" className={buttonVariants({ size: "sm" })}>
        Go to Class List
      </Link>
    </div>
  )
}

export default ClassNotFound
