import { Link } from '@inertiajs/react';

interface TextLinkProps extends React.ComponentProps<typeof Link> {
    children: React.ReactNode;
}

export default function TextLink({ children, className = '', ...props }: TextLinkProps) {
    return (
        <Link
            className={`underline underline-offset-2 hover:no-underline transition-colors ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
}