import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function JobListingsCreate({ categories, locations }) {
    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-4xl mx-auto">
                <Head title="Create Job Listing" />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">Create Job Listing</h1>
                        <p className="text-gray-600 text-sm">Post a new job opening</p>
                    </div>
                    <Link
                        href={route('backend.listing.index')}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Listings
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            fetch(route('backend.listing.store'), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                    'Accept': 'application/json',
                                },
                                body: JSON.stringify({
                                    ...data,
                                    is_active: data.is_active === 'on',
                                    required_facebook_link: data.required_facebook_link === 'on',
                                    required_linkedin_link: data.required_linkedin_link === 'on',
                                    is_salary_negotiable: data.is_salary_negotiable === 'on',
                                    as_per_companies_policy: data.as_per_companies_policy === 'on',
                                }),
                            })
                                .then((res) => res.json())
                                .then(() => {
                                    window.location.href = route('backend.listing.index');
                                })
                                .catch(() => alert('Failed to create listing.'));
                        }}
                        className="space-y-6"
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Slug</label>
                                <input
                                    name="slug"
                                    type="text"
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category_id"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={6}
                                required
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            ></textarea>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                                <select
                                    name="job_type"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="full_time">Full-time</option>
                                    <option value="part_time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                                <select
                                    name="experience_level"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="entry_level">Entry Level</option>
                                    <option value="mid_level">Mid Level</option>
                                    <option value="senior_level">Senior Level</option>
                                    <option value="lead">Lead</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Education Requirement</label>
                                <select
                                    name="education_requirement"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="high_school">High School</option>
                                    <option value="bachelors">Bachelor's Degree</option>
                                    <option value="masters">Master's Degree</option>
                                    <option value="phd">PhD</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Salary Min</label>
                                <input
                                    name="salary_min"
                                    type="number"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Salary Max</label>
                                <input
                                    name="salary_max"
                                    type="number"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                                <input
                                    name="application_deadline"
                                    type="date"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3 items-end">
                            <div className="flex items-center gap-2">
                                <input
                                    name="is_active"
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">Is Active</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    name="is_salary_negotiable"
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">Salary Negotiable</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    name="as_per_companies_policy"
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">As Per Company Policy</label>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3 items-end">
                            <div className="flex items-center gap-2">
                                <input
                                    name="required_facebook_link"
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">Require Facebook Link</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    name="required_linkedin_link"
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">Require LinkedIn Link</label>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Locations</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {locations.map((loc) => (
                                    <div key={loc.id} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            name="location_ids"
                                            type="checkbox"
                                            value={loc.id}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{loc.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={16} /> Create Job Listing
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
