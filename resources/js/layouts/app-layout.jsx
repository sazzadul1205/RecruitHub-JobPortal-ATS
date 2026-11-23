import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';

export default ({ children, breadcrumbs, ...props }) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
