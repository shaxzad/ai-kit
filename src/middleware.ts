import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/analytics/:path*",
    "/study-plan/:path*",
    "/speaking/:path*",
    "/writing/:path*",
    "/listening/:path*",
    "/reading/:path*",
    "/mock-test/:path*",
    "/leaderboard/:path*",
  ],
};
