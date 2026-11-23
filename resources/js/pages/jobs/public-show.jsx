import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function PublicJobShow({ job, related_jobs }) {
  return (
    <AppLayout>
      <Head title={job.title} />
      <div className="p-6">
        <Link href={route('jobs.index')} className="text-sm text-blue-600 mb-4 inline-block">
          ← Back to jobs
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{job.category?.name || 'Uncategorized'}</span>
              <span>·</span>
              <span>{job.job_type}</span>
              <span>·</span>
              <span>{job.experience_level}</span>
            </div>
          </div>

          {job.salary_min || job.salary_max && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Salary</h3>
              <p className="text-blue-700">
                {job.salary_min ? `$${job.salary_min}` : 'Negotiable'} -{' '}
                {job.salary_max ? `$${job.salary_max}` : 'Negotiable'}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <div className="text-gray-700">{job.description}</div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">Requirements</h2>
              <div className="text-gray-700">{job.requirements}</div>
            </section>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-2">Responsibilities</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.skills && job.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {job.keywords && job.keywords.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-2">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {job.keywords.map((kw) => (
                    <span key={kw} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Employer</h3>
            <p>{job.employer?.name || 'Confidential'}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Related Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related_jobs.map((related) => (
                <div key={related.id} className="border rounded p-3">
                  <Link href={route('jobs.show', related.slug)} className="font-medium">
                    {related.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
