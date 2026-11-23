import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ApplyCreate({ job, cvs, profile, already_applied }) {
  if (already_applied) {
    return (
      <AppLayout>
        <Head title="Already Applied" />
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">You have already applied to this job</h1>
          <p className="text-gray-600 mt-2">You can only apply once per job.</p>
          <Link href={route('applications.my')} className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
            View My Applications
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { data, setData, post, processing, errors } = useForm({
    cv_id: '',
    name: profile?.first_name ? `${profile.first_name} ${profile.last_name}` : '',
    email: '',
    phone: profile?.phone || '',
    education_level: '',
    years_of_experience: profile?.experience_years || 0,
    expected_salary: '',
    facebook_link: '',
    linkedin_link: '',
  });

  return (
    <AppLayout breadcrumbs={[{ title: 'Jobs', href: route('jobs.index') }, { title: 'Apply' }]}>
      <Head title={`Apply - ${job.title}`} />
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Apply for {job.title}</h1>
        <form onSubmit={(e) => post(e, { preserveScroll: true })}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select CV</label>
              <select
                value={data.cv_id}
                onChange={(e) => setData('cv_id', e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select a CV</option>
                {cvs?.map((cv) => (
                  <option key={cv.id} value={cv.id}>{cv.original_name}</option>
                ))}
              </select>
              {errors.cv_id && <span className="text-red-500 text-sm">{errors.cv_id}</span>}
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
            {job.required_linkedin_link && (
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn (required)</label>
                <input
                  type="url"
                  value={data.linkedin_link}
                  onChange={(e) => setData('linkedin_link', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.linkedin_link && <span className="text-red-500 text-sm">{errors.linkedin_link}</span>}
              </div>
            )}
            {job.required_facebook_link && (
              <div>
                <label className="block text-sm font-medium mb-1">Facebook (required)</label>
                <input
                  type="url"
                  value={data.facebook_link}
                  onChange={(e) => setData('facebook_link', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.facebook_link && <span className="text-red-500 text-sm">{errors.facebook_link}</span>}
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {processing ? 'Applying...' : 'Submit Application'}
            </button>
            <Link href={route('jobs.show', job.slug)} className="px-4 py-2 border rounded text-gray-700">Back to Job</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
