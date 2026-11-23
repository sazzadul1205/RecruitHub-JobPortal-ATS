import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function JobAdminEdit({ job, categories, locations, jobTypes, experienceLevels, educationRequirements }) {
  const { data, setData, put, processing, errors } = useForm({
    category_id: job.category_id || '',
    title: job.title,
    slug: job.slug,
    description: job.description,
    requirements: job.requirements,
    job_type: job.job_type,
    experience_level: job.experience_level,
    education_requirement: job.education_requirement || '',
    education_details: job.education_details || '',
    salary_min: job.salary_min || '',
    salary_max: job.salary_max || '',
    is_salary_negotiable: job.is_salary_negotiable,
    as_per_companies_policy: job.as_per_companies_policy,
    benefits: job.benefits || [],
    skills: job.skills || [],
    responsibilities: job.responsibilities || [],
    keywords: job.keywords || [],
    publish_at: job.publish_at || '',
    application_deadline: job.application_deadline || '',
    is_active: job.is_active,
    required_facebook_link: job.required_facebook_link,
    required_linkedin_link: job.required_linkedin_link,
  });

  return (
    <AppLayout breadcrumbs={[{ title: 'Job Listings', href: route('jobs.admin.index') }, { title: 'Edit' }]}>
      <Head title="Edit Job Listing" />
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Job Listing</h1>
        <form onSubmit={(e) => put(e, { preserveScroll: true })}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={data.category_id}
                onChange={(e) => setData('category_id', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <select
                value={data.job_type}
                onChange={(e) => setData('job_type', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {jobTypes.map((jt) => (
                  <option key={jt.value} value={jt.value}>{jt.label()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <select
                value={data.experience_level}
                onChange={(e) => setData('experience_level', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {experienceLevels.map((el) => (
                  <option key={el.value} value={el.value}>{el.label()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={data.slug}
                onChange={(e) => setData('slug', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="w-full border rounded px-3 py-2" rows={4}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Requirements</label>
              <textarea
                value={data.requirements}
                onChange={(e) => setData('requirements', e.target.value)}
                className="w-full border rounded px-3 py-2" rows={4}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {processing ? 'Updating...' : 'Update Job'}
            </button>
            <Link href={route('jobs.admin.index')} className="px-4 py-2 border rounded text-gray-700">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
