import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function JobAdminStatistics({ stats }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Statistics', href: route('jobs.admin.statistics') }]}>
      <Head title="Statistics" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Statistics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
            <p className="text-2xl font-bold">{stats.jobs_by_type?.reduce((sum, item) => sum + parseInt(item.count), 0) || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-2xl font-bold">{stats.applications_by_status?.reduce((sum, item) => sum + parseInt(item.count), 0) || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Top Employers</h3>
            <p className="text-2xl font-bold">{stats.top_employers?.length || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="text-2xl font-bold">{stats.jobs_by_category?.length || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="font-semibold mb-4">Jobs by Type</h3>
            <ul className="space-y-3">
              {stats.jobs_by_type?.map((item) => (
                <li key={item.job_type} className="flex justify-between">
                  <span>{item.job_type}</span>
                  <span className="font-medium">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="font-semibold mb-4">Applications by Status</h3>
            <ul className="space-y-3">
              {stats.applications_by_status?.map((item) => (
                <li key={item.status} className="flex justify-between">
                  <span>{item.status}</span>
                  <span className="font-medium">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
