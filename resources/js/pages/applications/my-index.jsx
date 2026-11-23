import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ApplicationsMyIndex({ applications }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'My Applications', href: route('applications.my') }]}>
      <Head title="My Applications" />
      <div className="p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
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
                  <Link href={route('jobs.show', app.jobListing?.slug)} className="font-medium">
                    {app.jobListing?.title || 'Unknown'}
                  </Link>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-3">{app.ats_percentage ? app.ats_percentage + '%' : 'Pending'}</td>
                <td className="p-3">{app.created_at}</td>
                <td className="p-3">
                  <Link href={route('applications.my.show', app.id)} className="text-sm text-blue-600">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.data.length === 0 && (
          <div className="mt-8 text-center text-gray-500">
            <p>No applications found.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
