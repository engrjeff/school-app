import { ROLE } from "@prisma/client"

export const AUTH_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/sign-up/teacher",
  "/verify",
  "/reset-password",
]

export const API_ROUTES = [
  "/api/courses",
  "/api/faculties",
  "/api/grade-year-levels",
  "/api/program-offerings",
  "/api/school-years",
  "/api/semesters",
  "/api/sections",
  "/api/subjects",
  "/api/teachers",
  "/api/students",
]

export const API_AUTH_PREFIX = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

export const SCHOOL_SETUP_REDIRECT = "/setup-school"

export const CURRICULUM_SETUP_REDIRECT = "/setup-curriculum"

export const NO_ACCESS_PAGE = "/unauthorized"

export const TEACHER_PORTAL = "/teacher-portal"

export const SCHOOL_ADMIN_ROUTES = [
  "/dashboard",
  "/teachers",
  "/students",
  "/program-offerings",
  "/courses",
  "/faculties",
  "/sections",
  "/school-profile",
  "/school-years",
  "/setup-school",
  "/setup-curriculum",
  "/classes",
]

export const TEACHER_ROUTES = [
  "/dashboard",
  "/my-students",
  "/classes",
  "/school-profile",
]

export const STUDENT_ROUTES = ["/my-grades", "/classes"]

export const ROLE_ROUTES_MAP: Record<ROLE, string[]> = {
  SCHOOLADMIN: SCHOOL_ADMIN_ROUTES,
  TEACHER: TEACHER_ROUTES,
  STUDENT: STUDENT_ROUTES,
  SUPERADMIN: ["*"],
}
