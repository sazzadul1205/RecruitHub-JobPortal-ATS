# Job Portal & ATS — Pages & Design Reference

Complete page inventory with component structure, UI patterns, and design system details for reusing designs in a new Laravel Job Portal project.

> **📁 Source Code Location**: All referenced files are in the `Dwip-Unnayan-Sangstha` project.
> To copy a design, navigate to the file path listed under each page and copy the JSX/Tailwind code.
> Root path: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\`

---

## 📐 Design System

### Tech Stack

- **Frontend**: React + Inertia.js + Tailwind CSS
- **UI Library**: Tailwind CSS v4 (`bg-linear-to-r`, `bg-size-[200%_100%]` syntax)
- **Icons**: `react-icons/fa` (Font Awesome)
- **Notifications**: SweetAlert2 (`sweetalert2`)
- **Charts**: Chart.js + `react-chartjs-2` (Pie, Bar, Line, Doughnut)
- **Layout**: `AuthenticatedLayout` (sidebar + topbar + main content)

### Color Palette (Tailwind)

| Purpose           | Classes                            |
| ----------------- | ---------------------------------- |
| Primary/Active    | `blue-500`, `blue-600`, `blue-700` |
| Success/Completed | `green-500`, `green-600`           |
| Warning/Pending   | `amber-500`, `yellow-500`          |
| Error/Rejected    | `red-500`, `red-600`               |
| Info/Shortlisted  | `blue-500`                         |
| Hired             | `emerald-500`, `green-600`         |
| Gray neutrals     | `gray-50` through `gray-900`       |

### Common Component Patterns

#### Page Structure

```
<AuthenticatedLayout>
  <Head title="Page Title" />
  <!-- Page content -->
</AuthenticatedLayout>
```

#### Status Badges

```jsx
// Pending
<span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">Pending</span>

// Shortlisted
<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Shortlisted</span>

// Rejected
<span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Rejected</span>

// Hired
<span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Hired</span>
```

#### ATS Score Badge

```jsx
// Excellent (>=80%)
<span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">85%</span>

// Good (60-79%)
<span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">70%</span>

// Fair (40-59%)
<span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full">50%</span>

// Needs Improvement (<40%)
<span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">30%</span>
```

#### Filter Button

```jsx
<button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
    <FaFilter size={14} /> Filters
</button>
```

#### Search Input

```jsx
<div className="relative">
    <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={14} />
    <input
        type="text"
        placeholder="Search jobs..."
        className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-9 focus:ring-2 focus:ring-blue-500"
    />
</div>
```

#### Bulk Action Bar

```jsx
<div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
    <span className="text-sm font-medium text-blue-700">{selectedCount} selected</span>
    <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">Activate</button>
    <button className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">Delete</button>
</div>
```

#### Pagination

```jsx
<nav className="flex items-center gap-1">
    <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50">
        <FaChevronLeft />
    </button>
    <span className="px-3 py-1.5 text-sm text-gray-600">Page 1 of 10</span>
    <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
        <FaChevronRight />
    </button>
</nav>
```

#### Skeleton Loading (Shimmer)

```jsx
<div className="animate-shimmer bg-size-[200%_100%] h-4 rounded bg-linear-to-r from-gray-200 via-gray-100 to-gray-200" />
```

---

## 📄 Page Inventory

### 1. Job Listings — Admin Index

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\JobListings\Index.jsx`

**Controller**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\app\Http\Controllers\JobListing\JobListingController.php` → `adminIndex()`
**Route**: `GET /backend/listing` → `listing.index`
**Props passed**: `jobListings` (paginated), `activeJobs`, `inactiveJobs`, `deletedJobs`, `totalViews`, `totalJobs`, `filters`, `filterOptions`

**Purpose**: Admin/Employer dashboard to manage all job postings.

**Key UI Elements**:

- Stats cards at top (Active Jobs, Inactive Jobs, Deleted Jobs, Total Views, Total Jobs)
- Search + Filter bar (status, category, job_type, experience_level, location, date range)
- Data table with columns: checkbox, Job Title + Category badge, Employer, Locations, Job Type, Status toggle, Applications count, Views, Deadline, Actions (Edit, View, Delete)
- Bulk action toolbar (appears when rows selected): Activate, Deactivate, Delete
- Pagination
- Trash view toggle (show active vs trashed)
- Export/Statistics link

**Table Row Layout**:

```
[Checkbox] [Title + Category Badge + Salary] [Employer Name] [Locations] [Job Type Badge] [Status Toggle] [App Count] [Views] [Deadline] [Actions Menu]
```

**Actions**:

- Toggle Active (switch component)
- Edit → navigates to Edit page
- View → navigates to Show page
- Delete → SweetAlert confirm → soft delete
- Restore (for trashed items)
- Force Delete (for trashed items)

---

### 2. Job Listings — Create (Wizard)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\JobListings\Create.jsx`

**Controller**: `JobListingController.php` → `adminCreate()` / `adminStore()`
**Route**: `GET /backend/listing/create` → `listing.create`, `POST /backend/listing` → `listing.store`
**Props passed**: `categories`, `locations`

**Purpose**: Multi-step wizard to create a new job posting.

**Steps (6 total)**:

| Step | Component          | Fields                                                                                                             |
| ---- | ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 1    | `BasicInfoStep`    | title, category_id, job_type, experience_level, description (RichTextEditor)                                       |
| 2    | `RequirementsStep` | requirements, skills (array), responsibilities (array), benefits (array), education_requirement, education_details |
| 3    | `LocationStep`     | location_ids (multi-select checkboxes)                                                                             |
| 4    | `CompensationStep` | salary_min, salary_max, is_salary_negotiable, as_per_companies_policy, keywords (array)                            |
| 5    | `PublishingStep`   | application_deadline, publish_at, is_active, required_linkedin_link, required_facebook_link                        |
| 6    | `ReviewStep`       | Summary of all entered data with edit links                                                                        |

**Step Indicator**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\StepIndicator.jsx`
**Step Wrapper**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\StepWrapper.jsx`
**Step Navigation**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\StepNavigation.jsx`
**BasicInfoStep**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\BasicInfoStep.jsx`
**RequirementsStep**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\RequirementsStep.jsx`
**LocationStep**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\LocationStep.jsx`
**CompensationStep**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\CompensationStep.jsx`
**PublishingStep**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\PublishingStep.jsx`
**ReviewStep**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\ReviewStep.jsx`

- Desktop: Horizontal progress bar with 6 numbered circles + icons
- Completed steps: Green gradient circles with check icon
- Active step: Blue gradient circle with pulse ring animation
- Upcoming steps: White with gray border
- Mobile: Horizontal scroll with progress percentage bar

**Navigation**: StepNavigation component with Back / Next / Submit buttons.

**Step Wrapper** (`StepWrapper.jsx`): Card container with title, description, and step number badge.

---

### 3. Job Listings — Edit

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\JobListings\Edit.jsx`

**Controller**: `JobListingController.php` → `adminEdit()` / `adminUpdate()`
**Route**: `GET /backend/listing/{jobListing}/edit` → `listing.edit`, `PUT /backend/listing/{jobListing}` → `listing.update`
**Props passed**: `jobListing`, `categories`, `locations`

**Purpose**: Edit an existing job listing (single page form or wizard).

**Layout**: Similar to Create but pre-populated with existing data. Locations synced via checkboxes.

---

### 4. Job Listings — Show (Admin Detail)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\JobListings\Show.jsx`

**Controller**: `JobListingController.php` → `adminShow()`
**Route**: `GET /backend/listing/{jobListing}` → `listing.show`
**Props passed**: `jobListing`, `applicationStats`, `averageAtsScore`, `recentApplications`, `totalViews`

**Purpose**: Full job detail view for admin/employer with application overview.

**Key UI Sections**:

- **Header**: Job title, status badge, salary range, actions (Edit, Toggle Active, Delete)
- **Tabs**: Details | Applications | Analytics
- **Details Tab**:
    - Description (rich text rendered)
    - Requirements
    - Benefits (badge chips)
    - Skills (badge chips)
    - Responsibilities (list)
    - Education requirement
    - Keywords (badge chips)
    - Employer info card (name, email)
    - Location(s)
    - Job type, experience level, deadline, publish date
    - Social link requirements (Facebook/LinkedIn required badges)
- **Applications Tab**: Recent applications list (10) with applicant name, status, ATS score, date, actions
- **Stats Cards**: Total Views, Total Applications, Pending, Shortlisted, Rejected, Hired, Average ATS Score

---

### 5. Job Listings — Applications (Per Job)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\JobListings\Applications.jsx`

**Controller**: `JobListingController.php` → `applications()`
**Route**: `GET /backend/listing/{jobListing}/applications` → `listing.applications`
**Props passed**: `jobListing`, `applications` (paginated), `stats`

**Purpose**: View all applications for a specific job.

**Key UI Elements**:

- Job title header with back link
- Status count cards (Total, Pending, Shortlisted, Rejected, Hired)
- Filter bar (status, search, ATS score range, experience range, salary range)
- Applications table: Applicant name + email, Phone, ATS Score badge, Status, Applied date, Actions (View, Status change, Download Resume, Email)
- Bulk actions: Status change, Delete, Download resumes, Send email
- Export button

---

### 6. Applications — Global Index (Admin)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Applications\Index.jsx`

**Controller**: `ApplicationsController.php` → `index()`
**Route**: `GET /backend/applications` → `applications.index`
**Props passed**: `applications` (paginated), `jobs`, `categories`, `locations`, `jobTypes`, `educationLevels`, `filters`, `statusCounts`, `totalApplications`, `filterOptions`

**Purpose**: View and manage ALL applications across all jobs.

**Key UI Elements**:

- Stats bar: Total, Pending, Shortlisted, Rejected, Hired, Deleted
- Advanced filters panel (collapsible):
    - Status, Job, Category, Search
    - Date range (from/to + quick presets: today, yesterday, this week, this month, last month)
    - ATS score range (min/max)
    - Experience range (min/max)
    - Salary range (min/max)
    - Education level, Job type, Location
    - Trashed toggle (only/with/none)
- Sortable table columns: Applicant, Job, ATS Score, Status, Experience, Salary, Applied Date, Actions
- Bulk actions: Status update, Delete, Restore, Download resumes, Send bulk email
- Export (CSV/Excel)
- Pagination

**Table Row**:

```
[Checkbox] [Applicant Name + Email + Phone] [Job Title + Category] [ATS Score Badge] [Status Badge] [Exp Years] [Salary] [Applied Date] [Actions Dropdown]
```

---

### 7. Applications — Show (Admin Detail)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Applications\Show.jsx`

**Controller**: `ApplicationsController.php` → `show()`
**Route**: `GET /backend/applications/{id}` → `applications.show`
**Props passed**: `application` (with jobListing, applicantProfile, statusTimelines), `atsAnalysis`

**Purpose**: Full application detail with ATS analysis, profile, timeline, and actions.

**Key UI Sections**:

- **Header**: Applicant name, job title, status badge, actions (Change Status, Download Resume, Send Email, Recalculate ATS, Delete)
- **Left Column**:
  - Applicant Info Card: Name, email, phone, location, photo
  - Professional Info: Experience years, current job title, education level
  - Social Links: Facebook, LinkedIn (with icons)
  - Resume: File name + Download button
  - Expected Salary
- **Right Column (2/3)**:
  - **ATS Score Card**:
        - Score percentage (large, colored by level)
        - Analysis level badge (Excellent/Good/Fair/Needs Improvement)
        - Message text
        - Matched keywords (green badges)
        - Missing keywords (red badges)
        - Suggestions list
        - Calculated timestamp
        - Recalculate button
  - **Work History**: Timeline of past jobs (company, position, duration)
  - **Education History**: List (institution, degree, passing year)
  - **Achievements**: List (name, details)
  - **Status Timeline**: Chronological status changes with notes

---

### 8. Job Applications — Per Job (Admin)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Applications\JobApplications.jsx`

**Controller**: `ApplicationsController.php` → `jobApplications()`
**Route**: `GET /backend/applications/job/{jobId}` → `applications.job`
**Props passed**: `job`, `applications` (paginated), `statusCounts`, `filters`, `filterOptions`

**Purpose**: Applications filtered for a specific job (simpler version of global index).

---

### 9. Apply — My Applications (Applicant)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Apply\Index.jsx`

**Controller**: `ApplyController.php` → `index()`
**Route**: `GET /apply` → `apply.index`
**Props passed**: `applications` (paginated), `stats`

**Purpose**: Job seeker views their own submitted applications.

**Key UI Elements**:

- Stats cards: Total, Pending, Shortlisted, Rejected, Hired, Average ATS Score
- Application cards (grid layout):
    - Job title + slug link
    - Employer name
    - Status badge
    - Expected salary
    - Applied date
    - ATS score badge + status
    - Actions: View, Edit (if pending), Withdraw, Recalculate ATS
- Trashed applications section (toggle)
- Pagination

---

### 10. Apply — Create (Application Form)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Apply\Create.jsx`

**Controller**: `ApplyController.php` → `create()` / `store()`
**Route**: `GET /apply/create/{slug}` → `apply.create`, `POST /apply/store/{slug}` → `apply.store`
**Props passed**: `jobListing`, `applicantProfile`, `cvs`, `hasSoftDeleted`

**Purpose**: Job seeker applies for a specific job.

**Key UI Sections**:

- **Job Summary Card** (left sidebar):
    - Job title, company, location
    - Job type, experience level
    - Salary range
    - Application deadline
    - Required social links indicator
- **Application Form** (main area):
    - CV Selection (radio cards from applicant's uploaded CVs, primary highlighted)
    - Name (pre-filled from profile)
    - Email (pre-filled)
    - Phone
    - Expected Salary
    - LinkedIn URL (required if job requires)
    - Facebook URL (required if job requires)
- **ATS Preview** (if available): Shows keyword match preview before submission
- Submit button with loading state

---

### 11. Apply — Edit

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Apply\Edit.jsx`

**Controller**: `ApplyController.php` → `edit()` / `update()`
**Route**: `GET /apply/{id}/edit` → `apply.edit`, `PUT /apply/{id}` → `apply.update`
**Props passed**: `application`, `jobListing`, `cvs`, `currentCvId`

**Purpose**: Edit an existing pending application.

**Layout**: Same as Create but pre-filled. Only accessible if status = pending.

---

### 12. Apply — Show (Applicant View)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Apply\Show.jsx`

**Controller**: `ApplyController.php` → `show()`
**Route**: `GET /apply/{id}` → `apply.show`
**Props passed**: `application`, `jobListing`, `applicantProfile`, `statusTimeline`, `atsDetails`, `atsStatus`, `isDeleted`

**Purpose**: Job seeker views their application detail.

**Key UI Sections**:

- **Application Info Card**: Job title, status badge, applied date, expected salary
- **ATS Score Display**:
    - Circular progress or large percentage
    - Analysis level with color
    - Matched/missing keywords (color-coded)
    - Suggestions
    - Recalculate button (if failed/stuck)
- **Status Timeline**: Vertical timeline with status changes and employer notes
- **Employer Notes**: Any notes from employer
- **Resume**: Download link
- **Job Info**: Quick job summary

---

### 13. Public Job Listing — Index (Job Seeker)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\PublicJobListing\Index.jsx`

**Controller**: `PublicJobListingController.php` → `index()`
**Route**: `GET /backend/seeker/jobs` → `public.jobs.index`
**Props passed**: `jobListings` (paginated), `categories`, `locations`, `jobTypes`, `experienceLevels`, `salaryRange`, `filters`, `stats`

**Purpose**: Job seeker browses available jobs (auth-gated).

**Key UI Elements**:

- **Search Bar**: Full-width search input with icon
- **Filter Panel** (collapsible):
    - Category (dropdown with counts)
    - Location (dropdown with counts)
    - Job Type (dropdown)
    - Experience Level (dropdown)
    - Salary Range (min/max inputs)
- **Sort Dropdown**: Latest, Oldest, Deadline Soon, Deadline Later, Salary High, Salary Low, Popular, Most Applied
- **Job Cards** (grid/list layout):
    - Title + Category badge
    - Company name + Location
    - Salary range
    - Job type + Experience level badges
    - Description (truncated 150 chars)
    - Views + Applications count
    - Deadline indicator (urgent if < 7 days)
    - "View Details" button / "Apply Now" quick link
- **Stats Bar**: Total Jobs, Total Views, Total Applications
- **Skeleton Loading**: Shimmer cards while data loads
- **Pagination**: 12 per page
- **Empty State**: When no jobs match filters

---

### 14. Public Job Listing — Show (Job Seeker Detail)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\PublicJobListing\Show.jsx`

**Controller**: `PublicJobListingController.php` → `show()`
**Route**: `GET /backend/seeker/jobs/{slug}` → `public.jobs.show`
**Props passed**: `jobListing`, `userData`, `hasApplied`, `existingApplication`, `relatedJobs`, `applicationStats`, `averageAtsScore`

**Purpose**: Full job detail for job seeker with apply CTA.

**Key UI Sections**:

- **Header**: Job title, company, location, salary, job type, experience level badges
- **Action Buttons**: Apply Now (primary), Share, Bookmark, Back to Listings
- **Job Details**:
    - Full description (rich text)
    - Requirements
    - Responsibilities (checklist)
    - Benefits (badge chips with icons)
    - Skills (badge chips)
    - Education requirement
    - Keywords
- **Sidebar**:
    - Company info card (name, email)
    - Location(s)
    - Application stats (views, applications, average ATS)
    - Deadline with urgency indicator
    - Related jobs (3 cards)
- **Applied State**: If user already applied, show "Applied" badge + link to application
- **Skeleton Loading**: Cards while loading

---

### 15. Statistics Dashboard

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Statistics\Index.jsx`

**Controller**: `JobListingController.php` → `statistics()`
**Route**: `GET /backend/statistics` → `statistics.index`
**Props passed**: `summary`, `trends`, `jobsByType`, `jobsByExperience`, `jobsByCategory`, `jobsByLocation`, `monthlyJobs`, `applicationsByStatus`, `monthlyApplications`, `applicationsByJob`, `atsScoreByJobType`, `topEmployers`, `topEmployersByApplications`, `dateRange`, `filters`

**Purpose**: Comprehensive analytics dashboard with Chart.js visualizations.

**Key UI Sections**:

- **Date Range Selector**: All time, Today, This Week, This Month, Last Month, Custom
- **Summary Cards** (with trend arrows):
    - Total Jobs (↑/↓ trend)
    - Active Jobs
    - Total Applications (↑/↓ trend)
    - Pending / Shortlisted / Rejected / Hired
    - Conversion Rate (↑/↓ trend)
- **Charts** (Chart.js):
    - Jobs by Type (Pie/Doughnut)
    - Jobs by Experience Level (Bar)
    - Jobs by Category (Bar - top 10)
    - Jobs by Location (Bar - top 10)
    - Monthly Jobs (Line - 12 months)
    - Applications by Status (Doughnut)
    - Monthly Applications (Line - 12 months)
    - Applications by Job (Bar - top 10)
    - ATS Score by Job Type (Bar)
    - Top Employers (list)
    - Top Employers by Applications (list)

---

### 16. Job Categories Management

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\JobCategories\Index.jsx`
**Modal File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\JobCategories\CategoryModal.jsx`

**Controller**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\app\Http\Controllers\Backend\JobCategoryController.php`
**Route**: `GET /backend/categories` → `categories.index`

**Purpose**: CRUD for job categories.

**Key UI Elements**:

- Category cards/table: Name, Slug, Job count, Active toggle, Actions (Edit, Delete)
- Add Category modal (`CategoryModal.jsx`): Name input
- Bulk actions: Activate, Deactivate, Delete, Restore, Force Delete
- Search bar

---

### 17. Locations Management

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Locations\Index.jsx`
**Modal File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Locations\LocationModal.jsx`

**Controller**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\app\Http\Controllers\Backend\LocationController.php`
**Route**: `GET /backend/locations` → `locations.index`

**Purpose**: CRUD for job locations.

**Key UI Elements**:

- Location cards/table: Name, Address, Job count, Active toggle, Actions
- Add Location modal (`LocationModal.jsx`): Name, Address inputs
- Bulk actions: Activate, Deactivate, Delete, Restore
- Search bar

---

### 18. Applicant Profiles (Admin)

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\Backend\Users\Jobseekers\Index.jsx`

**Controller**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\app\Http\Controllers\Profile\ApplicantProfileController.php`
**Route**: `GET /backend/applicant-profiles` → `applicant-profile.index`

**Purpose**: Admin views and manages applicant profiles.

**Key UI Elements**:

- Profile cards: Photo, Name, Email, Phone, Experience, Complete profile indicator
- Actions: View, Delete, Restore
- Bulk: Delete, Restore
- Export button
- CV management per profile (upload, set primary, delete)

---

### 19. Unauthorized Access

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\pages\UnauthorizedAccess.jsx`

**Purpose**: Access denied page shown when user lacks permissions.

**Design**:

```
Centered card with:
- Shield icon in red circle
- "Access Denied" title
- "You don't have permission to..." message
- Back button (link to previous page)
```

---

## 🧩 Reusable Components

### JobListingSteps (6 Step Components)

| Component          | Source File                                                                                          | Purpose                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `StepIndicator`    | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\StepIndicator.jsx`    | Progress bar with icons (desktop + mobile)          |
| `StepWrapper`      | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\StepWrapper.jsx`      | Card wrapper with title/description                 |
| `StepNavigation`   | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\StepNavigation.jsx`   | Back/Next/Submit buttons                            |
| `BasicInfoStep`    | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\BasicInfoStep.jsx`    | Title, category, job type, experience, description  |
| `RequirementsStep` | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\RequirementsStep.jsx` | Skills, responsibilities, benefits, education       |
| `LocationStep`     | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\LocationStep.jsx`     | Multi-select locations                              |
| `CompensationStep` | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\CompensationStep.jsx` | Salary range, negotiable, policy, keywords          |
| `PublishingStep`   | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\PublishingStep.jsx`   | Deadline, publish date, active toggle, social links |
| `ReviewStep`       | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\JobListingSteps\ReviewStep.jsx`       | Summary of all data before submit                   |

### Email Modal

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\EmailModal.jsx`

**Purpose**: Send emails to applicants with pre-built templates.

**Templates**:

- Shortlisted - Interview Invitation
- Application Status Update - Not Selected
- Hired - Welcome to the Team
- Custom (blank)

**Features**: Subject input, rich text content area, template selector, send button.

### Auth Components

| Component | Source File                                                                     | Purpose                         |
| --------- | ------------------------------------------------------------------------------- | ------------------------------- |
| `Can`     | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\Auth\Can.jsx`    | Single permission check wrapper |
| `CanAny`  | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\components\Auth\CanAny.jsx` | Any-of permission check wrapper |

### Hooks

| Hook            | Source File                                                                 | Purpose                                           |
| --------------- | --------------------------------------------------------------------------- | ------------------------------------------------- |
| `useAuth`       | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\hooks\useAuth.js`       | Auth state + permission/role checks               |
| `useEmailModal` | `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\hooks\useEmailModal.js` | Email modal open/close state + template selection |

### Layout

**Source File**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\resources\js\layouts\AuthenticatedLayout.jsx`

**Purpose**: Main admin layout with sidebar navigation, topbar, user menu, notifications.

---

## 📐 Layout Patterns

### Admin Page Layout (Sidebar + Content)

```
┌─────────────────────────────────────────────────────┐
│ TopBar (user avatar, notifications, logout)          │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │ Main Content Area                        │
│          │                                          │
│ - Nav    │ ┌─────────────────────────────────────┐ │
│   items  │ │ Page Header (title + actions)       │ │
│ - Groups │ ├─────────────────────────────────────┤ │
│          │ │ Stats Cards (if applicable)         │ │
│          │ ├─────────────────────────────────────┤ │
│          │ │ Filter/Search Bar                   │ │
│          │ ├─────────────────────────────────────┤ │
│          │ │ Data Table / Cards                  │ │
│          │ ├─────────────────────────────────────┤ │
│          │ │ Pagination                          │ │
│          │ └─────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────┘
```

### Job Seeker Portal Layout

```
┌─────────────────────────────────────────────────────┐
│ TopBar (logo, nav, user menu)                        │
├─────────────────────────────────────────────────────┤
│ Main Content (full width or centered max-w-7xl)     │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Page Header: "Find Jobs" + Search Bar          │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ Filter Panel (collapsible)                     │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ Job Cards Grid (2-3 columns)                   │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐        │ │
│ │ │ Job Card │ │ Job Card │ │ Job Card │        │ │
│ │ └──────────┘ └──────────┘ └──────────┘        │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ Pagination                                     │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Application Detail Layout

```
┌─────────────────────────────────────────────────────┐
│ Back Link                                            │
├─────────────────────────────────────────────────────┤
│ Header: Applicant Name + Job + Status + Actions     │
├──────────────────────┬──────────────────────────────┤
│ Left (1/3)           │ Right (2/3)                  │
│                      │                              │
│ ┌──────────────────┐ │ ┌──────────────────────────┐ │
│ │ Applicant Info   │ │ │ ATS Score Card           │ │
│ │ - Photo          │ │ │ - Percentage             │ │
│ │ - Name, Email    │ │ │ - Level Badge            │ │
│ │ - Phone          │ │ │ - Matched Keywords       │ │
│ │ - Location       │ │ │ - Missing Keywords       │ │
│ │ - Social Links   │ │ │ - Suggestions            │ │
│ └──────────────────┘ │ └──────────────────────────┘ │
│ ┌──────────────────┐ │ ┌──────────────────────────┐ │
│ │ Professional     │ │ │ Work History Timeline    │ │
│ │ - Experience     │ │ └──────────────────────────┘ │
│ │ - Education      │ │ ┌──────────────────────────┐ │
│ │ - Salary         │ │ │ Education History        │ │
│ └──────────────────┘ │ └──────────────────────────┘ │
│ ┌──────────────────┐ │ ┌──────────────────────────┐ │
│ │ Resume Download  │ │ │ Achievements             │ │
│ └──────────────────┘ │ └──────────────────────────┘ │
│                      │ ┌──────────────────────────┐ │
│                      │ │ Status Timeline          │ │
│                      │ └──────────────────────────┘ │
└──────────────────────┴──────────────────────────────┘
```

### Job Create Wizard Layout

```
┌─────────────────────────────────────────────────────┐
│ Back Link + Title                                    │
├─────────────────────────────────────────────────────┤
│ Step Indicator (progress bar with 6 circles)        │
│  [1]━━[2]━━[3]━━[4]━━[5]━━[6]                      │
│  ✓    ✓    ●    ○    ○    ○                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Step Content (card with title + description)       │
│  ┌───────────────────────────────────────────────┐  │
│  │ Basic Information                             │  │
│  │                                               │  │
│  │ Job Title:    [_______________]               │  │
│  │ Category:     [Dropdown      ]               │  │
│  │ Job Type:     [Dropdown      ]               │  │
│  │ Experience:   [Dropdown      ]               │  │
│  │ Description:  [RichTextEditor]                │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│ [← Back]                              [Next →]      │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Component Design Tokens

### Cards

```css
/* Standard card */
.bg-white.rounded-xl.shadow-md.overflow-hidden

/* Card with header */
.bg-white.rounded-2xl.shadow-sm.border.border-gray-100
  .card-header: bg-gray-50/50.border-b.border-gray-100.px-6.py-4

/* Stat card */
.bg-white.rounded-xl.shadow-md.p-6
```

### Buttons

```css
/* Primary */
.bg-blue-600.text-white.hover:bg-blue-700.px-4.py-2.rounded-lg

/* Secondary */
.bg-white.border.border-gray-300.text-gray-700.hover:bg-gray-50.px-4.py-2.rounded-lg

/* Danger */
.bg-red-600.text-white.hover:bg-red-700.px-4.py-2.rounded-lg

/* Small */
.px-3.py-1.5.text-sm.rounded-md
```

### Form Inputs

```css
/* Text input */
.w-full.px-3.py-2.5.border.border-gray-300.rounded-lg.focus:ring-2.focus:ring-blue-500.focus:border-transparent

/* Select */
.w-full.px-3.py-2.5.border.border-gray-300.rounded-lg.focus:ring-2.focus:ring-blue-500

/* Error state */
.border-red-500
```

### Tables

```css
/* Table container */
.bg-white.rounded-xl.shadow-md.overflow-hidden
.overflow-x-auto

/* Header */
.bg-gray-50.px-6.py-3.text-left.text-xs.font-medium.text-gray-500.uppercase

/* Row */
.px-6.py-4.border-b.border-gray-100.hover:bg-gray-50

/* Selected row */
.bg-blue-50
```

### Badges

```css
/* Status badges */
inline-flex.items-center.px-2.5.py-0.5.rounded-full.text-xs.font-medium

/* Job type badge */
inline-flex.items-center.px-2.py-1.rounded-lg.text-xs.font-medium.bg-gray-100.text-gray-700

/* Category badge */
inline-flex.items-center.px-2.py-1.rounded-lg.text-xs.font-medium.bg-blue-100.text-blue-700
```

---

## 📊 ATS Score Display Patterns

### Circular Progress (Applicant View)

```jsx
<div className="relative h-24 w-24">
    <svg className="-rotate-90 transform">
        <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle
            cx="48"
            cy="48"
            r="40"
            stroke={scoreColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
            strokeLinecap="round"
        />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">{score}%</span>
</div>
```

### Score Color Mapping

| Score  | Color  | Tailwind                               |
| ------ | ------ | -------------------------------------- |
| 80-100 | Green  | `text-green-600`, `stroke-green-500`   |
| 60-79  | Blue   | `text-blue-600`, `stroke-blue-500`     |
| 40-59  | Yellow | `text-yellow-600`, `stroke-yellow-500` |
| 0-39   | Red    | `text-red-600`, `stroke-red-500`       |

### Matched/Missing Keywords

```jsx
{
    /* Matched */
}
<span className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700">{keyword}</span>;

{
    /* Missing */
}
<span className="rounded-md bg-red-100 px-2 py-1 text-xs text-red-700">{keyword}</span>;
```

---

## 📱 Responsive Breakpoints

| Screen  | Width       | Layout Changes                                                            |
| ------- | ----------- | ------------------------------------------------------------------------- |
| Mobile  | < 640px     | Single column, hamburger menu, stacked cards, horizontal scroll for steps |
| Tablet  | 640-1024px  | 2-column grids, collapsible filters, condensed table                      |
| Desktop | 1024-1280px | 3-column cards, full sidebar, full table columns                          |
| Large   | > 1280px    | Max width 7xl centered, all columns visible                               |

---

## 🔄 Common Interactions

### SweetAlert2 Patterns

```javascript
// Success
Swal.fire({ icon: 'success', title: 'Success!', text: 'Job created', timer: 2000, showConfirmButton: false });

// Error
Swal.fire({ icon: 'error', title: 'Error!', text: 'Something went wrong', confirmButtonColor: '#ef4444' });

// Confirm Delete
Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
}).then((result) => {
    if (result.isConfirmed) {
        /* delete */
    }
});

// Loading
Swal.fire({ title: 'Processing...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
```

### Toast/Flash Messages

```javascript
useEffect(() => {
    if (flash?.success) {
        Swal.fire({ icon: 'success', title: 'Success!', text: flash.success, timer: 2000, showConfirmButton: false });
    }
    if (flash?.error) {
        Swal.fire({ icon: 'error', title: 'Error!', text: flash.error, confirmButtonColor: '#ef4444' });
    }
}, [flash]);
```

---

## 📁 File Structure for New Project

> **Reference Source Root**: `D:\Xampp\htdocs\Dwip-Unnayan-Sangstha\`
> Each file below links to its original source. Navigate to the source path to copy the design.

```
resources/js/
├── pages/
│   └── Backend/
│       ├── JobListings/
│       │   ├── Index.jsx          # → resources/js/pages/Backend/JobListings/Index.jsx
│       │   ├── Create.jsx         # → resources/js/pages/Backend/JobListings/Create.jsx
│       │   ├── Edit.jsx           # → resources/js/pages/Backend/JobListings/Edit.jsx
│       │   ├── Show.jsx           # → resources/js/pages/Backend/JobListings/Show.jsx
│       │   └── Applications.jsx   # → resources/js/pages/Backend/JobListings/Applications.jsx
│       ├── Applications/
│       │   ├── Index.jsx          # → resources/js/pages/Backend/Applications/Index.jsx
│       │   ├── JobApplications.jsx # → resources/js/pages/Backend/Applications/JobApplications.jsx
│       │   └── Show.jsx           # → resources/js/pages/Backend/Applications/Show.jsx
│       ├── Apply/
│       │   ├── Index.jsx          # → resources/js/pages/Backend/Apply/Index.jsx
│       │   ├── Create.jsx         # → resources/js/pages/Backend/Apply/Create.jsx
│       │   ├── Edit.jsx           # → resources/js/pages/Backend/Apply/Edit.jsx
│       │   └── Show.jsx           # → resources/js/pages/Backend/Apply/Show.jsx
│       ├── PublicJobListing/
│       │   ├── Index.jsx          # → resources/js/pages/Backend/PublicJobListing/Index.jsx
│       │   └── Show.jsx           # → resources/js/pages/Backend/PublicJobListing/Show.jsx
│       ├── Statistics/
│       │   └── Index.jsx          # → resources/js/pages/Backend/Statistics/Index.jsx
│       ├── JobCategories/
│       │   ├── Index.jsx          # → resources/js/pages/Backend/JobCategories/Index.jsx
│       │   └── CategoryModal.jsx  # → resources/js/pages/Backend/JobCategories/CategoryModal.jsx
│       ├── Locations/
│       │   ├── Index.jsx          # → resources/js/pages/Backend/Locations/Index.jsx
│       │   └── LocationModal.jsx  # → resources/js/pages/Backend/Locations/LocationModal.jsx
│       ├── Users/
│       │   └── Jobseekers/
│       │       └── Index.jsx      # → resources/js/pages/Backend/Users/Jobseekers/Index.jsx
│       └── UnauthorizedAccess.jsx # → resources/js/pages/UnauthorizedAccess.jsx
├── components/
│   ├── JobListingSteps/
│   │   ├── StepIndicator.jsx      # → resources/js/components/JobListingSteps/StepIndicator.jsx
│   │   ├── StepWrapper.jsx        # → resources/js/components/JobListingSteps/StepWrapper.jsx
│   │   ├── StepNavigation.jsx     # → resources/js/components/JobListingSteps/StepNavigation.jsx
│   │   ├── BasicInfoStep.jsx      # → resources/js/components/JobListingSteps/BasicInfoStep.jsx
│   │   ├── RequirementsStep.jsx   # → resources/js/components/JobListingSteps/RequirementsStep.jsx
│   │   ├── LocationStep.jsx       # → resources/js/components/JobListingSteps/LocationStep.jsx
│   │   ├── CompensationStep.jsx   # → resources/js/components/JobListingSteps/CompensationStep.jsx
│   │   ├── PublishingStep.jsx     # → resources/js/components/JobListingSteps/PublishingStep.jsx
│   │   └── ReviewStep.jsx         # → resources/js/components/JobListingSteps/ReviewStep.jsx
│   ├── EmailModal.jsx             # → resources/js/components/EmailModal.jsx
│   └── Auth/
│       ├── Can.jsx                # → resources/js/components/Auth/Can.jsx
│       └── CanAny.jsx             # → resources/js/components/Auth/CanAny.jsx
├── hooks/
│   ├── useAuth.js                 # → resources/js/hooks/useAuth.js
│   └── useEmailModal.js           # → resources/js/hooks/useEmailModal.js
├── layouts/
│   └── AuthenticatedLayout.jsx    # → resources/js/layouts/AuthenticatedLayout.jsx
└── utils/
    └── sectionHelpers.js          # → resources/js/utils/sectionHelpers.js
```

---

_Generated from Dwip-Unnayan-Sangstha codebase analysis_
_Last Updated: 2026-11-24_
