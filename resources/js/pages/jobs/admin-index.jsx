import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function JobAdminIndex({ jobs, categories, locations, employers, jobTypes, experienceLevels, filters }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Job Listings', href: route('jobs.admin.index') }]}>
      <Head title="Job Listings" />
      <div className="p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Job Listings</h1>
          <Link
            href={route('jobs.admin.create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Job
          </Link>
        </div>

        <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input type="text" name="search" defaultValue={filters.search || ''} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" defaultValue={filters.category || ''} className="w-full border rounded px-3 py-2">
              <option value="">All</option>
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <select name="job_type" defaultValue={filters.job_type || ''} className="w-full border rounded px-3 py-2">
              <option value="">All</option>
              {jobTypes.map((jt) => (<option key={jt.value} value={jt.value}>{jt.label()}</option>))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="px-4 py-2 bg-gray-700 text-white rounded">Filter</button>
          </div>
        </form>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b">Title</th>
              <th className="p-3 text-left border-b">Category</th>
              <th className="p-3 text-left border-b">Type</th>
              <th className="p-3 text-left border-b">Experience</th>
              <th className="p-3 text-left border-b">Salary</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Employer</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.data.map((job) => (
              <tr key={job.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Link href={route('jobs.admin.show', job.id)} className="font-medium">{job.title}</Link>
                </td>
                <td className="p-3">{job.category?.name || '-'}</td>
                <td className="p-3">{job.job_type}</td>
                <td className="p-3">{job.experience_level}</td>
                <td className="p-3">{job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : 'Negotiable'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${job.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3">{job.employer?.name || '-'}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={route('jobs.admin.edit', job.id)} className="text-xs text-blue-600">Edit</Link>
                    <button onClick={() => window.location.href = route('jobs.admin.toggle-active', { jobListing: job.id })} className="text-xs text-red-600">
                      {job.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end gap-2">
          {jobs.links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className={`px-3 py-1 rounded ${
                link.active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
