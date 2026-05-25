import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login, register, loginWithGoogle } = useAuth()

  const [isRegister, setIsRegister] = useState(false)
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (isRegister && !name.trim()) return setError('Name is required.')
    if (password.length < 6)       return setError('Password must be at least 6 characters.')

    setLoading(true)
    try {
      if (isRegister) {
        await register(name.trim(), email, password)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#1a1a2e]/60 p-8 backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center gap-2">

          {/* Icon */}
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[#f84464]/30 bg-white/[0.03] shadow-[0_0_25px_rgba(248,68,100,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f84464]/20 via-transparent to-transparent" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
              <path d="M7 6.5C7 5.12 8.12 4 9.5 4H14.5C15.88 4 17 5.12 17 6.5V8C17 8.55 17.45 9 18 9H20V15H18C17.45 15 17 15.45 17 16V17.5C17 18.88 15.88 20 14.5 20H9.5C8.12 20 7 18.88 7 17.5V16C7 15.45 6.55 15 6 15H4V9H6C6.55 9 7 8.55 7 8V6.5Z" stroke="#f84464" strokeWidth="1.8" />
              <path d="M10 9.5L15 12L10 14.5V9.5Z" fill="#f84464" />
            </svg>
            <div className="absolute h-16 w-16 rounded-full bg-[#f84464]/10 blur-2xl" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight">
            {isRegister ? 'Create account' : 'Sign in to Spektra'}
          </h1>
          <p className="text-sm text-white/50">Premium event booking platform</p>
        </div>



        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
          />
          {error && <p className="text-xs text-[#f84464]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#f84464] py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white/45">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsRegister((s) => !s); setError('') }}
            className="text-[#f84464] hover:underline"
          >
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}
