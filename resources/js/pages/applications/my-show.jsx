import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ApplicationsMyShow({ application }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'My Applications', href: route('applications.my') }, { title: 'View' }]}>
      <Head title="Application Details" />
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Application Details</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">{application.jobListing?.title || 'Job'}</h2>
            <p className="text-gray-600">{application.jobListing?.employer?.name || 'Employer'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Status</h3>
              <p className="text-lg">{application.status}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">ATS Score</h3>
              <p className="text-lg">{application.ats_percentage ? application.ats_percentage + '%' : 'Not calculated'}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Application Details</h3>
            <p><strong>Name:</strong> {application.name}</p>
            <p><strong>Email:</strong> {application.email}</p>
            <p><strong>Phone:</strong> {application.phone}</p>
            <p><strong>Experience:</strong> {application.years_of_experience} years</p>
            <p><strong>Expected Salary:</strong> {application.expected_salary ? '$' + application.expected_salary : 'Not specified'}</p>
          </div>

          {application.statusTimelines && application.statusTimelines.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Status History</h3>
              <ul className="space-y-2">
                {application.statusTimelines.map((tl, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{tl.status}</span>
                    <span className="text-sm text-gray-500">{tl.created_at}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Link href={route('applications.my')} className="px-4 py-2 border rounded text-gray-700">Back</Link>
        </div>
      </div>
    </AppLayout>
  );
}
