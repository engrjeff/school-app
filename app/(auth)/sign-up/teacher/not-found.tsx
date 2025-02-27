function TeacherNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center  gap-3 text-center">
      <h1 className="text-2xl font-semibold">Teacher Not Found</h1>
      <h2 className="text-primary text-lg font-semibold">404</h2>
      <p>
        There must be an issue with the link that was sent to you by the
        Administrator <br /> or there is no record of you yet in the system.
        <br />
        Please contact your school admin.
      </p>
    </div>
  )
}

export default TeacherNotFound
