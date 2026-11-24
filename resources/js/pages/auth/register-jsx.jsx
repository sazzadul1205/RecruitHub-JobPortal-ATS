import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
  LoaderCircle, Eye, EyeOff, Mail, Lock, Shield, ArrowRight, ArrowLeft,
  CheckCircle, Sparkles, User, Briefcase, Building2, Users, TrendingUp,
  Zap, Bell, Search, FileText, Star,
} from 'lucide-react';

export default function Register({ status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFocusedField(null);
  };

  const getPasswordStrength = (password) => {
    if (!password) {
      return { score: 0, label: '', color: 'bg-gray-200', textColor: '', requirements: [] };
    }

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500'];
    const textColors = ['text-red-600', 'text-orange-600', 'text-amber-600', 'text-lime-600', 'text-green-600', 'text-emerald-600'];

    const requirements = [
      { met: checks.length, text: 'At least 8 characters' },
      { met: checks.uppercase && checks.lowercase, text: 'Uppercase & lowercase' },
      { met: checks.number, text: 'Contains a number' },
      { met: checks.special, text: 'Contains a special character' },
    ];

    return {
      score,
      label: labels[score],
      color: colors[score],
      textColor: textColors[score],
      requirements,
      checks,
    };
  };

  const passwordStrength = getPasswordStrength(data.password);

  const stats = [
    { value: '10K+', label: 'Active Jobs', icon: Briefcase },
    { value: '2.5K+', label: 'Companies', icon: Building2 },
    { value: '50K+', label: 'Job Seekers', icon: Users },
    { value: '95%', label: 'Success Rate', icon: TrendingUp },
  ];

  const benefits = [
    { icon: Search, title: 'Smart Job Matching', text: 'Roles tailored to your skills' },
    { icon: Bell, title: 'Instant Job Alerts', text: 'Never miss a new opening' },
    { icon: FileText, title: 'One-Click Apply', text: 'Save time on every application' },
    { icon: Zap, title: 'Free Forever', text: 'No hidden fees, ever' },
  ];

  return (
    <>
      <Head title="Create Account · RecruitHub" />

      <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#FDFDFC] p-4 text-[#1b1b18] sm:p-6 lg:justify-center lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-50/40 via-transparent to-amber-50/30" />
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-orange-100/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-50/20 blur-3xl" />

        <div
          className={`relative z-10 flex w-full items-center justify-center transition-all duration-700 ease-out lg:grow ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
          <main className="flex w-full max-w-md flex-col items-stretch lg:max-w-5xl lg:flex-row">
            <div className="flex-1 rounded-t-2xl border border-[#19140015] bg-white/90 p-6 pb-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-8 lg:rounded-l-2xl lg:rounded-tr-none lg:rounded-br-none lg:p-10">
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
                <p className="flex items-center gap-1.5 text-sm text-[#706f6c]">
                  Create your free account to start your job search
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
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
                      : touched.email && errors.email
                        ? 'ring-2 ring-red-500/40 ring-offset-1'
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
                      onBlur={() => handleBlur('email')}
                      disabled={processing}
                      placeholder="email@example.com"
                      className={`peer w-full rounded-lg border bg-white py-3 pl-10 pr-10 text-sm transition-all duration-200 placeholder:text-[#a09f9c] focus:border-orange-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.email && touched.email
                          ? 'border-red-500'
                          : 'border-[#19140035]'
                        }`}
                    />
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706f6c] transition-colors peer-focus:text-orange-600" />
                    {data.email && !errors.email && touched.email && (
                      <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-[#1b1b18]">
                    Password
                  </label>
                  <div
                    className={`relative rounded-lg transition-all duration-200 ${focusedField === 'password'
                      ? 'ring-2 ring-orange-500/30 ring-offset-1'
                      : touched.password && errors.password
                        ? 'ring-2 ring-red-500/40 ring-offset-1'
                        : ''
                      }`}
                  >
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      tabIndex={2}
                      autoComplete="new-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => handleBlur('password')}
                      disabled={processing}
                      placeholder="Create a strong password"
                      className={`peer w-full rounded-lg border bg-white py-3 pl-10 pr-10 text-sm transition-all duration-200 placeholder:text-[#a09f9c] focus:border-orange-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.password && touched.password
                          ? 'border-red-500'
                          : 'border-[#19140035]'
                        }`}
                    />
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706f6c] transition-colors peer-focus:text-orange-600" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#706f6c] transition-colors hover:text-[#1b1b18]"
                      tabIndex={-1}
                      disabled={processing}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {data.password && (
                    <div className="mt-2 space-y-2 animate-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full transition-all duration-700 ease-out ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        {passwordStrength.label && (
                          <span className={`whitespace-nowrap text-xs font-medium ${passwordStrength.textColor}`}>
                            {passwordStrength.label}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {passwordStrength.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-1.5 text-xs">
                            {req.met ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border border-gray-300" />
                            )}
                            <span className={req.met ? 'text-[#1b1b18]' : 'text-[#706f6c]'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {touched.password && errors.password && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label htmlFor="password_confirmation" className="text-sm font-medium text-[#1b1b18]">
                    Confirm password
                  </label>
                  <div
                    className={`relative rounded-lg transition-all duration-200 ${focusedField === 'confirm'
                      ? 'ring-2 ring-orange-500/30 ring-offset-1'
                      : touched.confirm && errors.password_confirmation
                        ? 'ring-2 ring-red-500/40 ring-offset-1'
                        : ''
                      }`}
                  >
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      tabIndex={3}
                      autoComplete="new-password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => handleBlur('confirm')}
                      disabled={processing}
                      placeholder="Re-enter your password"
                      className={`peer w-full rounded-lg border bg-white py-3 pl-10 pr-16 text-sm transition-all duration-200 placeholder:text-[#a09f9c] focus:border-orange-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.password_confirmation && touched.confirm
                          ? 'border-red-500'
                          : 'border-[#19140035]'
                        }`}
                    />
                    <Shield className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706f6c] transition-colors peer-focus:text-orange-600" />

                    {data.password_confirmation &&
                      data.password === data.password_confirmation &&
                      data.password.length > 0 && (
                        <CheckCircle className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                      )}

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#706f6c] transition-colors hover:text-[#1b1b18]"
                      tabIndex={-1}
                      disabled={processing}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {touched.confirm && errors.password_confirmation && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-200">
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.password_confirmation}
                    </p>
                  )}
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Job Seeker Account
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-[#706f6c]">
                  Already have an account?{' '}
                  <Link
                    href={route('login')}
                    className="font-medium text-[#1b1b18] underline-offset-4 transition-colors hover:text-orange-600 hover:underline"
                    tabIndex={5}
                  >
                    Log in
                  </Link>
                </p>
              </form>

              {status && (
                <div className="mt-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50/80 p-3.5 text-sm font-medium text-green-700 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                  {status}
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#a09f9c]">
                <Shield className="h-3 w-3" />
                <span>Your data is encrypted and never shared</span>
              </div>
            </div>

            <div className="relative hidden w-105 shrink-0 overflow-hidden rounded-r-2xl lg:block">
              <div className="absolute inset-0 bg-linear-to-br from-orange-100 via-amber-50 to-orange-50" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.5),transparent_60%)]" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />

              <div className="relative flex h-full flex-col justify-between p-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-2.5 py-1 text-xs font-medium text-[#1b1b18] backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 text-orange-600" />
                    RecruitHub
                  </div>

                  <h3 className="mb-1 text-lg font-bold leading-snug text-[#1b1b18]">
                    Your next opportunity starts here
                  </h3>
                  <p className="mb-5 text-sm text-[#5c5b56]">
                    Connecting talent with meaningful opportunities
                  </p>

                  <div className="mb-5 grid grid-cols-2 gap-2">
                    {stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-white/70 bg-white/70 p-2.5 backdrop-blur-sm"
                      >
                        <div className="mb-0.5 flex items-center gap-1.5">
                          <s.icon className="h-3 w-3 text-orange-600" />
                          <span className="text-[10px] font-medium text-[#706f6c]">{s.label}</span>
                        </div>
                        <p className="text-base font-bold text-[#1b1b18]">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {benefits.map((b) => (
                      <div
                        key={b.title}
                        className="flex items-center gap-3 rounded-lg border border-white/60 bg-white/60 p-2.5 backdrop-blur-sm"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                          <b.icon className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1b1b18]">{b.title}</p>
                          <p className="text-[11px] text-[#706f6c]">{b.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur-md">
                  <div className="mb-2 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs italic leading-relaxed text-[#5c5b56]">
                    "I found my dream role in just two weeks — the job alerts
                    made all the difference."
                  </p>
                  <p className="mt-2 text-[10px] font-medium text-[#706f6c]">
                    — Recent job seeker
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-r-2xl shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.08)]" />
            </div>

            <div className="rounded-b-2xl border border-t-0 border-[#19140015] bg-linear-to-br from-orange-100 via-amber-50 to-orange-50 p-5 lg:hidden">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-600" />
                <p className="text-sm font-semibold text-[#1b1b18]">
                  Why join RecruitHub?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stats.slice(0, 4).map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-white/70 bg-white/70 p-2 backdrop-blur-sm"
                  >
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <s.icon className="h-3 w-3 text-orange-600" />
                      <span className="text-[10px] font-medium text-[#706f6c]">{s.label}</span>
                    </div>
                    <p className="text-sm font-bold text-[#1b1b18]">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>

        <div className="hidden h-14.5 lg:block" />
      </div>
    </>
  );
}
