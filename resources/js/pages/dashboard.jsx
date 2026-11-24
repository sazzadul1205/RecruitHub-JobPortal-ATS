import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    Mail,
    MapPin,
    Users,
    Plus,
    LayoutGrid,
} from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const statCards = [
    {
        title: 'Total Jobs',
        value: '24',
        icon: Briefcase,
        description: 'Active job listings',
        trend: '+12%',
        trendColor: 'text-green-600',
    },
    {
        title: 'Total Applications',
        value: '156',
        icon: Users,
        description: 'Job applications received',
        trend: '+8%',
        trendColor: 'text-green-600',
    },
    {
        title: 'Total Categories',
        value: '6',
        icon: LayoutGrid,
        description: 'Job categories',
        trend: '+2',
        trendColor: 'text-blue-600',
    },
    {
        title: 'Total Locations',
        value: '8',
        icon: MapPin,
        description: 'Job locations',
        trend: '+1',
        trendColor: 'text-blue-600',
    },
];

const quickActions = [
    {
        title: 'Post a New Job',
        description: 'Create a new job listing',
        icon: Plus,
        url: '/backend/listing/create',
        color: 'bg-primary text-primary-foreground',
    },
    {
        title: 'View Applications',
        description: 'Review candidate applications',
        icon: Users,
        url: '/backend/applications',
        color: 'bg-secondary text-secondary-foreground',
    },
    {
        title: 'Manage Categories',
        description: 'Organize job categories',
        icon: LayoutGrid,
        url: '/backend/categories',
        color: 'bg-outline border-input',
    },
    {
        title: 'Manage Locations',
        description: 'Add job locations',
        icon: MapPin,
        url: '/backend/locations',
        color: 'bg-outline border-input',
    },
];

const recentJobs = [
    {
        id: 1,
        title: 'Senior PHP Developer',
        company: 'Tech Solutions Inc.',
        category: 'Engineering',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$95,000 - $130,000',
        status: 'Active',
        applications: 24,
        posted: '2 days ago',
    },
    {
        id: 2,
        title: 'Frontend React Engineer',
        company: 'Webify Studio',
        category: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        salary: '$85,000 - $120,000',
        status: 'Active',
        applications: 18,
        posted: '5 days ago',
    },
    {
        id: 3,
        title: 'Product Manager',
        company: 'Growth Labs',
        category: 'Management',
        location: 'San Francisco, CA',
        type: 'Contract',
        salary: '$110,000 - $140,000',
        status: 'Active',
        applications: 32,
        posted: '1 week ago',
    },
    {
        id: 4,
        title: 'UX/UI Designer',
        company: 'Creative Hub',
        category: 'Design',
        location: 'Austin, TX',
        type: 'Part-time',
        salary: '$60,000 - $80,000',
        status: 'Active',
        applications: 41,
        posted: '2 weeks ago',
    },
    {
        id: 5,
        title: 'DevOps Engineer',
        company: 'CloudScale',
        category: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        salary: '$100,000 - $145,000',
        status: 'Active',
        applications: 15,
        posted: '3 days ago',
    },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground text-sm">
                            Welcome back to RecruitHub. Here's what's happening with your jobs.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/backend/listing/create">
                                <Plus className="mr-2 size-4" />
                                Post Job
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <span className={stat.trendColor} className="text-xs font-medium">
                                    {stat.trend} vs last month
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                    <span className="text-muted-foreground text-xs">{stat.description}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-1">
                                    <stat.icon className="size-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs Content */}
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview" className="text-sm font-medium">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="text-sm font-medium">
                            Recent Activity
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                        {/* Quick Actions */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {quickActions.map((action) => (
                                <Card key={action.title} asChild>
                                    <Link href={action.url} className="flex flex-col items-center gap-3 p-6 text-center hover:bg-accent transition-colors">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color}`}>
                                            <action.icon className="size-5" />
                                        </div>
                                        <span className="font-medium">{action.title}</span>
                                        <span className="text-xs text-muted-foreground">{action.description}</span>
                                    </Link>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Jobs */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold">Recent Job Listings</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    Manage your active and draft job postings
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Job Title</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead className="text-center">Type</TableHead>
                                            <TableHead className="text-right">Salary</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-center">Applications</TableHead>
                                            <TableHead className="text-right">Posted</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentJobs.map((job) => (
                                            <TableRow key={job.id} className="hover:bg-accent transition-colors">
                                                <TableCell className="font-medium text-foreground">
                                                    <Link
                                                        href={route('backend.seeker.jobs.show', job.title.toLowerCase().replace(/\s+/g, '-'))}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {job.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{job.company}</TableCell>
                                                <TableCell className="text-center text-sm">
                                                    <Badge variant="outline">{job.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {job.salary}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="default">{job.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-sm text-muted-foreground">
                                                    {job.applications}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {job.posted}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="activity" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold">Application Activity</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    Track application submissions and status changes
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Candidate</TableHead>
                                            <TableHead>Position</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                            <TableHead className="text-right">ATS Score</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            {
                                                name: 'Sarah Johnson',
                                                position: 'Senior PHP Developer',
                                                status: 'Shortlisted',
                                                statusColor: 'text-green-600 bg-green-50',
                                                date: '2026-11-20',
                                                atsScore: '87%',
                                            },
                                            {
                                                name: 'Michael Chen',
                                                position: 'Frontend React Engineer',
                                                status: 'Pending',
                                                statusColor: 'text-blue-600 bg-blue-50',
                                                date: '2026-11-19',
                                                atsScore: '72%',
                                            },
                                            {
                                                name: 'Emily Rodriguez',
                                                position: 'Product Manager',
                                                status: 'Rejected',
                                                statusColor: 'text-red-600 bg-red-50',
                                                date: '2026-11-18',
                                                atsScore: '45%',
                                            },
                                            {
                                                name: 'David Kim',
                                                position: 'DevOps Engineer',
                                                status: 'Hired',
                                                statusColor: 'text-emerald-600 bg-emerald-50',
                                                date: '2026-11-15',
                                                atsScore: '94%',
                                            },
                                        ].map((activity) => (
                                            <TableRow key={activity.name} className="hover:bg-accent transition-colors">
                                                <TableCell className="font-medium text-foreground">
                                                    {activity.name}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {activity.position}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className={activity.statusColor}>
                                                        {activity.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {activity.date}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {activity.atsScore}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
