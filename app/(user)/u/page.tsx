import { redirect } from "next/navigation"
import { getStores } from "@/features/store/queries"

async function UserPage() {
  const stores = await getStores()

  if (!stores.length) return redirect(`/create-store`)

  if (stores.length > 0) return redirect(`/${stores[0].id}/dashboard`)

  return null
}

export default UserPage
