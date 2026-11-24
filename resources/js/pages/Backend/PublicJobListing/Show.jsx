import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Mail, Phone } from 'lucide-react';

export default function PublicJobListingShow({ jobListing, userData, hasApplied, existingApplication, relatedJobs, applicationStats, averageAtsScore }) {
    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-5xl mx-auto">
            <Head title={jobListing.title} />

            <div className="space-y-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{jobListing.title}</h2>
                            <p className="text-gray-500 text-sm">{jobListing.category?.name}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border bg-blue-50 text-blue-600 border-blue-100">
                            {jobListing.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-6">{jobListing.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="border rounded-lg p-4">
                            <h4 className="text-xs font-semibold uppercase text-gray-400 mb-3">Requirements</h4>
                            <p className="text-gray-600 text-sm">{jobListing.requirements || 'No specific requirements listed.'}</p>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h4 className="text-xs font-semibold uppercase text-gray-400 mb-3">Education</h4>
                            <p className="text-gray-600 text-sm">{jobListing.education_details || jobListing.education_requirement?.replace('_', ' ') || 'Not specified'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="size-4" />
                            <span className="font-medium">{jobListing.job_type?.replace('_', ' ') || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="size-4" />
                            <span className="font-medium">{jobListing.locations?.map((l) => l.name).join(', ') || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="size-4" />
                            <span className="font-medium">{jobListing.experience_level?.replace('_', ' ') || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="size-4" />
                            <span className="font-medium">
                                {jobListing.salary_min && jobListing.salary_max
                                    ? `$${Number(jobListing.salary_min).toLocaleString()} - $${Number(jobListing.salary_max).toLocaleString()}`
                                    : 'Negotiable'
                                }
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="size-4" />
                            <span className="font-medium text-xs">{jobListing.required_facebook_link ? 'Facebook link required' : 'Facebook link optional'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="size-4" />
                            <span className="font-medium text-xs">{jobListing.required_linkedin_link ? 'LinkedIn link required' : 'LinkedIn link optional'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                    {hasApplied ? (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                            <span className="text-green-700 text-sm font-medium">Applied</span>
                            {existingApplication && (
                                <Link
                                    href={route('apply.show', existingApplication.id)}
                                    className="text-blue-600 text-sm hover:text-blue-700"
                                >
                                    View your application
                                </Link>
                            )}
                        </div>
                    ) : (
                        <a
                            href={route('apply.create', { slug: jobListing.slug })}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
                        >
                            Apply Now <ArrowRight className="ml-2 size-4" />
                        </a>
                    )}
                    {jobListing.publish_at && (
                        <p className="mt-4 text-xs text-gray-400 text-center">
                            Posted {new Date(jobListing.publish_at).toLocaleDateString()}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Similar Jobs</h3>
                    <div className="space-y-4">
                        {relatedJobs.map((r) => (
                            <div key={r.id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                                <div className="flex-shrink-0">
                                    <Briefcase className="size-4 text-gray-400 group-hover:text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <Link
                                        href={route('backend.seeker.jobs.show', r.slug)}
                                        className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-tight"
                                    >
                                        {r.title}
                                    </Link>
                                    <p className="text-xs text-gray-500">{r.category?.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
