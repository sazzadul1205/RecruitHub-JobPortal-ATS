import { Head, Link } from '@inertiajs/react';
import { Search, ArrowRight, Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function SeekerJobs({ jobs, categories, locations, filters }) {
    const [search, setSearch] = useState(filters?.keyword || '');

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <Head title="Browse Jobs" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">Find Your Next Job</h2>
                    <p className="text-gray-600 text-sm">Browse opportunities from top employers hiring now</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                            id="search"
                            type="text"
                            placeholder="Search jobs by title or keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <a
                        href="#"
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Search <ArrowRight className="size-4" />
                    </a>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.data.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-blue-200 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                <p className="text-gray-500 text-sm mt-1">{job.category?.name}</p>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                                {job.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{job.description}</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Briefcase className="size-4" />
                                <span>{job.job_type.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="size-4" />
                                <span>{job.locations?.map((l) => l.name).join(', ') || 'Remote'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="size-4" />
                                <span>{job.experience_level.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <DollarSign className="size-4" />
                                <span>
                                    {job.salary_min && job.salary_max
                                        ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`
                                        : 'Negotiable'
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <Link
                                href={route('backend.seeker.jobs.show', job.slug)}
                                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View details <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {jobs.data.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-sm">No jobs found matching your criteria.</p>
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                    {Array.from({ length: jobs.last_page }, (_, i) => i + 1).map((page) => (
                        <a
                            key={page}
                            href={route('backend.seeker.jobs', { page }) + (filters?.keyword ? `?keyword=${filters.keyword}` : '')}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                jobs.current_page === page
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
    );
}
