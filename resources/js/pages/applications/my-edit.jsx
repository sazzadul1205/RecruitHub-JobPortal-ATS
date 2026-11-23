import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ApplicationsMyEdit({ application, job, cvs }) {
  const { data, setData, put, processing, errors } = useForm({
    cv_id: application.resume_path ? '' : '',
    name: application.name,
    email: application.email,
    phone: application.phone,
    education_level: application.education_level || '',
    years_of_experience: application.years_of_experience || 0,
    expected_salary: application.expected_salary || '',
    facebook_link: application.facebook_link || '',
    linkedin_link: application.linkedin_link || '',
  });

  return (
    <AppLayout breadcrumbs={[{ title: 'My Applications', href: route('applications.my') }, { title: 'Edit' }]}>
      <Head title="Edit Application" />
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Application</h1>
        <form onSubmit={(e) => put(e, { preserveScroll: true })}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select CV</label>
              <select
                value={data.cv_id}
                onChange={(e) => setData('cv_id', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Keep current CV</option>
                {cvs?.map((cv) => (
                  <option key={cv.id} value={cv.id}>{cv.original_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Salary</label>
              <input
                type="number"
                value={data.expected_salary}
                onChange={(e) => setData('expected_salary', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <input
                type="url"
                value={data.linkedin_link}
                onChange={(e) => setData('linkedin_link', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {processing ? 'Updating...' : 'Update Application'}
            </button>
            <Link href={route('applications.my')} className="px-4 py-2 border rounded text-gray-700">Cancel</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
