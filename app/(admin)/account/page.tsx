import { type Metadata } from "next"
import { AccountForm } from "@/features/account/account-form"
import { getUserAccunt } from "@/features/account/queries"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "My Account",
}

async function AccountPage() {
  const userAccount = await getUserAccunt()

  return (
    <>
      <AppHeader pageTitle="My Account" />
      <AppContent className="container max-w-screen-md">
        {!userAccount ? (
          <p>No Account found.</p>
        ) : (
          <AccountForm userAccount={userAccount} />
        )}
      </AppContent>
    </>
  )
}

export default AccountPage
