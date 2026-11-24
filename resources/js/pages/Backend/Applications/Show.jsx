import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Mail, Phone, MapPin, Clock, Download, Trash2, Edit3, RefreshCw } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function ApplicationsShow({ application, atsAnalysis }) {
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
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-6xl mx-auto">
                <Head title={`Application - ${application.name}`} />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">Application Detail</h1>
                        <p className="text-gray-600 text-sm">{application.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('applications.index')}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to Applications
                        </Link>
                        <Link
                            href={route('backend.listing.applications', application.jobListing.id)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            View All for Job
                        </Link>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Applicant Info</h2>
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
                                    <MapPin size={16} className="text-gray-400" />
                                    <span className="text-gray-600">{application.applicantProfile?.location || 'N/A'}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <a
                                        href={`/storage/${application.resume_path}`}
                                        className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700"
                                    >
                                        <Download size={16} /> Download Resume
                                    </a>
                                </div>
                                <div className="pt-3">
                                    <span className="text-xs font-medium text-gray-500">Expected Salary</span>
                                    <p className="text-gray-600">
                                        {application.expected_salary ? `$${Number(application.expected_salary).toLocaleString()}` : 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Professional Info</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Experience</span>
                                    <span className="text-sm text-gray-600">{application.years_of_experience || 'N/A'} years</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Education Level</span>
                                    <span className="text-sm text-gray-600">{application.education_level || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Social Links</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <a
                                        href={application.facebook_link || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
                                    >
                                        <span className="text-gray-400">f</span> Facebook
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={application.linkedin_link || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
                                    >
                                        <span className="text-gray-400">in</span> LinkedIn
                                    </a>
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
                                            stroke={atsScoreColor(atsAnalysis?.score || 0)}
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={2 * Math.PI * 40}
                                            strokeDashoffset={2 * Math.PI * 40 * (1 - (atsAnalysis?.score || 0) / 100)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-900">
                                        {atsAnalysis?.score || 0}%
                                    </span>
                                </div>
                                <div>
                                    <span className={`text-xs font-medium ${atsScoreColor(atsAnalysis?.score || 0)}`}>
                                        {atsAnalysis?.score >= 80 ? 'Excellent' : atsAnalysis?.score >= 60 ? 'Good' : atsAnalysis?.score >= 40 ? 'Fair' : 'Needs Improvement'}
                                    </span>
                                    <p className="text-gray-600 text-sm mt-1">ATS calculation completed</p>
                                    {atsAnalysis?.calculated_at && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Calculated: {new Date(atsAnalysis.calculated_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Matched Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(atsAnalysis?.matched_keywords || []).map((kw, i) => (
                                            <span key={i} className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700">{kw}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Missing Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(atsAnalysis?.missing_keywords || []).map((kw, i) => (
                                            <span key={i} className="rounded-md bg-red-100 px-2 py-1 text-xs text-red-700">{kw}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Suggestions</h3>
                                <ul className="space-y-2">
                                    {(atsAnalysis?.suggestions || []).map((s, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-600">
                                            <span className="text-blue-500">•</span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Work History</h2>
                            <div className="space-y-4">
                                {(application.applicantProfile?.jobHistories || []).map((job, i) => (
                                    <div key={i} className="border-l-2 border-blue-200 pl-4 py-2">
                                        <div className="font-medium text-gray-900">{job.position}</div>
                                        <div className="text-sm text-gray-500">{job.company}</div>
                                        <div className="text-xs text-gray-400">{job.duration || 'N/A'}</div>
                                    </div>
                                ))}
                                {(application.applicantProfile?.jobHistories?.length || 0) === 0 && (
                                    <p className="text-gray-500 text-sm italic">No work history available.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Education History</h2>
                            <div className="space-y-4">
                                {(application.applicantProfile?.educationHistories || []).map((edu, i) => (
                                    <div key={i} className="border-l-2 border-blue-200 pl-4 py-2">
                                        <div className="font-medium text-gray-900">{edu.degree}</div>
                                        <div className="text-sm text-gray-500">{edu.institution}</div>
                                        <div className="text-xs text-gray-400">{edu.passing_year || 'N/A'}</div>
                                    </div>
                                ))}
                                {(application.applicantProfile?.educationHistories?.length || 0) === 0 && (
                                    <p className="text-gray-500 text-sm italic">No education history available.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Achievements</h2>
                            <div className="space-y-4">
                                {(application.applicantProfile?.achievements || []).map((ach, i) => (
                                    <div key={i} className="border-l-2 border-blue-200 pl-4 py-2">
                                        <div className="font-medium text-gray-900">{ach.name}</div>
                                        <div className="text-sm text-gray-500">{ach.details || ''}</div>
                                    </div>
                                ))}
                                {(application.applicantProfile?.achievements?.length || 0) === 0 && (
                                    <p className="text-gray-500 text-sm italic">No achievements available.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Status Timeline</h2>
                            <div className="space-y-4">
                                {(application.statusTimelines || []).map((timeline, i) => (
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
                                {(application.statusTimelines?.length || 0) === 0 && (
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
