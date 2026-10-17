import { useState } from "react"
import { Navigate, useNavigate } from "react-router"
import { useAuth } from "@/lib/auth"
import logo from "@/assets/mairaj-logo.jpeg"

export default function AdminLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(email, password)
      navigate("/admin", { replace: true })
    } catch {
      setError("That email and password don't match. Check them and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Mairaj" className="w-16 h-16 rounded-full object-cover mb-4" />
          <h1 className="font-display text-3xl text-cream">Mairaj Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block font-body text-sm text-cream/70">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-cream/20 focus:border-gold outline-none rounded-md py-3 px-3 font-body text-base text-cream"
            />
          </div>
          <div>
            <label className="mb-2 block font-body text-sm text-cream/70">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-cream/20 focus:border-gold outline-none rounded-md py-3 px-3 font-body text-base text-cream"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-gold py-3 font-body text-base font-medium text-white transition-colors hover:bg-gold/90 disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
