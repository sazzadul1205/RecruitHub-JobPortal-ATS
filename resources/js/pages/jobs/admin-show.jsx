import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function JobAdminShow({ job }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Job Listings', href: route('jobs.admin.index') }, { title: job.title }]}>
      <Head title={job.title} />
      <div className="p-6 max-w-4xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <Link href={route('jobs.admin.edit', job.id)} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{job.description}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Requirements</h3>
              <p className="text-gray-700">{job.requirements}</p>
            </div>
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            {job.skills && job.skills.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span key={s} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Job Details</h3>
              <p className="text-blue-700 mt-1">
                <strong>Category:</strong> {job.category?.name || '-'}<br />
                <strong>Type:</strong> {job.job_type}<br />
                <strong>Experience:</strong> {job.experience_level}<br />
                <strong>Salary:</strong> {job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : 'Negotiable'}<br />
                <strong>Status:</strong> {job.is_active ? 'Active' : 'Inactive'}<br />
                <strong>Views:</strong> {job.views_count}<br />
                <strong>Applications:</strong> {job.applications?.length || 0}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Applications</h3>
              {job.applications && job.applications.length > 0 ? (
                <ul className="space-y-3">
                  {job.applications.map((app) => (
                    <li key={app.id} className="border-b pb-2">
                      <Link href={route('applications.admin.show', app.id)} className="font-medium">{app.name}</Link>
                      <span className="text-sm text-gray-500 ml-2">({app.status})</span>
                      {app.ats_percentage && <span className="text-sm ml-2">ATS: {app.ats_percentage}%</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No applications yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
