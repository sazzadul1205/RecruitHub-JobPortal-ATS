import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Search, Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SeekerJobs({ jobs, categories, locations, filters }) {
    const [search, setSearch] = useState(filters?.keyword || '');

    return (
        <AppLayout>
            <Head title="Browse Jobs" />

            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Find Your Next Job</CardTitle>
                            <CardDescription>
                                Browse opportunities from top employers hiring now
                            </CardDescription>
                        </CardHeader>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                id="search"
                                type="text"
                                placeholder="Search jobs by title or keyword..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button className="w-full lg:w-auto">
                            Search <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.data.map((job) => (
                        <Card key={job.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardHeader className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                                        <p className="text-xs text-muted-foreground mt-1">{job.category?.name}</p>
                                    </div>
                                    <Badge variant={job.is_active ? 'default' : 'outline'}>
                                        {job.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Briefcase className="size-4 text-muted-foreground" />
                                        <span>{job.job_type.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="size-4 text-muted-foreground" />
                                        <span>{job.locations?.map((l) => l.name).join(', ') || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="size-4 text-muted-foreground" />
                                        <span>{job.experience_level.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign className="size-4 text-muted-foreground" />
                                        <span>
                                            {job.salary_min && job.salary_max ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}` : 'Negotiable'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-5 border-t">
                                <Link
                                    href={route('backend.seeker.jobs.show', job.slug)}
                                    className="w-full flex items-center justify-between"
                                >
                                    <span className="text-sm font-medium text-primary">View details</span>
                                    <ArrowRight className="size-4" />
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {jobs.data.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
