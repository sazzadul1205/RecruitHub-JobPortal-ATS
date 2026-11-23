import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

const QUICK_LOGIN_USERS = [
    {
        label: 'Admin',
        email: 'admin@example.com',
        password: 'password',
        description: 'Full platform access',
    },
    {
        label: 'Employer',
        email: 'employer@example.com',
        password: 'password',
        description: 'Posts and screens jobs',
    },
    {
        label: 'Applicant',
        email: 'applicant@example.com',
        password: 'password',
        description: 'Job seeker profile',
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

    const quickLogin = (email, password) => {
        setData('email', email);
        setData('password', password);
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" tabIndex={3} />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>

                    <div className="pt-4 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                            Quick Login
                        </p>
                        <div className="grid gap-2">
                            {QUICK_LOGIN_USERS.map((user) => (
                                <Button
                                    key={user.email}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-left gap-2"
                                    onClick={() => quickLogin(user.email, user.password)}
                                    disabled={processing}
                                >
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">{user.label}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </div>
                                    <span className="text-xs">{user.description}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
