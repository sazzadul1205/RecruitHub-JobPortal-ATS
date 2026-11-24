import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Briefcase,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    TrendingUp,
} from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const statCards = {
    admin: [
        { key: 'total_jobs', label: 'Total Jobs', icon: Briefcase, color: 'bg-blue-500' },
        { key: 'active_jobs', label: 'Active Jobs', icon: TrendingUp, color: 'bg-green-500' },
        { key: 'total_applications', label: 'Total Applications', icon: FileText, color: 'bg-purple-500' },
        { key: 'pending_applications', label: 'Pending Review', icon: Clock, color: 'bg-yellow-500' },
    ],
    employer: [
        { key: 'my_jobs', label: 'My Job Postings', icon: Briefcase, color: 'bg-blue-500' },
        { key: 'active_jobs', label: 'Active Jobs', icon: TrendingUp, color: 'bg-green-500' },
        { key: 'total_applications', label: 'Applications Received', icon: FileText, color: 'bg-purple-500' },
        { key: 'pending_applications', label: 'Pending Review', icon: Clock, color: 'bg-yellow-500' },
    ],
    applicant: [
        { key: 'total_applications', label: 'Total Applications', icon: FileText, color: 'bg-blue-500' },
        { key: 'pending_applications', label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
        { key: 'accepted_applications', label: 'Accepted', icon: CheckCircle, color: 'bg-green-500' },
        { key: 'rejected_applications', label: 'Rejected', icon: XCircle, color: 'bg-red-500' },
    ],
};

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    interviewing: 'bg-blue-100 text-blue-800',
    hired: 'bg-purple-100 text-purple-800',
};

export default function Dashboard({ stats, recentApplications, recentJobs, userRole }) {
    const cards = statCards[userRole] || statCards.applicant;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Card key={card.key}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.label}
                                </CardTitle>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats[card.key] ?? 0}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Applications */}
                    {recentApplications && recentApplications.length > 0 && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Recent Applications</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-4 font-medium">Applicant</th>
                                                <th className="text-left p-4 font-medium">Job</th>
                                                <th className="text-left p-4 font-medium">Status</th>
                                                <th className="text-left p-4 font-medium">Applied</th>
                                                <th className="text-right p-4 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentApplications.map((app) => (
                                                <tr key={app.id} className="border-b last:border-0 hover:bg-muted/50">
                                                    <td className="p-4">
                                                        <div className="font-medium">{app.name || app.user?.name}</div>
                                                        <div className="text-sm text-muted-foreground">{app.email || app.user?.email}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        {app.jobListing?.slug ? (
                                                            <Link
                                                                href={userRole === 'employer' 
                                                                    ? route('jobs.admin.show', app.job_listing_id) 
                                                                    : route('jobs.show', app.jobListing.slug)}
                                                                className="font-medium text-primary hover:underline"
                                                            >
                                                                {app.jobListing.title || 'Job removed'}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-muted-foreground">Job removed</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge 
                                                            className={statusColors[app.status] || 'bg-gray-100 text-gray-800'}
                                                            variant="default"
                                                        >
                                                            {app.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {format(new Date(app.created_at), 'MMM d, yyyy')}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <Link
                                                            href={userRole === 'admin' 
                                                                ? route('applications.admin.show', app.id)
                                                                : userRole === 'employer'
                                                                    ? route('jobs.admin.applications', app.job_listing_id)
                                                                    : route('applications.my.show', app.id)}
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Jobs */}
                    {recentJobs && recentJobs.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{userRole === 'admin' ? 'Recent Job Postings' : 'My Recent Jobs'}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-0">
                                {recentJobs.map((job) => (
                                    <Link
                                        key={job.id}
                                        href={userRole === 'admin' 
                                            ? route('jobs.admin.show', job.id) 
                                            : route('jobs.show', job.slug)}
                                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div>
                                            <div className="font-medium">{job.title}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {job.category?.name} • {job.job_type}
                                            </div>
                                        </div>
                                        <Badge 
                                            variant={job.is_active ? 'default' : 'secondary'}
                                            className={job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                        >
                                            {job.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty States */}
                    {(!recentApplications || recentApplications.length === 0) && (
                        <Card className="md:col-span-2">
                            <CardContent className="flex items-center justify-center h-64">
                                <div className="text-center text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">No applications yet</p>
                                    <p className="text-sm">Applications will appear here once received</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {(!recentJobs || recentJobs.length === 0) && userRole !== 'applicant' && (
                        <Card>
                            <CardContent className="flex items-center justify-center h-64">
                                <div className="text-center text-muted-foreground">
                                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">No job postings yet</p>
                                    <Link 
                                        href={userRole === 'admin' ? route('jobs.admin.create') : '#'}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Create your first job
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}