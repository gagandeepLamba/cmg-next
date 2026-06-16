'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, AlertCircle, Building, Sparkles, ArrowRight, Shield, Globe, User, Lock } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-sky-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className={`text-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                <Building className="w-12 h-12 text-white relative z-10" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                DM Consultant Portal
              </h1>
              <p className="text-xl text-gray-300">Advanced Management System</p>
            </div>

            <div className="space-y-6 text-left">
              {[
                {
                  icon: User,
                  title: 'Secure Access',
                  description: 'Enterprise-grade authentication system',
                  color: 'blue'
                },
                {
                  icon: Shield,
                  title: 'Data Protection',
                  description: 'Advanced security for sensitive information',
                  color: 'teal'
                },
                {
                  icon: Globe,
                  title: 'Global Operations',
                  description: 'Multi-branch management capabilities',
                  color: 'cyan'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 transition-all duration-700 delay-${index * 100 + 500} ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-${feature.color}-500/30 backdrop-blur-sm`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={`w-full max-w-md mx-auto transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '700ms' }}>
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-cyan-500/10"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-300">Sign in to your account</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm animate-shake">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-300" />
                    <span className="text-sm text-red-300">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`transition-all duration-300 ${focusedField === 'username' ? 'transform scale-105' : ''}`}>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                    Login ID
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'username' ? 'text-blue-400' : 'text-gray-400'}`} />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter your login ID"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className={`transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-400'}`} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/10 border-white/20"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 hover:text-white transition-colors duration-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="text-center">
                  <p className="text-sm text-gray-300 italic mb-4">
                    "Every contact we have with a customer influences whether or not they'll come back."
                  </p>
                  <p className="text-xs text-gray-400">- Kevin Stirtz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
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
