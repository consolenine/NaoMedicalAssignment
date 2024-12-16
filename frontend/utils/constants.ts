const constants = {
  AUTH_COOKIE: process.env.NEXT_PUBLIC_AUTH_COOKIE || "token",
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
}
export default constants;