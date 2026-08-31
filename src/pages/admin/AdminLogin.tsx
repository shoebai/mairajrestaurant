import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "@/lib/auth"
import logo from "@/assets/mairaj-logo.jpeg"

export default function AdminLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    navigate("/admin", { replace: true })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(email, password)
      navigate("/admin", { replace: true })
    } catch {
      setError("Incorrect email or password.")
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
            <label className="font-body text-xs tracking-widest uppercase text-cream/50 block mb-2">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-cream/20 focus:border-gold outline-none py-2.5 px-3 font-body text-cream"
            />
          </div>
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-cream/50 block mb-2">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-cream/20 focus:border-gold outline-none py-2.5 px-3 font-body text-cream"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-gold text-cream py-3 text-xs tracking-mega uppercase font-body hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
