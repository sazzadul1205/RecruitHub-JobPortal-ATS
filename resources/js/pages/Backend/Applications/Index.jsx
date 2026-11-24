import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Mail, Filter, Trash2 } from 'lucide-react';
import { useState } from 'react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function ApplicationsIndex({ applications, jobs, categories, locations, jobTypes, educationLevels, filters, statusCounts, totalApplications, filterOptions }) {
    const [showFilters, setShowFilters] = useState(false);

    const statusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-blue-100 text-blue-700';
            case 'shortlisted': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'hired': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const statCards = [
        { title: 'Total', value: totalApplications },
        { title: 'Pending', value: statusCounts?.pending || 0 },
        { title: 'Shortlisted', value: statusCounts?.shortlisted || 0 },
        { title: 'Rejected', value: statusCounts?.rejected || 0 },
        { title: 'Hired', value: statusCounts?.hired || 0 },
    ];

    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-7xl mx-auto">
                <Head title="All Applications" />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
                        <p className="text-gray-600 text-sm">View and manage all applications across all jobs</p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {showFilters && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    defaultValue={filters?.status || ''}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="hired">Hired</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Job</label>
                                <select
                                    defaultValue={filters?.job_listing_id || ''}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="">All Jobs</option>
                                    {jobs.map((job) => (
                                        <option key={job.id} value={job.id}>{job.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    defaultValue={filters?.category || ''}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Search</label>
                                <input
                                    type="text"
                                    defaultValue={filters?.search || ''}
                                    placeholder="Search applicant..."
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => setShowFilters(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 mb-8 md:grid-cols-5">
                    {statCards.map((stat) => (
                        <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase size={20} /> Application List
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Job</th>
                                    <th className="px-6 py-4 text-center">ATS Score</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Experience</th>
                                    <th className="px-6 py-4 text-right">Salary</th>
                                    <th className="px-6 py-4 text-center">Applied</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.data.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{app.name}</div>
                                            <div className="text-xs text-gray-500">{app.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{app.jobListing?.title}</div>
                                            <div className="text-xs text-gray-500">{app.jobListing?.category?.name || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-medium ${app.ats_percentage >= 80 ? 'text-green-600' : app.ats_percentage >= 60 ? 'text-blue-600' : app.ats_percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {app.ats_percentage || 'N/A'}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(app.status)}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">{app.years_of_experience || '-'}</td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {app.expected_salary ? `$${Number(app.expected_salary).toLocaleString()}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={route('applications.show', app.id)}
                                                className="text-blue-600 hover:text-blue-700 text-sm"
                                                title="View"
                                            >
                                                <Mail size={16} />
                                            </Link>
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
                                    href={route('applications.index', { page })}
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
