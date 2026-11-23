import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ApplicationsJobIndex({ job, applications }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Jobs', href: route('jobs.admin.index') }, { title: job.title, href: route('jobs.admin.show', job.id) }, { title: 'Applications' }]}>
      <Head title={`Applications - ${job.title}`} />
      <div className="p-6 max-w-full">
        <h1 className="text-2xl font-bold mb-6">Applications for {job.title}</h1>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b">Applicant</th>
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
                <td className="p-3">{app.status}</td>
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
