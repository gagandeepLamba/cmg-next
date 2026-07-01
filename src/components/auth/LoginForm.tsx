'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, AlertCircle, ArrowRight, Shield, Globe, User, Lock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginFormData {
  username: string
  password: string
}

interface LoginResponse {
  message: string
  user: {
    id: number
    name: string
    email: string
    cemail: string
    role: number
    branch: number
    region: number
    type: string
    photo: string
    wfh: number
    permissions?: string[]
  }
}

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: LoginResponse = await response.json()

      if (response.ok) {
        const user = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email || data.user.cemail,
          role: data.user.role === 1 ? 'admin' : String(data.user.role),
          branch: data.user.branch ? String(data.user.branch) : undefined,
          avatar: data.user.photo || undefined,
          permissions: data.user.permissions || (data.user.role === 1 ? ['all'] : []),
        }

        // Keep AuthContext and localStorage in sync before entering protected routes.
        login(user, 'cookie-session')
        
        // Redirect to admin dashboard for all users
        router.replace('/admin')
        router.refresh()
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen cmg-page-shell flex items-center justify-center p-4">
      <div className={`w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] bg-white border border-[var(--cmg-border)] shadow-2xl rounded-lg overflow-hidden transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="hidden lg:flex flex-col justify-between bg-[var(--cmg-blue-dark)] px-10 py-10 text-white">
          <div>
            <div className="inline-flex bg-white rounded-md p-4 shadow-sm">
              <div className="relative h-20 w-44">
                <Image src="/dmc-logo.jpg" alt="DMC Middle East" fill sizes="176px" className="object-contain" priority />
              </div>
            </div>

            <div className="mt-10 max-w-lg">
              <p className="text-sm font-semibold uppercase text-[#A8F090]">DMC Middle East</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight">
                DMC Middle East CRM Portal
              </h1>
              <p className="mt-4 text-base leading-7 text-blue-100">
                A focused workspace for leads, clients, operations, payments, and reporting across every DMC branch.
              </p>
            </div>

            <div className="mt-10 space-y-5">
              {[
                {
                  icon: User,
                  title: 'Team Access',
                  description: 'Role-based access for branch and department workflows.'
                },
                {
                  icon: Shield,
                  title: 'Protected Records',
                  description: 'Secure handling for prospect, client, and finance data.'
                },
                {
                  icon: Globe,
                  title: 'Global Programs',
                  description: 'Organized visibility across immigration services and regions.'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                  style={{ transitionDelay: `${180 + index * 100}ms` }}
                >
                  <div className="w-11 h-11 rounded-md bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm leading-6 text-blue-100">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex items-center gap-3 border-t border-white/15 pt-6 text-sm text-blue-100">
            <CheckCircle2 className="h-5 w-5 text-[var(--cmg-red)]" />
            Built for daily admissions, sales, and operations work.
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 flex justify-center">
              <div className="relative h-20 w-44">
                <Image src="/dmc-logo.jpg" alt="DMC Middle East" fill sizes="176px" className="object-contain" priority />
              </div>
            </div>

            <div>
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center rounded-md bg-[var(--cmg-blue-soft)] px-3 py-1 text-xs font-semibold uppercase text-[var(--cmg-blue)]">
                  Secure sign in
                </div>
                <h2 className="text-3xl font-bold text-[var(--cmg-ink)] mb-2">Welcome back</h2>
                <p className="text-[var(--cmg-muted)]">Sign in to continue to the DMC workspace.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md animate-shake">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-[var(--cmg-red)]" />
                    <span className="text-sm text-[var(--cmg-red)]">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`transition-all duration-300 ${focusedField === 'username' ? 'transform scale-105' : ''}`}>
                  <label htmlFor="username" className="block text-sm font-semibold text-[var(--cmg-ink)] mb-2">
                    Login ID
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'username' ? 'text-[var(--cmg-blue)]' : 'text-[var(--cmg-muted)]'}`} />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--cmg-border)] rounded-md cmg-focus text-[var(--cmg-ink)] placeholder:text-[var(--cmg-muted)] transition-all duration-300"
                      placeholder="Enter your login ID"
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                  <label htmlFor="password" className="block text-sm font-semibold text-[var(--cmg-ink)] mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-[var(--cmg-blue)]' : 'text-[var(--cmg-muted)]'}`} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-[var(--cmg-border)] rounded-md cmg-focus text-[var(--cmg-ink)] placeholder:text-[var(--cmg-muted)] transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--cmg-muted)] hover:text-[var(--cmg-blue)] transition-colors duration-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[var(--cmg-blue)] focus:ring-[var(--cmg-blue)] border-[var(--cmg-border)] rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--cmg-muted)]">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-semibold text-[var(--cmg-blue)] hover:text-[var(--cmg-red)] transition-colors duration-300">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[var(--cmg-blue)] text-white font-semibold rounded-md hover:bg-[var(--cmg-blue-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-[var(--cmg-red)]"></div>
                  <div className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-[var(--cmg-border)]">
                <div className="text-center">
                  <p className="text-sm text-[var(--cmg-muted)] mb-3">
                    Immigration simplified for every client interaction.
                  </p>
                  <p className="text-xs font-semibold uppercase text-[var(--cmg-blue)]">DMC Middle East</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  )
}
