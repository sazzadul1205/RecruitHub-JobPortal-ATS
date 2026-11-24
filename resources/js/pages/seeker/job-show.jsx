import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Mail, Phone, Link as LinkIcon } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SeekerJobShow({ job, related }) {
    return (
        <AppLayout>
            <Head title={job.title} />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
                                        <p className="text-muted-foreground text-sm">{job.category?.name}</p>
                                    </div>
                                    <Badge variant={job.is_active ? 'default' : 'outline'}>
                                        {job.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div className="mt-4 text-lg text-muted-foreground leading-relaxed">
                                    {job.description}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Requirements</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-sm text-muted-foreground">{job.requirements || 'No specific requirements listed.'}</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Education</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-sm text-muted-foreground">
                                                {job.education_details || job.education_requirement?.replace('_', ' ') || 'Not specified'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Briefcase className="size-4 text-muted-foreground" />
                                        <span className="font-medium">{job.job_type.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="size-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {job.locations?.map((l) => l.name).join(', ') || 'Remote'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="size-4 text-muted-foreground" />
                                        <span className="font-medium">{job.experience_level.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign className="size-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {job.salary_min && job.salary_max
                                                ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`
                                                : 'Negotiable'
                                        }</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="size-4 text-muted-foreground" />
                                        <span className="font-medium text-sm">
                                            {job.required_facebook_link ? 'Facebook link required' : 'Facebook link optional'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="size-4 text-muted-foreground" />
                                        <span className="font-medium text-sm">
                                            {job.required_linkedin_link ? 'LinkedIn link required' : 'LinkedIn link optional'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button className="w-full py-3">
                                    Apply Now <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </CardFooter>
                        </Card>

                        {job.publish_at && (
                            <div className="text-xs text-muted-foreground text-center">
                                Posted {new Date(job.publish_at).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    <div className="lg:w-[340px] flex-shrink-0 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Similar Jobs</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-4">
                                    {related.map((r) => (
                                        <div key={r.id} className="flex gap-3 p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer group">
                                            <div className="flex-shrink-0">
                                                <Briefcase className="size-4 text-muted-foreground group-hover:text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <Link
                                                    href={route('backend.seeker.jobs.show', r.slug)}
                                                    className="text-sm font-medium text-foreground group-hover:text-primary leading-tight"
                                                >
                                                    {r.title}
                                                </Link>
                                                <p className="text-xs text-muted-foreground">{r.category?.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
