import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function JobAdminApplications({ job, applications }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Job Listings', href: route('jobs.admin.index') }, { title: 'Applications' }]}>
      <Head title={`Applications - ${job.title}`} />
      <div className="p-6 max-w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Applications</h1>
          <Link href={route('jobs.admin.show', job.id)} className="text-sm text-blue-600">
            ← Back to job
          </Link>
        </div>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b">Applicant</th>
              <th className="p-3 text-left border-b">Email</th>
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
                <td className="p-3">{app.email}</td>
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

        <div className="mt-4 flex justify-end gap-2">
          {applications.links.map((link) => (
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
