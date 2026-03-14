// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PROTECTED_ROUTES = ["/dashboard", "/interview"];

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const isProtected = PROTECTED_ROUTES.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (isProtected) {
//     const token = request.cookies.get("token")?.value;
//     if (!token) {
//       const loginUrl = new URL("/login", request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/interview/:path*"],
// };


import { NextResponse } from "next/server";

export function proxy() {
  return NextResponse.next();
}