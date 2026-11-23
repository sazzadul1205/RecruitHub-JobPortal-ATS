import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function LocationsIndex({ locations }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Locations', href: route('locations.index') }]}>
      <Head title="Job Locations" />
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Job Locations</h1>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b">Name</th>
              <th className="p-3 text-left border-b">Address</th>
              <th className="p-3 text-left border-b">Jobs</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.data?.map((loc) => (
              <tr key={loc.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{loc.name}</td>
                <td className="p-3">{loc.address || '-'}</td>
                <td className="p-3">{loc.listings_count || 0}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${loc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {loc.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3">
                  <Link href="#" className="text-xs text-blue-600">Edit</Link>
                </td>
              </tr>
            ))}
            {locations.data?.length === 0 && (
              <tr><td colSpan="5" className="p-3 text-center text-gray-500">No locations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
