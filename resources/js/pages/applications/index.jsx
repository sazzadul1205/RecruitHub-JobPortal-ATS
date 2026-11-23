import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ApplicationsIndex({ applications, statuses, jobs, filters }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'All Applications', href: route('applications.admin.index') }]}>
      <Head title="All Applications" />
      <div className="p-6 max-w-full">
        <h1 className="text-2xl font-bold mb-6">All Applications</h1>

        <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" defaultValue={filters.status || ''} className="w-full border rounded px-3 py-2">
              <option value="">All</option>
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>{s.value}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job</label>
            <select name="job_id" defaultValue={filters.job_id || ''} className="w-full border rounded px-3 py-2">
              <option value="">All</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min ATS Score</label>
            <input type="number" name="min_ats_score" defaultValue={filters.min_ats_score || ''} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="px-4 py-2 bg-gray-700 text-white rounded">Filter</button>
          </div>
        </form>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b">Applicant</th>
              <th className="p-3 text-left border-b">Job</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">ATS Score</th>
              <th className="p-3 text-left border-b">Applied</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.data.map((app) => (
              <tr key={app.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Link href={route('applications.admin.show', app.id)} className="font-medium">{app.name}</Link>
                </td>
                <td className="p-3">{app.jobListing?.title || '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-3">{app.ats_percentage ? app.ats_percentage + '%' : 'Pending'}</td>
                <td className="p-3">{app.created_at}</td>
                <td className="p-3">
                  <Link href={route('applications.admin.show', app.id)} className="text-sm text-blue-600">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
