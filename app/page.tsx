import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Tally3Icon } from "lucide-react"

import { site } from "@/config/site"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: `Welcome to ${site.title}`,
}

export default function Home() {
  return (
    <div className="relative flex h-full flex-col overflow-x-hidden">
      <header className="container mx-auto flex max-w-screen-lg items-center p-6">
        <Link
          href="/"
          className="mr-20 inline-flex items-center text-lg font-bold"
        >
          <Tally3Icon className="text-primary size-5" strokeWidth={3} />{" "}
          {site.title}
        </Link>
        <nav className="hidden items-center gap-6 font-medium lg:flex">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/about">ABout Us</Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="secondaryOutline" asChild>
            <Link href="/entry">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Register</Link>
          </Button>
        </div>
      </header>
      <section className="container relative mx-auto grid min-h-screen max-w-screen-lg grid-cols-1 items-start px-6 lg:grid-cols-2">
        <div className="space-y-4 pt-10 lg:pt-32">
          <p className="text-primary font-semibold">{site.title}</p>
          <h1 className="text-5xl font-bold">
            Your modern online school grading and monitoring system.
          </h1>
          <p className="text-muted-foreground">{site.description}</p>
          <div className="pt-6">
            <Button asChild size="lg">
              <Link href="/sign-up">Get Started Now</Link>
            </Button>
          </div>
        </div>

        <div className="h-full">
          <div className="rounded-lg border p-4 shadow lg:absolute lg:-right-2/3 lg:top-20 xl:-right-2/3">
            <Image
              src="/images/hero.png"
              alt={site.title}
              width={1024}
              height={512}
            />
          </div>
        </div>
      </section>
      <footer className="mt-32 border-t">
        <div className="container mx-auto max-w-screen-lg p-6 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <Link
              href="https://flowbite.com/"
              className="mb-4 flex items-center gap-1 sm:mb-0"
            >
              <Tally3Icon className="text-primary size-5" strokeWidth={3} />{" "}
              <span className="self-center whitespace-nowrap text-lg font-semibold">
                {site.title}
              </span>
            </Link>
            <ul className="text-muted-foreground mb-6 flex flex-wrap items-center text-sm font-medium sm:mb-0">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground me-4 hover:underline md:me-6"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-foreground me-4 hover:underline md:me-6"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground hover:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <p className="text-muted-foreground text-sm sm:text-center">
            © {new Date().getFullYear()}{" "}
            <span className="hover:underline">{site.title}™</span>. All Rights
            Reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
