import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Mail, Phone, Trash2, Edit3 } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function JobListingsShow({ jobListing, applicationStats, averageAtsScore, recentApplications, totalViews }) {
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
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-6xl mx-auto">
                <Head title={jobListing.title} />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">{jobListing.title}</h1>
                        <p className="text-gray-600 text-sm">Job listing details and applications</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('backend.listing.edit', jobListing.id)}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Edit3 size={16} /> Edit
                        </Link>
                        <Link
                            href={route('backend.listing.applications', jobListing.id)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            View Applications
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 mb-8 md:grid-cols-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{totalViews}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Total Views</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{recentApplications.length}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{applicationStats?.pending || 0}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{averageAtsScore}%</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Avg. ATS Score</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase size={20} /> Job Details
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{jobListing.description}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Requirements</h3>
                                <p className="text-gray-600 leading-relaxed">{jobListing.requirements || 'No specific requirements listed.'}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Job Type</h3>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                                    {jobListing.job_type?.replace('_', ' ') || '-'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Experience Level</h3>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                                    {jobListing.experience_level?.replace('_', ' ') || '-'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Education</h3>
                                <span className="text-sm text-gray-600">
                                    {jobListing.education_details || jobListing.education_requirement?.replace('_', ' ') || 'Not specified'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Locations</h3>
                                <div className="space-y-1">
                                    {(jobListing.locations || []).map((loc) => (
                                        <span key={loc.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                                            <MapPin size={12} /> {loc.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Salary Range</h3>
                                <p className="text-gray-600">
                                    {jobListing.salary_min && jobListing.salary_max
                                        ? `$${Number(jobListing.salary_min).toLocaleString()} - $${Number(jobListing.salary_max).toLocaleString()}`
                                        : 'Negotiable'
                                    }
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Status</h3>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${jobListing.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                    {jobListing.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="lg:col-span-2">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Benefits</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(jobListing.benefits || []).map((benefit, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border-blue-100 border">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(jobListing.skills || []).map((skill, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border-blue-100 border">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Mail size={20} /> Recent Applications
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">ATS Score</th>
                                    <th className="px-6 py-4 text-center">Applied</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{app.name}</div>
                                            <div className="text-xs text-gray-500">{app.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(app.status)}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-medium ${app.ats_percentage >= 80 ? 'text-green-600' : app.ats_percentage >= 60 ? 'text-blue-600' : app.ats_percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {app.ats_percentage || 'N/A'}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={route('applications.show', app.id)}
                                                className="text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
