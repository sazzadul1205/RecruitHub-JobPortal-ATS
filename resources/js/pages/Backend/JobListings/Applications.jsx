import { Head, Link, router } from '@inertiajs/react';

import { ArrowLeft, Briefcase, Mail } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function JobListingsApplications({ jobListing, applications, stats }) {
    const statusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-blue-100 text-blue-700';
            case 'shortlisted': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'hired': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 sm:p-8 max-w-7xl mx-auto">
                <Head title={`Applications - ${jobListing.title}`} />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                        <p className="text-gray-600 text-sm">{jobListing.title}</p>
                    </div>
                    <Link
                        href={route('backend.listing.show', jobListing.id)}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Job
                    </Link>
                </div>

                <div className="grid gap-6 mb-8 md:grid-cols-5">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Total</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{stats.shortlisted}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{stats.rejected}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Rejected</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{stats.hired}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Hired</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase size={20} /> All Applications
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4 text-center">ATS Score</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Applied</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.data.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{app.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{app.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-medium ${app.ats_percentage >= 80 ? 'text-green-600' : app.ats_percentage >= 60 ? 'text-blue-600' : app.ats_percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {app.ats_percentage || 'N/A'}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(app.status)}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('applications.show', app.id)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                                    title="View"
                                                >
                                                    <Mail size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {applications.data.length} of {applications.total} applications
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: applications.last_page }, (_, i) => i + 1).map((page) => (
                                <a
                                    key={page}
                                    href={route('backend.listing.applications', { jobListing: jobListing.id, page })}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                        applications.current_page === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                                    }`}
                                >
                                    {page}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
