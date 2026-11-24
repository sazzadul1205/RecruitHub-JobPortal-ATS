import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Edit3, Eye, CheckCircle2, XCircle, Plus } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function JobListingsIndex({ jobListings, activeJobs, inactiveJobs, deletedJobs, totalViews, totalJobs, filters, filterOptions }) {
    const [showTrashed, setShowTrashed] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const statusBadge = (isActive) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(jobListings.data.map(j => j.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!confirm('Delete selected listings?')) return;
        setIsDeleting(true);
        try {
            await fetch(route('backend.listing.bulk-delete'), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ ids: selectedIds }),
            });
            window.location.reload();
        } catch (err) {
            alert('Failed to delete listings.');
        } finally {
            setIsDeleting(false);
        }
    };

    const statCards = [
        { title: 'Active Jobs', value: activeJobs, trend: '+12%', trendColor: 'text-green-600' },
        { title: 'Inactive Jobs', value: inactiveJobs, trend: '-3%', trendColor: 'text-red-600' },
        { title: 'Deleted Jobs', value: deletedJobs, trend: '+1', trendColor: 'text-amber-600' },
        { title: 'Total Views', value: totalViews, trend: '+8%', trendColor: 'text-blue-600' },
        { title: 'Total Jobs', value: totalJobs, trend: '+15%', trendColor: 'text-green-600' },
    ];

    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50">
                <Head title="Job Listings" />

                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 mb-6">
                        <span className="text-sm font-medium text-blue-700">{selectedIds.length} selected</span>
                        <button onClick={handleDelete} disabled={isDeleting} className={`rounded-md px-3 py-1.5 text-sm text-white hover:bg-red-700 transition-colors disabled:opacity-50 ${isDeleting ? 'bg-red-400' : 'bg-red-600'}`}>
                            Delete
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
                        <p className="text-gray-600 text-sm">Manage your active and draft job postings</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={route('backend.listing.create')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={16} /> New Listing
                        </Link>
                        <button
                            onClick={() => setShowTrashed(!showTrashed)}
                            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${showTrashed ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'`}
                        >
                            <Trash2 size={16} />
                            <span>{showTrashed ? 'Hide Trashed' : 'View Trashed'}</span>
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
                    {statCards.map((stat) => (
                        <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                <span className={`text-xs font-medium ${stat.trendColor}`}>{stat.trend}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                defaultValue={filters?.search || ''}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <select
                            defaultValue={filters?.category || ''}
                            onChange={(e) => {
                                const url = new URL(window.location);
                                url.searchParams.set('category', e.target.value);
                                window.location.href = url.toString();
                            }}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        >
                            <option value="">All Categories</option>
                            {filterOptions?.categories?.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Filter
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                                    <th className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === jobListings.data.length && jobListings.data.length > 0}
                                            onChange={(e) => toggleSelectAll(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-4">Job Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Employer</th>
                                    <th className="px-6 py-4 text-center">Job Type</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Applications</th>
                                    <th className="px-6 py-4 text-right">Views</th>
                                    <th className="px-6 py-4 text-right">Deadline</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {jobListings.data.map((job) => {
                                    const isSelected = selectedIds.includes(job.id);
                                    return (
                                        <tr key={job.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(job.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={route('backend.listing.show', job.id)}
                                                    className="font-medium text-gray-900 hover:text-blue-600"
                                                >
                                                    {job.title}
                                                </Link>
                                                <br />
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                                    {job.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{job.category?.name || '-'}</td>
                                            <td className="px-6 py-4 text-gray-600">{job.employer?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                                                    {job.job_type?.replace('_', ' ') || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {statusBadge(job.is_active)}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">{job.applications?.length || 0}</td>
                                            <td className="px-6 py-4 text-right text-gray-600">{job.views_count || 0}</td>
                                            <td className="px-6 py-4 text-right text-gray-600">
                                                {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('backend.listing.show', job.id)}
                                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={route('backend.listing.edit', job.id)}
                                                        className="text-gray-600 hover:text-gray-800 text-sm"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (confirm('Delete this listing?')) {
                                                                fetch(route('backend.listing.destroy', job.id), {
                                                                    method: 'DELETE',
                                                                    headers: {
                                                                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                                                                        'Accept': 'application/json',
                                                                    },
                                                                }).then(() => window.location.reload());
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-700 text-sm"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {jobListings.data.length} of {jobListings.total} listings
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: jobListings.last_page }, (_, i) => i + 1).map((page) => (
                                <a
                                    key={page}
                                    href={route('backend.listing', { page }) + (filters?.category ? `?category=${filters.category}` : '')}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                        jobListings.current_page === page
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
