import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, User, Briefcase } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

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
        <AuthLayout>
            <Head title="Register" />

            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-6">
                    <Briefcase className="size-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">RecruitHub</h2>
                <p className="text-muted-foreground text-sm mb-8 text-center">
                    Create your account
                </p>

                <form className="flex flex-col gap-4 w-full" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                className="pl-10"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                required
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
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                className="pl-10"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full py-3" disabled={processing}>
                        {processing ? (
                            <>
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Create account'
                        )}
                    </Button>
                </form>

                <div className="mt-6 pt-4 border-t text-center w-full">
                    <p className="text-muted-foreground text-sm">
                        Already have an account?{' '}
                        <TextLink href={route('login')} className="font-medium">
                            Sign in
                        </TextLink>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
