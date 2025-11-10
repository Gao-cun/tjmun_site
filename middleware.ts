import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any
    const isAdmin = token?.role === "ADMIN"
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
        if (isAdminRoute) {
          return (token as any)?.role === "ADMIN"
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}

