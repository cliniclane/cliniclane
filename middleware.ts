export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/article/:path*", "/admin", "/admin/pages/:path*", "/admin/users"],
};
