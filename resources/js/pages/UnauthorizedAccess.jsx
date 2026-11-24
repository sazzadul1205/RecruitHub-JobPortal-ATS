import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedAccess() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <Head title="Access Denied" />

            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <ShieldAlert size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page.
                </p>

                <Link
                    href={route('dashboard')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
