import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, User, Briefcase } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-600 text-white mb-6">
                    <Briefcase className="size-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">RecruitHub</h2>
                <p className="text-gray-600 text-sm text-center mb-8">Create your account</p>

                <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full name
                        </label>
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                className="w-full pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            required
                            autoComplete="new-password"
                            className="w-full pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                        Create account
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{' '}
                        <a href={route('login')} className="font-medium text-blue-600 hover:text-blue-700">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
