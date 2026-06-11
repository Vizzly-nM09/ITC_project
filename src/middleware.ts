import withAuth from "@/middlewares/withAuth";
import { NextResponse, type NextRequest } from "next/server";

export function mainMiddleware(request: NextRequest) {
  return NextResponse.next();
}

export default withAuth(mainMiddleware);

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/managemen-user/:path*",
    "/manajemen-gelombang/:path*",
    "/managemen-data-umum/:path*",
  ],
};
