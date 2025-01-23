export function AuthFooter() {
  return (
    <footer className="invisible mt-4 lg:visible lg:mt-0 lg:border-t">
      <p className="container py-4 text-center text-xs">
        Lendr App &copy; {new Date().getFullYear()}. Made by{" "}
        <a
          href="https://jeffsegovia.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold"
        >
          Jeff Segovia
        </a>
        .
      </p>
    </footer>
  )
}
