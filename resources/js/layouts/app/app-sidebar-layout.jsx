export default function AppSidebarLayout({ children, breadcrumbs = [] }) {
    return <div className="min-h-screen bg-gray-50 p-6 md:p-8">{children}</div>;
}
