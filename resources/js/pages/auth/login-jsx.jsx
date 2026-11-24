import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Briefcase, User, ShieldCheck } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

const QUICK_LOGINS = [
    {
        label: 'Job Seeker Demo',
        email: 'jobseeker@example.com',
        roleIcon: User,
        roleSlug: 'job_seeker',
    },
    {
        label: 'Employer Demo',
        email: 'employer@example.com',
        roleIcon: Briefcase,
        roleSlug: 'employer',
    },
    {
        label: 'Admin Demo',
        email: 'admin@example.com',
        roleIcon: ShieldCheck,
        roleSlug: 'admin',
    },
];

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

    const useQuickLogin = (email) => {
        setData('email', email);
        setData('password', 'password');
    };

    return (
        <AuthLayout title="Log in to your account" description="Welcome back to RecruitHub. Sign in to continue.">
            <Head title="Log in" />

            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-6">
                    <Briefcase className="size-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">RecruitHub</h2>
                <p className="text-muted-foreground text-sm mb-8 text-center">
                    Sign in to your account
                </p>

                {status && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700 w-full">
                        {status}
                    </div>
                )}

                <form className="flex flex-col gap-4 w-full" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                className="pl-10"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="text-sm">
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="pl-10"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" name="remember" />
                        <Label htmlFor="remember" className="text-sm text-muted-foreground">
                            Remember me
                        </Label>
                    </div>

                    <Button type="submit" className="mt-2 w-full py-3" disabled={processing}>
                        {processing ? (
                            <>
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t w-full">
                    <p className="text-muted-foreground text-sm text-center mb-4">
                        Or sign in with a demo account:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {QUICK_LOGINS.map((demo) => {
                            const Icon = demo.roleIcon;
                            return (
                                <button
                                    key={demo.roleSlug}
                                    type="button"
                                    onClick={() => useQuickLogin(demo.email)}
                                    className="flex flex-col items-center gap-2 rounded-lg border border-input bg-background px-2 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                                >
                                    <Icon className="size-4" />
                                    <span className="font-medium text-xs leading-tight text-foreground">{demo.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t text-center w-full">
                    <p className="text-muted-foreground text-sm">
                        Don't have an account?{' '}
                        <TextLink href={route('register')} className="font-medium">
                            Create an account
                        </TextLink>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
