import { XCircle } from 'lucide-react';

interface InputErrorProps {
    message?: string;
    className?: string;
}

export default function InputError({ message, className = '' }: InputErrorProps) {
    if (!message) return null;

    return (
        <p className={`mt-0.5 flex items-center gap-1.5 text-xs text-red-500 animate-in slide-in-from-top-1 duration-200 ${className}`}>
            <XCircle className="h-3 w-3 shrink-0" />
            {message}
        </p>
    );
}