import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function Dashboard({ user }) {
    const [activeTab, setActiveTab] = useState('overview');

    const statCards = [
        { title: 'Total Jobs', value: '24', trend: '+12%', trendColor: 'text-green-600', description: 'Active job listings' },
        { title: 'Total Applications', value: '156', trend: '+8%', trendColor: 'text-green-600', description: 'Job applications received' },
        { title: 'Total Categories', value: '6', trend: '+2', trendColor: 'text-blue-600', description: 'Job categories' },
        { title: 'Total Locations', value: '8', trend: '+1', trendColor: 'text-blue-600', description: 'Job locations' },
    ];

    const quickActions = [
        { title: 'Post a New Job', description: 'Create a new job listing', url: '/backend/listing/create' },
        { title: 'View Applications', description: 'Review candidate applications', url: '/backend/applications' },
        { title: 'Manage Categories', description: 'Organize job categories', url: '/backend/categories' },
        { title: 'Manage Locations', description: 'Add job locations', url: '/backend/locations' },
    ];

    const recentJobs = [
        { id: 1, title: 'Senior PHP Developer', company: 'Tech Solutions Inc.', category: 'Engineering', location: 'New York, NY', type: 'Full-time', salary: '$95,000 - $130,000', status: 'Active', applications: 24, posted: '2 days ago' },
        { id: 2, title: 'Frontend React Engineer', company: 'Webify Studio', category: 'Engineering', location: 'Remote', type: 'Full-time', salary: '$85,000 - $120,000', status: 'Active', applications: 18, posted: '5 days ago' },
        { id: 3, title: 'Product Manager', company: 'Growth Labs', category: 'Management', location: 'San Francisco, CA', type: 'Contract', salary: '$110,000 - $140,000', status: 'Active', applications: 32, posted: '1 week ago' },
        { id: 4, title: 'UX/UI Designer', company: 'Creative Hub', category: 'Design', location: 'Austin, TX', type: 'Part-time', salary: '$60,000 - $80,000', status: 'Active', applications: 41, posted: '2 weeks ago' },
        { id: 5, title: 'DevOps Engineer', company: 'CloudScale', category: 'Engineering', location: 'Remote', type: 'Full-time', salary: '$100,000 - $145,000', status: 'Active', applications: 15, posted: '3 days ago' },
    ];

    const activityData = [
        { name: 'Sarah Johnson', position: 'Senior PHP Developer', status: 'Shortlisted', statusColor: 'text-green-600 bg-green-50', date: '2026-11-20', atsScore: '87%' },
        { name: 'Michael Chen', position: 'Frontend React Engineer', status: 'Pending', statusColor: 'text-blue-600 bg-blue-50', date: '2026-11-19', atsScore: '72%' },
        { name: 'Emily Rodriguez', position: 'Product Manager', status: 'Rejected', statusColor: 'text-red-600 bg-red-50', date: '2026-11-18', atsScore: '45%' },
        { name: 'David Kim', position: 'DevOps Engineer', status: 'Hired', statusColor: 'text-emerald-600 bg-emerald-50', date: '2026-11-15', atsScore: '94%' },
    ];

    const content = (
        <div className="min-h-screen bg-gray-50">
            <Head title="Dashboard" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 text-sm">Welcome back to RecruitHub.</p>
                </div>
                <div className="flex gap-3">
                    <a href="/backend/listing/create" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <span>+</span> Post Job
                    </a>
                </div>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-between justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                            <span className={`text-xs font-medium ${stat.trendColor}`}>{stat.trend} vs last month</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            <span className="text-gray-400 text-xs">{stat.description}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'overview'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'activity'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Recent Activity
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="grid gap-8 mb-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Recent Job Listings</h3>
                                    <p className="text-gray-500 text-sm">Manage your active and draft job postings</p>
                                </div>
                                <Link href="/backend/listing/create" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View all
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="pb-3 font-medium text-gray-500 uppercase text-xs">Job Title</th>
                                            <th className="pb-3 font-medium text-gray-500 uppercase text-xs">Company</th>
                                            <th className="pb-3 font-medium text-gray-500 uppercase text-xs text-center">Type</th>
                                            <th className="pb-3 font-medium text-gray-500 uppercase text-xs text-right">Salary</th>
                                            <th className="pb-3 font-medium text-gray-500 uppercase text-xs text-center">Status</th>
                                            <th className="pb-3 font-medium text-gray-500 uppercase text-xs text-center">Applications</th>
                                            <th className="pb-3 font-medium text-gray-500 uppercase text-xs text-right">Posted</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentJobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 font-medium text-gray-900">
                                                    <Link
                                                        href={route('backend.seeker.jobs.show', job.title.toLowerCase().replace(/\s+/g, '-'))}
                                                        className="hover:text-blue-600"
                                                    >
                                                        {job.title}
                                                    </Link>
                                                </td>
                                                <td className="py-4 text-gray-600">{job.company}</td>
                                                <td className="py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                                                        {job.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right text-gray-600">{job.salary}</td>
                                                <td className="py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-50 text-green-600 border-green-100">
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-center text-gray-600">{job.applications}</td>
                                                <td className="py-4 text-right text-gray-500">{job.posted}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {quickActions.map((action) => (
                                    <a
                                        key={action.title}
                                        href={action.url}
                                        className="flex flex-col items-center gap-3 p-5 text-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-colors group"
                                    >
                                        <span className="text-2xl group-hover:text-blue-600 transition-colors">{action.title.includes('Post') ? '+' : action.title.includes('View') ? '📋' : action.title.includes('Category') ? '📂' : '📍'}</span>
                                        <span className="font-medium text-gray-900 text-sm">{action.title}</span>
                                        <span className="text-gray-500 text-xs">{action.description}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Job Seeker</h3>
                            <p className="text-gray-600 text-sm mb-4">Find and apply to jobs that match your skills.</p>
                            <a
                                href="/backend/seeker/jobs"
                                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-200 transition-colors"
                            >
                                Browse Jobs <span>→</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'activity' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Application Activity</h3>
                    <p className="text-gray-500 text-sm mb-6">Track application submissions and status changes</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 font-medium text-gray-500 uppercase text-xs">Candidate</th>
                                    <th className="pb-3 font-medium text-gray-500 uppercase text-xs">Position</th>
                                    <th className="pb-3 font-medium text-gray-500 uppercase text-xs text-center">Status</th>
                                    <th className="pb-3 font-medium text-gray-500 uppercase text-xs text-right">Date</th>
                                    <th className="pb-3 font-medium text-gray-500 uppercase text-xs text-right">ATS Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activityData.map((activity) => (
                                    <tr key={activity.name} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-medium text-gray-900">{activity.name}</td>
                                        <td className="py-4 text-gray-600">{activity.position}</td>
                                        <td className="py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${activity.statusColor}`}>
                                                {activity.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right text-gray-600">{activity.date}</td>
                                        <td className="py-4 text-right text-gray-600">{activity.atsScore}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AppSidebarLayout user={user}>
            {content}
        </AppSidebarLayout>
    );
}
