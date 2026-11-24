import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Mail, Phone, Clock, DollarSign, Download } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function ApplyCreate({ job, cvs, profile, hasSoftDeleted }) {
    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-5xl mx-auto">
                <Head title={`Apply - ${job.title}`} />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">Apply for Job</h1>
                        <p className="text-gray-600 text-sm">{job.title}</p>
                    </div>
                    <Link
                        href={route('backend.seeker.jobs.show', job.slug)}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Job
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                                    <p className="text-gray-600 text-sm">{job.category?.name || 'Uncategorized'}</p>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={14} />
                                    <span>{job.user?.name || 'Unknown Employer'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                    </span>
                                    <span>{job.locations?.map((l) => l.name).join(', ') || 'Remote'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                                        {job.job_type?.replace('_', ' ') || '-'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span>$${job.salary_min?.toLocaleString() || 'N/A'} - $${job.salary_max?.toLocaleString() || 'Negotiable'}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <span className="text-xs font-medium text-gray-500">Application Deadline</span>
                                    <p className="text-gray-600">
                                        {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'No deadline'}
                                    </p>
                                </div>
                                {(job.required_facebook_link || job.required_linkedin_link) && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <span className="text-xs font-medium text-amber-700">Required Social Links</span>
                                        <ul className="mt-1 space-y-1 text-sm text-gray-600">
                                            {job.required_facebook_link && <li key="fb">Facebook link required</li>}
                                            {job.required_linkedin_link && <li key="li">LinkedIn link required</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const data = Object.fromEntries(formData.entries());
                                    fetch(route('apply.store', job.slug), {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                            'Accept': 'application/json',
                                        },
                                        body: JSON.stringify(data),
                                    })
                                        .then((res) => res.json())
                                        .then(() => {
                                            window.location.href = route('apply.index');
                                        })
                                        .catch(() => alert('Failed to submit application.'));
                                }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Select CV</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {cvs.map((cv) => (
                                            <div
                                                key={cv.id}
                                                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                                    cv.id === profile?.primary_cv_id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="applicant_cv_id"
                                                    value={cv.id}
                                                    defaultChecked={cv.id === profile?.primary_cv_id}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 truncate">{cv.original_name || cv.file_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            defaultValue={profile?.name || ''}
                                            required
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            defaultValue={profile?.email || ''}
                                            required
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            name="phone"
                                            type="text"
                                            defaultValue={profile?.phone || ''}
                                            required
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
                                        <input
                                            name="expected_salary"
                                            type="number"
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                                        <input
                                            name="linkedin_link"
                                            type="url"
                                            placeholder="https://linkedin.com/in/..."
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                        {job.required_linkedin_link && (
                                            <p className="text-xs text-red-600 mt-1">LinkedIn link is required for this job.</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                                        <input
                                            name="facebook_link"
                                            type="url"
                                            placeholder="https://facebook.com/..."
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                        {job.required_facebook_link && (
                                            <p className="text-xs text-red-600 mt-1">Facebook link is required for this job.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full"
                                    >
                                        <Download size={16} /> Submit Application
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
