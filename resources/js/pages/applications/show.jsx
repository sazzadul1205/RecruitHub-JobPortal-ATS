import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function ApplicationsShow({ application, statuses }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'All Applications', href: route('applications.admin.index') }, { title: 'View' }]}>
      <Head title="Application Details" />
      <div className="p-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Application Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-bold">{application.jobListing?.title || 'Job'}</h2>
              <p className="text-gray-600">{application.name}</p>
              <p className="text-sm text-gray-500">{application.email} · {application.phone}</p>
            </div>

            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Application Details</h3>
              <p><strong>Experience:</strong> {application.years_of_experience} years</p>
              <p><strong>Expected Salary:</strong> {application.expected_salary ? '$' + application.expected_salary : 'Not specified'}</p>
              <p><strong>LinkedIn:</strong> {application.linkedin_link || 'Not provided'}</p>
              <p><strong>Facebook:</strong> {application.facebook_link || 'Not provided'}</p>
            </div>

            {application.ats_score && (
              <div className="p-4 bg-white border rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">ATS Score</h3>
                <div className="text-2xl font-bold mb-2">{application.ats_percentage}%</div>
                <p className="text-sm text-gray-600">{application.ats_score.analysis?.message || ''}</p>
                {application.ats_score.matched_keywords && application.ats_score.matched_keywords.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sm mb-1">Matched Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.ats_score.matched_keywords.map((kw) => (
                        <span key={kw} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
                {application.ats_score.missing_keywords && application.ats_score.missing_keywords.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sm mb-1">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.ats_score.missing_keywords.map((kw) => (
                        <span key={kw} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Update Status</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                fetch(route('applications.admin.status.update', { id: application.id }), {
                  method: 'POST',
                  headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content, 'X-Requested-With': 'XMLHttpRequest' },
                  body: formData,
                }).then(() => window.location.reload());
              }}>
                <select name="status" className="w-full border rounded px-3 py-2 mb-3">
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label()}</option>
                  ))}
                </select>
                <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded">Update</button>
              </form>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Download Resume</h3>
              <button onClick={() => window.location.href = route('applications.admin.download-resume', { id: application.id })} className="w-full px-4 py-2 bg-gray-700 text-white rounded">
                Download Resume
              </button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Employer Notes</h3>
              <textarea className="w-full border rounded px-3 py-2" defaultValue={application.employer_notes || ''} rows={3} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
