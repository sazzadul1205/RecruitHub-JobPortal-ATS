import { useState } from 'react';

import { Head, Link, router } from '@inertiajs/react';

import { useAuth } from '@/hooks/useAuth';
import { Can } from '@/components/Auth/Can';

import {
  ArrowLeft,
  Plus,
  Shield,
  Briefcase,
  Loader2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function JobListingsCreate({ categories, locations }) {
    const {
        user: currentUser,
        hasAnyPermission,
        hasRole,
    } = useAuth();

    const canViewJobs = hasAnyPermission(['jobs.view', 'jobs.manage']);
    const isEmployer = hasRole('employer') || hasRole('employer-admin');
    const canCreateJobs = hasAnyPermission(['jobs.create', 'jobs.manage']);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category_id: '',
        description: '',
        job_type: 'full_time',
        experience_level: 'mid_level',
        education_requirement: 'bachelors',
        location_ids: [],
        salary_min: '',
        salary_max: '',
        application_deadline: '',
        is_active: true,
        is_salary_negotiable: false,
        as_per_companies_policy: false,
        required_facebook_link: false,
        required_linkedin_link: false,
    });

    if (!canCreateJobs && !isEmployer) {
        return (
            <AppSidebarLayout>
                <Head title="Access Denied" />
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Access Denied</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">You don't have permission to create job listings.</p>
                        {canViewJobs && (
                            <Link
                                href={route('backend.listing.index')}
                                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Back to Job Listings
                            </Link>
                        )}
                    </div>
                </div>
            </AppSidebarLayout>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleArrayChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!canCreateJobs && !isEmployer) {
            alert('You do not have permission to post jobs.');
            return;
        }

        if (!confirm('Are you sure you want to post this job?')) return;

        const submitData = {
            ...formData,
            salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
            salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        };

        setIsSubmitting(true);

        router.post(route('backend.listing.store'), submitData, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Job posted successfully!');
                router.visit(route('backend.listing.index'));
            },
            onError: (error) => {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                    alert('Please check the form for errors.');
                } else if (error.response?.data?.message) {
                    alert(error.response.data.message);
                } else {
                    alert('Failed to post job listing. Please try again.');
                }
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const locationSelection = new Set(formData.location_ids);

    const toggleLocation = (locationId) => {
        const newSelection = new Set(locationSelection);
        if (newSelection.has(locationId)) {
            newSelection.delete(locationId);
        } else {
            newSelection.add(locationId);
        }
        handleArrayChange('location_ids', Array.from(newSelection));
    };

    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 sm:p-8 max-w-4xl mx-auto">
                <Head title="Create Job Listing" />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Create Job Listing</h1>
                                <p className="text-gray-600 text-sm">Post a new job opening</p>
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('backend.listing.index')}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Listings
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    defaultValue={formData.title}
                                    required
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Slug</label>
                                <input
                                    name="slug"
                                    type="text"
                                    defaultValue={formData.slug}
                                    required
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug[0]}</p>}
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category_id"
                                    defaultValue={formData.category_id}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-xs text-red-600 mt-1">{errors.category_id[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={6}
                                defaultValue={formData.description}
                                required
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            ></textarea>
                            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description[0]}</p>}
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                                <select
                                    name="job_type"
                                    defaultValue={formData.job_type}
                                    onChange={handleChange}
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
                                    defaultValue={formData.experience_level}
                                    onChange={handleChange}
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
                                    defaultValue={formData.education_requirement}
                                    onChange={handleChange}
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
                                    defaultValue={formData.salary_min}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Salary Max</label>
                                <input
                                    name="salary_max"
                                    type="number"
                                    defaultValue={formData.salary_max}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                                <input
                                    name="application_deadline"
                                    type="date"
                                    defaultValue={formData.application_deadline}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3 items-end">
                            <div className="flex items-center gap-2">
                                <input
                                    name="is_active"
                                    type="checkbox"
                                    defaultChecked={formData.is_active}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">Is Active</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    name="is_salary_negotiable"
                                    type="checkbox"
                                    defaultChecked={formData.is_salary_negotiable}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">Salary Negotiable</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    name="as_per_companies_policy"
                                    type="checkbox"
                                    defaultChecked={formData.as_per_companies_policy}
                                    onChange={handleChange}
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
                                    defaultChecked={formData.required_facebook_link}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">Require Facebook Link</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    name="required_linkedin_link"
                                    type="checkbox"
                                    defaultChecked={formData.required_linkedin_link}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">Require LinkedIn Link</label>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Locations</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {locations.map((loc) => (
                                    <div
                                        key={loc.id}
                                        onClick={() => toggleLocation(loc.id)}
                                        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                                            locationSelection.has(loc.id)
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            name="location_ids"
                                            type="checkbox"
                                            value={loc.id}
                                            checked={locationSelection.has(loc.id)}
                                            onChange={(e) => toggleLocation(loc.id)}
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
                                disabled={isSubmitting}
                                className="flex items-center gap-2 w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    <Plus size={16} />
                                )}
                                {isSubmitting ? 'Posting...' : 'Create Job Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
