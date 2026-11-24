import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Mail, TrendingUp, TrendingDown, PieChart, BarChart, LineChart } from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

const statCard = ({ title, value, trend, trendColor, description }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="text-gray-400 text-xs">{description}</p>
            </div>
            <div className={`text-xs font-medium ${trendColor}`}>
                {trend} vs last period
            </div>
        </div>
        <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
    </div>
);

export default function StatisticsIndex({ summary, trends, jobsByType, jobsByExperience, jobsByCategory, jobsByLocation, monthlyJobs, applicationsByStatus, monthlyApplications, applicationsByJob, atsScoreByJobType, topEmployers, topEmployersByApplications, dateRange, filters }) {
    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-7xl mx-auto">
                <Head title="Statistics" />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
                        <p className="text-gray-600 text-sm">Analytics and insights for your job portal</p>
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm">
                            <option value="all_time">All Time</option>
                            <option value="today">Today</option>
                            <option value="this_week">This Week</option>
                            <option value="this_month">This Month</option>
                            <option value="last_month">Last Month</option>
                            <option value="custom">Custom</option>
                        </select>
                        <Link
                            href={route('backend.listing.index')}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to Listings
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 mb-8 md:grid-cols-3 lg:grid-cols-6">
                    {[
                        { title: 'Total Jobs', value: summary.total_jobs, trend: trends.jobs_growth, trendColor: 'text-green-600', description: 'Active job listings' },
                        { title: 'Active Jobs', value: summary.active_jobs, trend: '+5%', trendColor: 'text-green-600', description: 'Currently published' },
                        { title: 'Total Applications', value: summary.total_applications, trend: trends.applications_growth, trendColor: 'text-green-600', description: 'Job applications received' },
                        { title: 'Pending', value: summary.pending_applications, trend: '+2%', trendColor: 'text-blue-600', description: 'Awaiting review' },
                        { title: 'Shortlisted', value: summary.shortlisted_applications, trend: '+3%', trendColor: 'text-blue-600', description: 'Moving forward' },
                        { title: 'Hired', value: summary.hired_applications, trend: '+1%', trendColor: 'text-green-600', description: 'Successfully hired' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                    <p className="text-gray-400 text-xs">{stat.description}</p>
                                </div>
                                <div className={`text-xs font-medium ${stat.trendColor}`}>{stat.trend}</div>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Jobs by Type</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {jobsByType.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{item.job_type?.replace('_', ' ') || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">{item.count} jobs</p>
                                        </div>
                                        <span className="text-sm font-bold text-blue-600">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Jobs by Experience</h2>
                            <div className="space-y-3">
                                {jobsByExperience.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700">{item.experience_level?.replace('_', ' ') || 'N/A'}</p>
                                        <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Conversion Rate</h2>
                            <div className="flex items-center justify-center h-32">
                                <span className="text-3xl font-bold text-blue-600">
                                    {summary.total_applications > 0 ? ((summary.hired_applications / summary.total_applications) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-3">Hired / Total Applications</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 mt-8 lg:grid-cols-2">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Applications by Status</h2>
                        <div className="space-y-3">
                            {[
                                { label: 'Pending', value: applicationsByStatus.find((a) => a.status === 'pending')?.count || 0, color: 'text-blue-600' },
                                { label: 'Shortlisted', value: applicationsByStatus.find((a) => a.status === 'shortlisted')?.count || 0, color: 'text-blue-600' },
                                { label: 'Rejected', value: applicationsByStatus.find((a) => a.status === 'rejected')?.count || 0, color: 'text-red-600' },
                                { label: 'Hired', value: applicationsByStatus.find((a) => a.status === 'hired')?.count || 0, color: 'text-green-600' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                        <p className="text-xs text-gray-500">{item.value} applications</p>
                                    </div>
                                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Employers</h2>
                        <div className="space-y-3">
                            {topEmployers.map((employer, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{employer.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{employer.job_listings_count || 0} jobs</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{employer.job_listings_count || 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Applications</h2>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        Chart data loading...
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
