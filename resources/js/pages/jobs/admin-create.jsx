import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function JobAdminCreate({ categories, locations, jobTypes, experienceLevels, educationRequirements }) {
  const { data, setData, post, processing, errors } = useForm({
    category_id: '',
    title: '',
    slug: '',
    description: '',
    requirements: '',
    job_type: 'full_time',
    experience_level: 'mid',
    education_requirement: '',
    education_details: '',
    salary_min: '',
    salary_max: '',
    is_salary_negotiable: false,
    as_per_companies_policy: false,
    benefits: [],
    skills: [],
    responsibilities: [],
    keywords: [],
    publish_at: '',
    application_deadline: '',
    is_active: true,
    required_facebook_link: false,
    required_linkedin_link: false,
  });

  return (
    <AppLayout breadcrumbs={[{ title: 'Create Job', href: route('jobs.admin.create') }]}>
      <Head title="Create Job Listing" />
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Create Job Listing</h1>
        <form onSubmit={(e) => post(e, { preserveScroll: true })}>
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
              {errors.slug && <span className="text-red-500 text-sm">{errors.slug}</span>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="w-full border rounded px-3 py-2" rows={4}
              />
              {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Requirements</label>
              <textarea
                value={data.requirements}
                onChange={(e) => setData('requirements', e.target.value)}
                className="w-full border rounded px-3 py-2" rows={4}
              />
              {errors.requirements && <span className="text-red-500 text-sm">{errors.requirements}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Salary Min</label>
              <input
                type="number"
                value={data.salary_min}
                onChange={(e) => setData('salary_min', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Salary Max</label>
              <input
                type="number"
                value={data.salary_max}
                onChange={(e) => setData('salary_max', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Keywords (comma separated)</label>
              <input
                type="text"
                value={data.keywords.join(', ')}
                onChange={(e) => setData('keywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                className="w-full border rounded px-3 py-2"
                placeholder="php, laravel, mysql, react"
              />
              {errors.keywords && <span className="text-red-500 text-sm">{errors.keywords}</span>}
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {processing ? 'Creating...' : 'Create Job'}
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
