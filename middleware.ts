export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect all routes except home page, user pages, startup detail pages, public assets, and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|user|startup|$).*)",
  ],
};
