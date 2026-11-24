import { Head, useForm } from '@inertiajs/react';
import {
  LoaderCircle, Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft,
  User, Star, Mail as MailIcon, Lock as LockIcon, ArrowRight as ArrowRightIcon,
  ChevronUp, ChevronDown, Briefcase, Building2, TrendingUp, Users,
  Sparkles, FileText, Bell, Search, Shield, Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  const fillDemoAccount = (email, password) => {
    setData({ email, password, remember: data.remember });
    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.focus();
  };

  const demoAccounts = [
    {
      role: 'Job Seeker',
      email: 'jobseeker@example.com',
      password: 'password',
      icon: User,
      description: 'Browse jobs, apply, and track applications',
      badge: 'Job Seeker',
      badgeColor: 'bg-orange-100 text-orange-700',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      role: 'Employer',
      email: 'employer@example.com',
      password: 'password',
      icon: Building2,
      description: 'Post jobs and manage applications',
      badge: 'Employer',
      badgeColor: 'bg-blue-100 text-blue-700',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      role: 'Admin',
      email: 'admin@example.com',
      password: 'password',
      icon: Shield,
      description: 'Manage the platform and users',
      badge: 'Admin',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      bgGradient: 'from-indigo-50 to-indigo-100',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
  ];

  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const currentAccount = demoAccounts[currentDemoIndex];
  const goToPrevious = () => setCurrentDemoIndex((p) => (p === 0 ? demoAccounts.length - 1 : p - 1));
  const goToNext = () => setCurrentDemoIndex((p) => (p === demoAccounts.length - 1 ? 0 : p + 1));

  const stats = [
    { value: '10K+', label: 'Active Jobs', icon: Briefcase },
    { value: '2.5K+', label: 'Companies', icon: Building2 },
    { value: '50K+', label: 'Job Seekers', icon: Users },
    { value: '95%', label: 'Success Rate', icon: TrendingUp },
  ];

  const features = [
    { icon: Search, title: 'Smart Match' },
    { icon: FileText, title: 'Resume' },
    { icon: Bell, title: 'Job Alerts' },
    { icon: TrendingUp, title: 'Track Apps' },
  ];

  return (
    <>
      <Head title="Sign in · RecruitHub" />

      <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#FDFDFC] p-4 text-[#1b1b18] sm:p-6 lg:justify-center lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-50/40 via-transparent to-amber-50/30" />
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-50/20 blur-3xl" />

        <div className="relative z-10 flex w-full items-center justify-center">
          <main className="flex w-full flex-col items-stretch max-w-md lg:max-w-5xl lg:flex-row">
            {/* LEFT — LOGIN FORM */}
            <div className="flex-1 border border-[#19140015] bg-white/90 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-8 lg:p-10 rounded-2xl">
              <a
                href="/"
                className="group mb-6 inline-flex items-center gap-1.5 text-xs text-[#706f6c] transition-colors hover:text-[#1b1b18]"
              >
                <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                Back to home
              </a>

              <div className="mb-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-600">
                      Welcome to
                    </p>
                    <h1 className="text-lg font-bold leading-tight text-[#1b1b18] sm:text-xl">
                      RecruitHub
                    </h1>
                    <p className="text-xs text-[#706f6c]">Job Seeker Portal</p>
                  </div>
                </div>
                <p className="text-sm text-[#706f6c]">
                  Sign in to continue your job search journey
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-[#1b1b18]">
                    Email address
                  </label>
                  <div
                    className={`relative rounded-lg transition-all duration-200 ${focusedField === 'email'
                      ? 'ring-2 ring-orange-500/30 ring-offset-1'
                      : ''
                      }`}
                  >
                    <input
                      id="email"
                      type="email"
                      required
                      autoFocus
                      tabIndex={1}
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="email@example.com"
                      className="peer w-full rounded-lg border border-[#19140035] bg-white py-3 pl-10 pr-3 text-sm transition-all duration-200 placeholder:text-[#a09f9c] focus:border-orange-400 focus:outline-none"
                    />
                    <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706f6c] transition-colors peer-focus:text-orange-600" />
                  </div>
                  {errors.email && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-[#1b1b18]">
                      Password
                    </label>
                    {canResetPassword && (
                      <a
                        href={route('password.request')}
                        className="text-xs text-[#706f6c] underline-offset-4 transition-colors hover:text-[#1b1b18] hover:underline"
                        tabIndex={5}
                      >
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div
                    className={`relative rounded-lg transition-all duration-200 ${focusedField === 'password'
                      ? 'ring-2 ring-orange-500/30 ring-offset-1'
                      : ''
                      }`}
                  >
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      tabIndex={2}
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className="peer w-full rounded-lg border border-[#19140035] bg-white py-3 pl-10 pr-10 text-sm transition-all duration-200 placeholder:text-[#a09f9c] focus:border-orange-400 focus:outline-none"
                    />
                    <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706f6c] transition-colors peer-focus:text-orange-600" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#706f6c] transition-colors hover:text-[#1b1b18]"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <input
                    id="remember"
                    type="checkbox"
                    tabIndex={3}
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-[#19140035] text-orange-600 focus:ring-2 focus:ring-orange-500/40"
                  />
                  <label htmlFor="remember" className="cursor-pointer select-none text-sm text-[#706f6c]">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  tabIndex={4}
                  className="group relative mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#1b1b18] to-[#2a2a26] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:scale-[1.01] hover:shadow-black/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {processing ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in as Job Seeker
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {canResetPassword && (
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#e3e3e0]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-[#706f6c]">or continue with</span>
                    </div>
                  </div>
                )}

                <p className="text-center text-sm text-[#706f6c]">
                  Don't have an account?{' '}
                  <a
                    href={route('register')}
                    className="font-medium text-[#1b1b18] underline-offset-4 transition-colors hover:text-orange-600 hover:underline"
                    tabIndex={5}
                  >
                    Sign up as Job Seeker
                  </a>
                </p>
              </form>

              {status && (
                <div className="mt-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50/80 p-3.5 text-sm font-medium text-green-700 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                  {status}
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#a09f9c]">
                <Shield className="h-3 w-3" />
                <span>Secure login · Your data is protected</span>
              </div>
            </div>

            {/* RIGHT — QUICK LOGIN (demo accounts) */}
            <div className="relative w-full shrink-0 overflow-hidden rounded-b-2xl lg:w-105 lg:rounded-r-2xl lg:rounded-bl-none">
              <div className="absolute inset-0 bg-linear-to-br from-orange-100 via-amber-50 to-orange-50" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.5),transparent_60%)]" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />

              <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-2.5 py-1 text-xs font-medium text-[#1b1b18] backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 text-orange-600" />
                    RecruitHub
                  </div>

                  <h3 className="mb-1 text-lg font-bold leading-snug text-[#1b1b18]">
                    Find your dream job faster
                  </h3>
                  <p className="mb-5 text-sm text-[#5c5b56]">
                    Connecting talent with meaningful opportunities
                  </p>

                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-white/70 bg-white/70 p-2.5 backdrop-blur-sm"
                      >
                        <div className="mb-0.5 flex items-center gap-1.5">
                          <s.icon className="h-3 w-3 text-orange-600" />
                          <span className="text-[10px] font-medium text-[#706f6c]">
                            {s.label}
                          </span>
                        </div>
                        <p className="text-base font-bold text-[#1b1b18]">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {features.map((f) => (
                      <div key={f.title} className="text-center">
                        <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg border border-white/70 bg-white/70 backdrop-blur-sm">
                          <f.icon className="h-3.5 w-3.5 text-orange-600" />
                        </div>
                        <p className="text-[10px] font-medium leading-tight text-[#1b1b18]">
                          {f.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#19140020]" />
                    <span className="flex items-center gap-1 text-xs font-medium text-[#5c5b56]">
                      <Star className="h-3 w-3 text-[#F53003]" />
                      Quick Login
                    </span>
                    <div className="h-px flex-1 bg-[#19140020]" />
                  </div>

                  <div className="mb-3 flex items-center justify-center gap-3">
                    <button
                      onClick={goToPrevious}
                      className="rounded-full bg-white/80 p-1.5 shadow-md transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-lg active:scale-95"
                      title="Previous account"
                      aria-label="Previous account"
                    >
                      <ChevronUp className="h-4 w-4 text-[#1b1b18]" />
                    </button>
                    <div className="rounded-full border border-white/60 bg-white/60 px-2.5 py-0.5 text-xs font-medium text-[#706f6c] backdrop-blur-sm">
                      {currentDemoIndex + 1} / {demoAccounts.length}
                    </div>
                    <button
                      onClick={goToNext}
                      className="rounded-full bg-white/80 p-1.5 shadow-md transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-lg active:scale-95"
                      title="Next account"
                      aria-label="Next account"
                    >
                      <ChevronDown className="h-4 w-4 text-[#1b1b18]" />
                    </button>
                  </div>

                  <div key={currentDemoIndex} className="animate-fade-in">
                    <div className="overflow-hidden rounded-xl border border-white/70 bg-white/90 shadow-xl backdrop-blur-md">
                      <div className="p-4">
                        <div className="mb-3 flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${currentAccount.iconBg} shadow-sm`}
                          >
                            <currentAccount.icon className={`h-5 w-5 ${currentAccount.iconColor}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-semibold text-[#1b1b18]">
                                {currentAccount.role}
                              </h4>
                              <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${currentAccount.badgeColor}`}
                              >
                                {currentAccount.badge}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-[11px] text-[#706f6c]">
                              {currentAccount.description}
                            </p>
                          </div>
                        </div>

                        <div className="mb-3 space-y-1.5 rounded-lg border border-[#19140010] bg-[#FDFDFC] p-2.5">
                          <div className="flex items-center gap-2 text-[11px]">
                            <MailIcon className="h-3 w-3 shrink-0 text-[#706f6c]" />
                            <span className="truncate font-mono text-[#1b1b18]">
                              {currentAccount.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            <LockIcon className="h-3 w-3 shrink-0 text-[#706f6c]" />
                            <span className="font-mono text-[#1b1b18]">••••••••</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => fillDemoAccount(currentAccount.email, currentAccount.password)}
                          className="group flex w-full items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-orange-500 to-amber-500 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98]"
                        >
                          <Zap className="h-3 w-3" />
                          <span>Fill Demo Credentials</span>
                          <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-b-2xl shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.08)] lg:rounded-r-2xl lg:rounded-bl-none" />
            </div>
          </main>
        </div>

        <div className="hidden h-14.5 lg:block" />
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
