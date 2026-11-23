import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function PublicJobIndex({ jobs, categories, locations, filters }) {
  return (
    <AppLayout>
      <Head title="Job Portal" />
      <div className="p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Job Portal</h1>
          <Link href={route('jobs.admin.index')} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Admin Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={route('jobs.index', { ...filters, category: cat.id })}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Locations</h3>
              <ul className="space-y-2">
                {locations.map((loc) => (
                  <li key={loc.id}>
                    <Link
                      href={route('jobs.index', { ...filters, location: loc.id })}
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      {loc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="md:col-span-3 space-y-4">
            <form method="GET" className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg">
              <input
                type="text"
                name="keyword"
                placeholder="Search jobs..."
                defaultValue={filters.keyword || ''}
                className="flex-1 border rounded px-3 py-2"
              />
              <select
                name="category"
                defaultValue={filters.category || ''}
                className="border rounded px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                name="location"
                defaultValue={filters.location || ''}
                className="border rounded px-3 py-2"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Search
              </button>
            </form>

            <div className="space-y-4">
              {jobs.data.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        href={route('jobs.show', job.slug)}
                        className="text-xl font-bold text-gray-900 hover:text-blue-600"
                      >
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <span>{job.category?.name || 'Uncategorized'}</span>
                        <span>·</span>
                        <span>{job.job_type}</span>
                        <span>·</span>
                        <span>{job.experience_level}</span>
                      </div>
                    </div>
                    {job.salary_min && job.salary_max && (
                      <span className="font-semibold text-blue-600">
                        ${job.salary_min} - ${job.salary_max}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-2">{job.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                    <span>{job.locations?.map((l) => l.name).join(', ') || 'Remote'}</span>
                    <span>{job.views_count} views</span>
                  </div>
                </div>
              ))}

              <div className="mt-4">
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
