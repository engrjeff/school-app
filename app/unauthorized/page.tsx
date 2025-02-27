function UnauthorizedPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center  gap-3 text-center">
      <h1 className="text-2xl font-semibold">Forbidden</h1>
      <h2 className="text-primary text-3xl font-semibold">403</h2>

      <p>You do not have enough permission to access the page.</p>
    </div>
  )
}

export default UnauthorizedPage
