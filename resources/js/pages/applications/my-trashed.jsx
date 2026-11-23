import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ApplicationsMyTrashed({ applications }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Trashed Applications', href: route('applications.trashed') }]}>
      <Head title="Trashed Applications" />
      <div className="p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Trashed Applications</h1>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b">Job</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Deleted</th>
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
                <td className="p-3">{app.status}</td>
                <td className="p-3">{app.deleted_at}</td>
                <td className="p-3">
                  <button onClick={() => window.location.href = route('applications.my.restore', app.id)} className="text-sm text-green-600">Restore</button>
                  <button onClick={() => window.location.href = route('applications.my.force-delete', app.id)} className="text-sm text-red-600 ml-2">Delete Forever</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
