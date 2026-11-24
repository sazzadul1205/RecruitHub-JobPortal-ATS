import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, Clock, DollarSign, Trash2, Edit3 } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function ApplyEdit({ application, jobListing, cvs, currentCvId }) {
    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-5xl mx-auto">
                <Head title={`Edit Application - ${application.name}`} />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Application</h1>
                        <p className="text-gray-600 text-sm">Update your application details</p>
                    </div>
                    <Link
                        href={route('apply.index')}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Applications
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            fetch(route('apply.update', application.id), {
                                method: 'PUT',
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
                                .catch(() => alert('Failed to update application.'));
                        }}
                        className="space-y-6"
                    >
                        <input type="hidden" name="_method" value="PUT" />

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={application.name}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={application.email}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    name="phone"
                                    type="text"
                                    defaultValue={application.phone || ''}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
                                <input
                                    name="expected_salary"
                                    type="number"
                                    defaultValue={application.expected_salary || ''}
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
                                    defaultValue={application.linkedin_link || ''}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                                <input
                                    name="facebook_link"
                                    type="url"
                                    defaultValue={application.facebook_link || ''}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Selected CV</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {cvs.map((cv) => (
                                    <div
                                        key={cv.id}
                                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                            cv.id === currentCvId
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="applicant_cv_id"
                                            value={cv.id}
                                            defaultChecked={cv.id === currentCvId}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 truncate">{cv.original_name || cv.file_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full"
                            >
                                            <Edit3 size={16} /> Update Application
                                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
