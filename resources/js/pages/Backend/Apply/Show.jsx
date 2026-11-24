import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Mail, Phone, Clock, DollarSign, Download, RefreshCw } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function ApplyShow({ application, jobListing, applicantProfile, statusTimeline, atsDetails, atsStatus, isDeleted }) {
    const statusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-blue-100 text-blue-700';
            case 'shortlisted': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'hired': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const atsScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 stroke-green-500';
        if (score >= 60) return 'text-blue-600 stroke-blue-500';
        if (score >= 40) return 'text-yellow-600 stroke-yellow-500';
        return 'text-red-600 stroke-red-500';
    };

    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-5xl mx-auto">
                <Head title={`Application - ${application.name}`} />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">Application Detail</h1>
                        <p className="text-gray-600 text-sm">{application.name}</p>
                    </div>
                    <Link
                        href={route('apply.index')}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Applications
                    </Link>
                </div>

                {isDeleted && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <p className="text-amber-700 text-sm">This application has been withdrawn.</p>
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Application Info</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                        {application.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{application.name}</div>
                                        <div className="text-sm text-gray-500">{application.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-gray-600">{application.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(application.status)}`}>
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <span className="text-gray-600">
                                        {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <span className="text-xs font-medium text-gray-500">Expected Salary</span>
                                    <p className="text-gray-600">
                                        {application.expected_salary ? `$${Number(application.expected_salary).toLocaleString()}` : 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Resume</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Download size={16} className="text-gray-400" />
                                    <span className="text-gray-600 text-sm truncate">{application.resume_path?.split('/').pop() || 'Resume.pdf'}</span>
                                </div>
                                <a
                                    href={`/storage/${application.resume_path}`}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Download Resume
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Job Info</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Job Title</span>
                                    <span className="text-sm text-gray-600 font-medium">{jobListing?.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Category</span>
                                    <span className="text-sm text-gray-600">{jobListing?.category?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Job Type</span>
                                    <span className="text-sm text-gray-600">{jobListing?.job_type?.replace('_', ' ') || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">ATS Score</h2>
                                    <p className="text-gray-500 text-sm">Applicant Tracking System analysis</p>
                                </div>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <RefreshCw size={16} className="mr-2" />
                                    Recalculate ATS
                                </button>
                            </div>

                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative h-24 w-24">
                                    <svg className="w-full h-full -rotate-90 transform">
                                        <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke={atsScoreColor(atsDetails?.score || 0)}
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={2 * Math.PI * 40}
                                            strokeDashoffset={2 * Math.PI * 40 * (1 - (atsDetails?.score || 0) / 100)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900">
                                        {atsDetails?.score || 0}%
                                    </span>
                                </div>
                                <div>
                                    <span className={`text-xs font-medium ${atsScoreColor(atsDetails?.score || 0)}`}>
                                        {atsDetails?.score >= 80 ? 'Excellent' : atsDetails?.score >= 60 ? 'Good' : atsDetails?.score >= 40 ? 'Fair' : 'Needs Improvement'}
                                    </span>
                                    <p className="text-gray-600 text-sm mt-1">Status: {atsStatus || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Matched Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(atsDetails?.matched_keywords || []).map((kw, i) => (
                                            <span key={i} className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700">{kw}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Missing Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(atsDetails?.missing_keywords || []).map((kw, i) => (
                                            <span key={i} className="rounded-md bg-red-100 px-2 py-1 text-xs text-red-700">{kw}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Suggestions</h3>
                                <ul className="space-y-2">
                                    {(atsDetails?.suggestions || []).map((s, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-600">
                                            <span className="text-blue-500">•</span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Status Timeline</h2>
                            <div className="space-y-4">
                                {(statusTimeline || []).map((timeline, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">
                                                {timeline.status.charAt(0).toUpperCase() + timeline.status.slice(1)}
                                            </div>
                                            {timeline.notes && (
                                                <div className="text-sm text-gray-500">{timeline.notes}</div>
                                            )}
                                            <div className="text-xs text-gray-400 mt-1">
                                                {timeline.created_at ? new Date(timeline.created_at).toLocaleDateString() : '-'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(statusTimeline?.length || 0) === 0 && (
                                    <p className="text-gray-500 text-sm italic">No status history available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
