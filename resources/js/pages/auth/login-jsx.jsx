import { Head, useForm, router } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Briefcase, User, Building2, ShieldCheck } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-600 text-white mb-6">
                    <Briefcase className="size-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">RecruitHub</h2>
                <p className="text-gray-600 text-sm text-center mb-8">Sign in to your account</p>

                {status && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                        {status}
                    </div>
                )}

                <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            {canResetPassword && (
                                <a href={route('password.request')} className="text-sm text-blue-600 hover:text-blue-700 mt-1 block">
                                    Forgot password?
                                </a>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="w-full pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label htmlFor="remember" className="text-sm text-gray-600">
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                        Sign in
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-gray-600 text-sm">
                        Don't have an account?{' '}
                        <a href={route('register')} className="font-medium text-blue-600 hover:text-blue-700">
                            Create an account
                        </a>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xs font-semibold uppercase text-gray-400 mb-4 text-center">
                        Quick Login
                    </h3>
                    <div className="grid gap-2">
                        <button
                            onClick={() => {
                                setData('email', 'jobseeker@example.com');
                                setData('password', 'password');
                                post(route('login'), {
                                    onFinish: () => reset('password'),
                                });
                            }}
                            className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            <User className="size-4" />
                            <span>Job Seeker</span>
                            <span className="ml-auto text-xs text-gray-400">jobseeker@example.com</span>
                        </button>
                        <button
                            onClick={() => {
                                setData('email', 'employer@example.com');
                                setData('password', 'password');
                                post(route('login'), {
                                    onFinish: () => reset('password'),
                                });
                            }}
                            className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            <Building2 className="size-4" />
                            <span>Employer</span>
                            <span className="ml-auto text-xs text-gray-400">employer@example.com</span>
                        </button>
                        <button
                            onClick={() => {
                                setData('email', 'admin@example.com');
                                setData('password', 'password');
                                post(route('login'), {
                                    onFinish: () => reset('password'),
                                });
                            }}
                            className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            <ShieldCheck className="size-4" />
                            <span>Admin</span>
                            <span className="ml-auto text-xs text-gray-400">admin@example.com</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">
                        All accounts use password: password
                    </p>
                </div>
            </div>
        </div>
    );
}
