# Job Portal & Applicant Tracking System (ATS) — Technical Specification

Version 1.0 (draft) · Last updated 22 November 2026 · Status: pre-development

## 1. Overview

A standalone Laravel application that combines a public job portal with an integrated applicant tracking system (ATS). Employers publish jobs. Applicants build a profile and apply with a PDF, DOCX or DOC resume. The system reads each resume, matches it against the job's keywords and stores an ATS score that employers use to screen, rank and manage applications.

**In scope**

- Job listing management, with categories and locations
- Public job search with view tracking
- Applicant profiles, with up to three CVs per applicant
- Applications with automatic resume parsing and keyword scoring
- Employer-side screening: filters, status workflow, email, resume download and export
- Role-based access control (RBAC), rate limiting and audit logging

**Not covered by this specification:** AI or semantic matching, OCR for scanned resumes, interview scheduling and public company profile pages. These can be added later.

**Target stack:** PHP 8.2+, Laravel, Inertia.js with React, Tailwind CSS v4, and a database with JSON column support (MySQL 8+ recommended).

Section 12 lists problems found in the original specification and the changes recommended before development starts.

## 2. Roles

| Role | Who | Main capabilities |
| --- | --- | --- |
| Admin | Platform administrator | Everything: all jobs, applications, categories, locations, statistics, permissions |
| Employer | Posts jobs and screens applicants | Manage own job listings; review, update, email, download and export applications for those listings |
| Applicant | Job seeker | Manage own profile and CVs, search jobs, apply, track, edit and withdraw own applications |

The original specification defines permissions but not roles, so this table is a proposed default. The key rule: an Employer may act only on their own listings and the applications to them, and an Applicant may act only on their own records. Enforce this with policies, not only with permission checks.

## 3. Functional Requirements

### 3.1 Job listing management (Admin and Employer)

- **CRUD:** create, read, update, soft delete, restore and force delete
- **Bulk actions:** activate, deactivate and delete multiple listings
- **Status management:** toggle active or inactive manually; statuses also update automatically from `publish_at` and `application_deadline`
- **Filtering:** status, category, job type, experience level, location, employer, dates, salary range, application count, published or expired
- **Statistics dashboard:** jobs by type, experience level, category, location and month; applications by status; ATS scores by job type; top employers
- **Rate limiting:** per-action limits, for example create 10/hour, update 10/hour and delete 5/hour

### 3.2 Public job portal (Job seekers)

- **Search and filter:** keyword, category, location, job type, experience level and salary range
- **Sorting:** latest, oldest, deadline (soonest or latest), salary (high or low), popular and most applied
- **Job details:** description, requirements, benefits, skills, responsibilities and employer info
- **Related jobs:** three suggestions from the same category
- **View tracking:** one view counted per unique IP per job
- **Popular and trending endpoints:** cached; popular is ranked by views, trending by applications

### 3.3 Applications: applicant side

- **Apply:** choose one of your CVs and complete the form; LinkedIn and Facebook links are required only when the job requires them
- **My applications:** list with status, ATS score and pagination
- **Edit:** allowed only while the status is `pending`
- **Withdraw, restore and permanent delete:** withdrawing is a soft delete; permanent deletion also removes the resume file
- **ATS recalculation:** manual trigger, rate limited
- **ATS status:** an AJAX polling endpoint so the UI updates when scoring finishes

### 3.4 Applications: employer and admin side

- **Lists:** a global list with comprehensive filters, and a per-job list
- **Status updates:** single and bulk, `pending` → `shortlisted`, `rejected` or `hired`
- **Email:** single and bulk, with the job as context in the message
- **Resume download:** single, or bulk as one merged PDF (Ghostscript, pdftk or FPDI) with a ZIP fallback
- **Export:** CSV or Excel, for one application or many
- **ATS recalculation:** per application, with logging

### 3.5 Applicant profile

- **Completion rule:** `first_name`, `last_name` and `phone` are required
- **CVs:** upload (max 3), reorder, set primary and delete
- **Work history, education history and achievements:** add, edit and delete (max 3 entries each)
- **Profile photo:** upload and display

## 4. ATS Specification

The ATS logic lives in `ATSService.php`.

### 4.1 Pipeline

1. The applicant submits an application. It is created with `ats_calculation_status = pending`.
2. The resume text is extracted.
3. The job's keywords are loaded.
4. Each keyword is matched against the resume text.
5. The score and analysis are calculated and saved to `applications.ats_score`, and the status becomes `completed` or `failed`.

### 4.2 Resume text extraction

| Format | Primary method | Fallback |
| --- | --- | --- |
| PDF | Smalot PdfParser | `pdftotext` |
| DOCX | ZipArchive, then XML parsing | None |
| DOC | `antiword` | Raw text extraction |

### 4.3 Keywords

Source: `job_listings.keywords`, a JSON array with a maximum of 100 entries, normalised to lowercase.

### 4.4 Matching rules

- Matching is case-insensitive.
- **Multi-word keywords:** exact phrase match with `strpos`.
- **Single-word keywords:** regex with word boundaries, `/\bkeyword\b/u`.

### 4.5 Scoring

`percentage = (matched_count / total_keywords) × 100`

| Level | Score |
| --- | --- |
| Excellent | 80% and above |
| Good | 60% to below 80% |
| Fair | 40% to below 60% |
| Needs improvement | Below 40% |

### 4.6 Analysis output

- **Matched and missing keywords:** the top 10 of each
- **Suggestions:** highlight the missing keywords; add a skills section

### 4.7 Stored structure (`applications.ats_score`)

```json
{
  "percentage": 75.5,
  "matched_keywords": ["php", "laravel", "mysql"],
  "missing_keywords": ["aws", "docker"],
  "matched_count": 3,
  "total_keywords": 4,
  "extracted_skills": [],
  "extracted_experience_years": 0,
  "extracted_education": "Not specified",
  "analysis": {
    "level": "Good",
    "message": "Your resume matches many key requirements...",
    "color": "blue",
    "matched_count": 3,
    "missing_count": 1,
    "top_matched": ["php", "laravel", "mysql"],
    "top_missing": ["aws"],
    "suggestions": ["Highlight these keywords: aws", "Consider adding skills section"]
  },
  "calculated_at": "2026-11-22 10:30:00"
}
```

The three `extracted_*` fields are placeholders in the original example (empty, 0 and "Not specified"). Implement them or remove them (see section 12).

### 4.8 Calculation status flow

`pending` → `processing` → `completed` or `failed`

- Calculation runs automatically when an application is submitted.
- A user or employer can trigger recalculation from the UI.
- An application stuck in `pending` or `processing` for more than 30 minutes is detected and flagged.
- `ats_attempt_count` tracks retries, and `ats_last_attempted_at` records the last attempt.

## 5. Data Model

### 5.1 Conventions

- Every table has `id`, `created_at` and `updated_at`.
- Soft deletes (`deleted_at`) apply to the core tables, and at minimum to `job_listings`, `job_categories`, `locations` and `applications`, because each has restore routes.
- JSON columns: `benefits`, `skills`, `responsibilities` and `keywords` on `job_listings`; `social_links` on `applicant_profiles`; `ats_score`, `matched_keywords` and `missing_keywords` on `applications`.
- Index every foreign key, status field and date field.
- Unique constraint: `applications (job_listing_id, user_id)`, so an applicant applies once per job (see section 12).
- Each profile may have at most 3 rows each in `applicant_cvs`, `job_histories`, `education_histories` and `achievements`. Enforce this in validation.

### 5.2 Core job portal tables (4)

**`job_listings`**: job postings

| Group | Columns |
| --- | --- |
| Content | `title`, `slug`, `description`, `requirements` |
| Classification | `job_type`, `category_id`, `experience_level`, `education_requirement`, `education_details` |
| Salary | `salary_min`, `salary_max`, `is_salary_negotiable`, `as_per_companies_policy` |
| Structured lists (JSON) | `benefits`, `skills`, `responsibilities`, `keywords` |
| Publishing | `application_deadline`, `publish_at`, `is_active`, `views_count` |
| Ownership | `user_id` (the employer) |
| Application requirements | `required_facebook_link`, `required_linkedin_link` |

| Table | Purpose | Columns |
| --- | --- | --- |
| `job_categories` | Job categories | `name`, `slug`, `is_active` |
| `locations` | Job locations | `name`, `address`, `is_active` |
| `job_listing_location` | Many-to-many pivot | `job_listing_id`, `location_id` |

### 5.3 Applicant and profile tables (5)

| Table | Purpose | Columns | Limit |
| --- | --- | --- | --- |
| `applicant_profiles` | Applicant details | `user_id`, `first_name`, `last_name`, `birth_date`, `gender`, `blood_type`, `phone`, `address`, `photo_path`, `social_links` (JSON), `experience_years`, `current_job_title` | One per user |
| `applicant_cvs` | Resume management | `applicant_profile_id`, `cv_path`, `original_name`, `status` (pending or active), `order_position`, `is_primary` | 3 per profile |
| `job_histories` | Work experience | `applicant_profile_id`, `company_name`, `position`, `starting_year`, `ending_year`, `is_current` | 3 per profile |
| `education_histories` | Education | `applicant_profile_id`, `institution_name`, `degree`, `passing_year` | 3 per profile |
| `achievements` | Achievements | `applicant_profile_id`, `achievement_name`, `achievement_details` | 3 per profile |

### 5.4 Application and ATS tables (3)

**`applications`**: job applications

| Group | Columns |
| --- | --- |
| Links | `user_id`, `job_listing_id`, `applicant_profile_id` |
| Applicant snapshot | `name`, `email`, `phone`, `education_level`, `years_of_experience`, `expected_salary`, `facebook_link`, `linkedin_link` |
| Resume | `resume_path` |
| ATS | `ats_score` (JSON), `matched_keywords` (JSON), `missing_keywords` (JSON), `ats_calculation_status`, `ats_attempt_count`, `ats_last_attempted_at` |
| Workflow | `status`, `employer_notes` |

| Table | Purpose | Columns |
| --- | --- | --- |
| `status_timelines` | Status history | `application_id`, `status`, `notes` |
| `job_views` | View tracking | `job_listing_id`, `user_id` (nullable for guests), `ip_address` |

### 5.5 Relationships

- A `job_category` has many `job_listings`.
- `job_listings` and `locations` are many-to-many through `job_listing_location`.
- A user (employer) has many `job_listings`.
- A user has one `applicant_profile`.
- An `applicant_profile` has many `applicant_cvs`, `job_histories`, `education_histories` and `achievements` (max 3 each).
- A user, a `job_listing` and an `applicant_profile` each have many `applications`.
- An `application` has many `status_timelines`.
- A `job_listing` has many `job_views`.

### 5.6 Enumerations

| Field | Values |
| --- | --- |
| `applications.status` | `pending`, `shortlisted`, `rejected`, `hired` |
| `applications.ats_calculation_status` | `pending`, `processing`, `completed`, `failed` |
| `applicant_cvs.status` | `pending`, `active` |
| `job_type`, `experience_level`, `education_requirement`, `education_level`, `gender` | Not defined in the source; define before building (section 12) |

## 6. Permissions (RBAC)

Permissions are named `resource.action`.

### 6.1 Job listing permissions

| Permission | Allows |
| --- | --- |
| `job_listings.view` | View the list of job listings |
| `job_listings.show` | View a single job |
| `job_listings.create` | Open the create form |
| `job_listings.store` | Save a new job listing |
| `job_listings.edit` | Open the edit form |
| `job_listings.update` | Save changes to a job listing |
| `job_listings.destroy` | Soft delete |
| `job_listings.toggle_active` | Toggle active status |
| `job_listings.restore` | Restore from trash |
| `job_listings.force_delete` | Permanent delete |
| `job_listings.bulk_activate` | Bulk activate |
| `job_listings.bulk_deactivate` | Bulk deactivate |
| `job_listings.bulk_delete` | Bulk soft delete |
| `job_listings.applications` | View a job's applications |
| `job_listings.update_statuses` | Run the automatic status update |
| `job_listings.statistics` | View statistics |

### 6.2 Application permissions

| Permission | Allows |
| --- | --- |
| `applications.view` | View all applications |
| `applications.job_applications` | View a job's applications |
| `applications.show` | View application details |
| `applications.status.update` | Update status |
| `applications.bulk_status.update` | Bulk status update |
| `applications.destroy` | Delete an application |
| `applications.bulk_delete` | Bulk delete |
| `applications.restore` | Restore an application |
| `applications.bulk_restore` | Bulk restore |
| `applications.force_delete` | Permanent delete |
| `applications.download_resume` | Download one resume |
| `applications.bulk_download_resumes` | Bulk download |
| `applications.email.send` | Send one email |
| `applications.bulk_email.send` | Send bulk emails |
| `applications.export` | Export applications |
| `applications.export_single` | Export one application |
| `applications.recalculate_ats` | Recalculate the ATS score |

### 6.3 Category and location permissions

`job_categories.*` and `locations.*` follow one pattern: `view`, `create`, `update`, `toggle_active`, `destroy`, `restore`, `force_delete`, `bulk_delete`, `bulk_restore`, `bulk_activate`, `bulk_deactivate` and `bulk_force_delete`.

### 6.4 Proposed defaults

- **Admin:** all permissions.
- **Employer:** `job_listings.*` (without `force_delete`) and `applications.*`, limited to their own listings by policy.
- **Applicant:** no backend permissions. Applicant routes require authentication and ownership of the record.

## 7. Routes

All `/backend` routes require authentication and the listed permission. Controller action names come from the source implementation.

**Route order matters.** Register static routes (`bulk-*`, `active`, `trashed`, `statistics`) before wildcard routes such as `/{id}`. Otherwise `DELETE /backend/listing/bulk-delete` and `GET /apply/trashed` are captured by the wildcard route.

### 7.1 Public and job seeker routes

| Method | URI | Action |
| --- | --- | --- |
| GET | `/backend/seeker/jobs` | `PublicJobListingController@index` |
| GET | `/backend/seeker/jobs/{slug}` | `PublicJobListingController@show` |
| GET | `/api/jobs/popular` | `PublicJobListingController@popular` |
| GET | `/api/jobs/trending` | `PublicJobListingController@trending` |

### 7.2 Applicant routes (own records only)

| Method | URI | Action |
| --- | --- | --- |
| GET | `/apply` | `ApplyController@index` |
| GET | `/apply/create/{slug}` | `ApplyController@create` |
| POST | `/apply/store/{slug}` | `ApplyController@store` |
| GET | `/apply/trashed` | `ApplyController@trashed` |
| GET | `/apply/{id}` | `ApplyController@show` |
| GET | `/apply/{id}/edit` | `ApplyController@edit` |
| PUT | `/apply/{id}` | `ApplyController@update` |
| DELETE | `/apply/{id}` | `ApplyController@destroy` |
| POST | `/apply/{id}/restore` | `ApplyController@restore` |
| DELETE | `/apply/{id}/force-delete` | `ApplyController@forceDelete` |
| POST | `/apply/{id}/recalculate-ats` | `ApplyController@recalculateAts` |
| GET | `/apply/{id}/ats-status` | `ApplyController@getAtsStatus` |

### 7.3 Admin job listing routes

| Method | URI | Action | Permission |
| --- | --- | --- | --- |
| GET | `/backend/listing` | `JobListingController@adminIndex` | `job_listings.view` |
| GET | `/backend/listing/create` | `adminCreate` | `job_listings.create` |
| POST | `/backend/listing` | `adminStore` | `job_listings.store` |
| GET | `/backend/listing/{jobListing}` | `adminShow` | `job_listings.show` |
| GET | `/backend/listing/{jobListing}/edit` | `adminEdit` | `job_listings.edit` |
| PUT | `/backend/listing/{jobListing}` | `adminUpdate` | `job_listings.update` |
| DELETE | `/backend/listing/{jobListing}` | `adminDestroy` | `job_listings.destroy` |
| PATCH | `/backend/listing/{jobListing}/toggle-active` | `toggleActive` | `job_listings.toggle_active` |
| PATCH | `/backend/listing/{jobListing}/restore` | `restore` | `job_listings.restore` |
| DELETE | `/backend/listing/{jobListing}/force-delete` | `forceDelete` | `job_listings.force_delete` |
| GET | `/backend/listing/{jobListing}/applications` | `applications` | `job_listings.applications` |
| POST | `/backend/listing/bulk-activate` | `bulkActivate` | `job_listings.bulk_activate` |
| POST | `/backend/listing/bulk-deactivate` | `bulkDeactivate` | `job_listings.bulk_deactivate` |
| DELETE | `/backend/listing/bulk-delete` | `bulkDelete` | `job_listings.bulk_delete` |
| GET | `/backend/statistics` | `statistics` | `job_listings.statistics` |

### 7.4 Admin application routes

Controller: `ApplicationsController`.

| Method | URI | Action | Permission |
| --- | --- | --- | --- |
| GET | `/backend/applications` | `index` | `applications.view` |
| GET | `/backend/applications/job/{jobId}` | `jobApplications` | `applications.job_applications` |
| GET | `/backend/applications/{id}` | `show` | `applications.show` |
| PUT | `/backend/applications/{id}/status` | `updateStatus` | `applications.status.update` |
| POST | `/backend/applications/bulk-status` | `bulkUpdateStatus` | `applications.bulk_status.update` |
| DELETE | `/backend/applications/{id}` | `destroy` | `applications.destroy` |
| POST | `/backend/applications/bulk-delete` | `bulkDelete` | `applications.bulk_delete` |
| GET | `/backend/applications/{id}/download-resume` | `downloadResume` | `applications.download_resume` |
| POST | `/backend/applications/bulk-download` | `bulkDownloadResumes` | `applications.bulk_download_resumes` |
| POST | `/backend/applications/{id}/send-email` | `sendEmail` | `applications.email.send` |
| POST | `/backend/applications/bulk-send-email` | `sendBulkEmail` | `applications.bulk_email.send` |
| POST | `/backend/applications/{id}/recalculate-ats` | `recalculateAts` | `applications.recalculate_ats` |
| POST | `/backend/applications/export/{jobId}` | `exportApplications` | `applications.export` |
| POST | `/backend/applications/export-single/{id}` | `exportSingleApplication` | `applications.export_single` |

### 7.5 Category and location routes

The same set of routes applies to both resources. Use `categories` with `JobCategoryController`, or `locations` with `LocationController`.

| Method | URI | Action |
| --- | --- | --- |
| GET | `/backend/{resource}` | `index` |
| GET | `/backend/{resource}/active` | `getActiveCategories` or `getActiveLocations` |
| POST | `/backend/{resource}` | `store` |
| PUT | `/backend/{resource}/{id}` | `update` |
| PATCH | `/backend/{resource}/{id}/toggle-active` | `toggleActive` |
| DELETE | `/backend/{resource}/{id}` | `destroy` |
| POST | `/backend/{resource}/{id}/restore` | `restore` |
| DELETE | `/backend/{resource}/{id}/force-delete` | `forceDelete` |
| POST | `/backend/{resource}/bulk-delete` | `bulkDelete` |
| POST | `/backend/{resource}/bulk-restore` | `bulkRestore` |
| POST | `/backend/{resource}/bulk-activate` | `bulkActivate` |
| POST | `/backend/{resource}/bulk-deactivate` | `bulkDeactivate` |
| POST | `/backend/categories/bulk-force-delete` | `bulkForceDelete` (categories only in the source) |

## 8. Tech Stack and Dependencies

### 8.1 Application stack

| Layer | Choice |
| --- | --- |
| Language | PHP ^8.2 |
| Framework | Laravel 12 or later (the original specification targeted 11.x) |
| Frontend | Inertia.js with React, Tailwind CSS v4 |
| Database | MySQL 8+ or another database with JSON column support |
| Queue | Database or Redis queue worker (ATS scoring, bulk email) |
| Scheduler | Laravel scheduler (cron) for automatic job status updates and stuck-ATS detection |
| Mail | Any Laravel mail driver |

### 8.2 Composer packages

| Package | Used for | Note |
| --- | --- | --- |
| `smalot/pdfparser` ^2 | PDF text extraction | Required |
| `setasign/fpdi` ^2 | Pure-PHP PDF merge fallback | Also needs `setasign/fpdf`. Its free parser can fail on PDFs that use PDF 1.5+ compression, so keep the ZIP fallback |
| `maatwebsite/excel` | CSV and Excel export | Missing from the original list; added as a recommendation |
| `spatie/laravel-permission` | RBAC | Recommended; the original does not name an implementation |

### 8.3 PHP extensions

- `zip`: DOCX reading and ZIP downloads
- `mbstring`: multibyte lowercasing of keywords and resume text
- `fileinfo`: upload validation
- `json`

### 8.4 System binaries

Install these on every environment, including development and production servers.

| Binary | Used for |
| --- | --- |
| `pdftotext` (poppler-utils) | PDF extraction fallback |
| `antiword` | DOC extraction |
| `ghostscript` or `pdftk` | Bulk resume merge. At least one is needed; FPDI is the PHP fallback and ZIP is the last resort |

## 9. Implementation Notes

### 9.1 Models (11)

`JobListing`, `JobCategory`, `Location`, `Application`, `ApplicantProfile`, `ApplicantCv`, `JobHistory`, `EducationHistory`, `Achievement`, `JobView` and `StatusTimeline`. Each has its relationships, scopes, accessors and model events. The `job_listing_location` pivot has no model.

### 9.2 Controllers (6)

| Controller | Responsibility |
| --- | --- |
| `JobListingController` | Admin and employer job management |
| `PublicJobListingController` | Public job portal |
| `ApplicationsController` | Admin and employer application management |
| `ApplyController` | Applicant-side applications |
| `JobCategoryController` | Category CRUD |
| `LocationController` | Location CRUD |

### 9.3 Services and notifications

- `ATSService`: resume parsing, keyword matching and scoring
- `SimpleLogger`: audit logging
- `ApplicationStatusUpdated`: notification on the database channel

### 9.4 Technical patterns

- **Rate limiting:** per-action throttling with configurable limits.
- **Soft deletes:** see section 5.1 for which tables.
- **Indexes:** foreign keys, status fields and date fields.
- **Validation:** one application per applicant per job; at most 3 CVs, work histories, education entries and achievements per profile.
- **Caching:** public job filters and statistics are cached for 5 minutes.
- **File storage:** the original stores resumes on the `public` disk. Change this: see section 12, item 1.
- **JSON fields:** `benefits`, `skills`, `responsibilities`, `keywords`, `social_links`, `ats_score`, `matched_keywords` and `missing_keywords`.

## 10. Data Flow

1. The employer creates a job listing.
2. A job seeker views the job, and the view is recorded in `job_views`.
3. The seeker applies: selects a CV and completes the form.
4. The application is created and ATS scoring starts automatically (PDF, DOCX or DOC parsing).
5. The employer reviews applications with filters, sorting and visible ATS scores.
6. The employer updates the status: `pending` → `shortlisted`, `rejected` or `hired`.
7. A `status_timelines` row is recorded and the applicant receives a database notification.
8. The employer can also email applicants, download resumes, export data and recalculate ATS scores.

## 11. Delivery Plan

### 11.1 Migration order

| # | Migration | Foreign keys |
| --- | --- | --- |
| 1 | `create_job_categories_table` | None |
| 2 | `create_locations_table` | None |
| 3 | `create_job_listings_table` | `job_categories`, `users` |
| 4 | `create_job_listing_location_table` | `job_listings`, `locations` |
| 5 | `create_applicant_profiles_table` | `users` |
| 6 | `create_applicant_cvs_table` | `applicant_profiles` |
| 7 | `create_job_histories_table` | `applicant_profiles` |
| 8 | `create_education_histories_table` | `applicant_profiles` |
| 9 | `create_achievements_table` | `applicant_profiles` |
| 10 | `create_applications_table` | `users`, `job_listings`, `applicant_profiles` |
| 11 | `create_status_timelines_table` | `applications` |
| 12 | `create_job_views_table` | `job_listings`, `users` (nullable) |

### 11.2 Seeders

Run them in this order.

| Seeder | Creates |
| --- | --- |
| `JobCategorySeeder` | Default categories |
| `LocationSeeder` | Default locations |
| `JobListingSeeder` | Sample job listings with employers |
| `ApplicantProfileSeeder` | Sample applicant profiles |
| `ApplicantCvSeeder` | Sample CVs |
| `JobHistorySeeder` | Sample work history |
| `EducationHistorySeeder` | Sample education |
| `AchievementSeeder` | Sample achievements |
| `ApplicationSeeder` | Sample applications with ATS scores |

## 12. Recommended Changes and Open Decisions

These come from reviewing the original specification. Items marked **High** should be settled before the first migration is written.

### Security and privacy

1. **Resumes on the public disk (High).** The original stores resumes in `storage/app/public/`, so anyone who has or guesses a file URL can download a candidate's CV. Store resumes on a private disk and serve them only through the authorised download routes in section 7.
2. **Sensitive profile fields.** `blood_type`, `gender` and `birth_date` are personal data and can lead to discrimination in screening. Make them optional and hide them from employer screening views unless there is a clear need.
3. **Stored IP addresses.** `job_views.ip_address` is personal data. Store a salted hash instead, which still allows unique-view counting, or purge old rows on a schedule.
4. **Ownership checks (High).** Permissions alone let one employer reach another employer's applications. Add policies as described in section 2.

### Data model

5. **ATS score is not queryable (High).** The percentage lives inside the `ats_score` JSON, but employers need to sort and filter by it. Add an indexed `ats_percentage` decimal column that mirrors it.
6. **Duplicate keyword storage.** Matched and missing keywords are stored in their own columns and again inside `ats_score`. Keep one source of truth.
7. **Re-applying after withdrawal (High).** Soft-deleted rows still occupy the unique index on `(job_listing_id, user_id)`, so a withdrawn applicant cannot apply again. Decide the rule. The simplest is that they restore the withdrawn application instead of creating a new one.
8. **Resume snapshot.** `applications.resume_path` must point to a copy of the CV made at apply time, so deleting or replacing a CV in the profile does not break past applications.
9. **Undefined enumerations.** Define the allowed values for `job_type`, `experience_level`, `education_requirement`, `education_level` and `gender`, and implement them as PHP backed enums.
10. **Salary rules.** Define how `salary_min` and `salary_max` relate to the two salary flags, for example both nullable when either flag is set, and `salary_max` not below `salary_min`.
11. **Soft-delete scope.** Decide which tables carry `deleted_at` before writing migrations (section 5.1).

### Routes and permissions

12. **Missing routes.** Permissions exist for `applications.restore`, `applications.bulk_restore`, `applications.force_delete` and `job_listings.update_statuses`, but no routes use them. Add the routes (plus a trashed-applications list for admins) or drop the permissions. Run `update_statuses` as a scheduled command rather than a route.
13. **Inconsistent restore verbs.** Restore uses PATCH for listings and POST for applications, categories and locations. Pick one; PATCH fits better.
14. **Public pages under `/backend`.** `/backend/seeker/jobs` mixes public pages into the admin prefix. Move them to `/jobs` and `/jobs/{slug}`.
15. **Redundant permission pairs.** `create` and `store`, `edit` and `update`, `view` and `show` always travel together. One permission per capability (`create`, `update`, `view`) is easier to assign.
16. **Bulk force delete parity.** Categories have `bulk-force-delete`; locations do not. Add it to locations or remove it from both.

### ATS

17. **Use a queue (High).** The status flow assumes background work. Dispatch a queued job on submit, and add a scheduled command that flags or resets applications stuck for more than 30 minutes.
18. **Keywords with symbols.** `\b` does not work next to symbols, so `c++`, `c#` and `.net` will never match. Escape every keyword with `preg_quote`, and replace `\b` with lookarounds such as `(?<![\p{L}\p{N}])` and `(?![\p{L}\p{N}])`.
19. **Jobs with no keywords.** The formula divides by zero. Recommended: mark the calculation `completed` with no score and show "no keywords set" in the UI.
20. **Scanned PDFs.** Image-only resumes produce no text and would score 0%. Mark them `failed` with a clear message instead. OCR is out of scope.
21. **Placeholder fields.** Implement `extracted_skills`, `extracted_experience_years` and `extracted_education`, or remove them from the stored JSON.
22. **Label the score honestly.** It measures keyword coverage, not candidate quality. Call it "keyword match" in the UI.

### Dependencies

23. **Missing packages.** The original list had no Excel export package and no FPDF base for FPDI. Both are added in section 8.2.

*Source: derived from analysis of the Dwip Unnayan Sangstha codebase.*
