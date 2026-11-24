import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Edit3, Filter, MapPin } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { Can } from '@/components/Auth/Can';

import AppSidebarLayout from '@/layouts/app-sidebar-layout';

export default function LocationsIndex({ locations }) {
    const {
        user: currentUser,
        hasAnyPermission,
    } = useAuth();

    const isAdmin = hasAnyPermission(['dashboard.admin']);
    const canManageLocations = hasAnyPermission(['locations.manage', 'locations.create', 'locations.update', 'locations.destroy']);

    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState('');

    if (!canManageLocations && !isAdmin) {
        return (
            <AppSidebarLayout>
                <Head title="Access Denied" />
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-red-500">🚫</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Access Denied</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">You don't have permission to manage locations.</p>
                    </div>
                </div>
            </AppSidebarLayout>
        );
    }

    const handleCreate = (e) => {
        e.preventDefault();
        router.post(route('locations.store'), {
            name: newName,
            address: newAddress,
            is_active: true,
        }, {
            onSuccess: () => {
                setShowModal(false);
                setNewName('');
                setNewAddress('');
                router.reload();
            },
            onError: () => {
                alert('Failed to create location.');
            },
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this location?')) return;
        router.delete(route('locations.destroy', id), {
            onSuccess: () => {
                router.reload();
            },
            onError: () => {
                alert('Failed to delete location.');
            },
        });
    };

    return (
        <AppSidebarLayout>
            <div className="min-h-screen bg-gray-50 p-6 md:p-8 max-w-5xl mx-auto">
                <Head title="Locations" />

                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
                        <p className="text-gray-600 text-sm">Manage job locations</p>
                    </div>
                    <Can permission="locations.create">
                        <button
                            onClick={() => {
                                setNewName('');
                                setNewAddress('');
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={16} /> Add Location
                        </button>
                    </Can>
                </div>

                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Filter size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search locations..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Address</th>
                                <th className="px-6 py-4 text-center">Jobs</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {locations.data?.map((loc) => (
                                <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{loc.name}</td>
                                    <td className="px-6 py-4 text-gray-600 text-xs">{loc.address || 'N/A'}</td>
                                    <td className="px-6 py-4 text-center text-gray-600">{loc.job_count || 0}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${loc.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                            {loc.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route('locations.edit', loc.id)}
                                                className="text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                <Edit3 size={16} />
                                            </Link>
                                            <Can permission="locations.destroy">
                                                <button
                                                    onClick={() => handleDelete(loc.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </Can>
                                        </div>
                                    </td>
                                </tr>
                            )) || (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No locations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Showing {locations.data?.length || 0} of {locations.total || 0} locations
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: locations.last_page || 1 }, (_, i) => i + 1).map((page) => (
                            <a
                                key={page}
                                href={route('locations.index', { page })}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                    locations.current_page === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                                }`}
                            >
                                {page}
                            </a>
                        ))}
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Location</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        required
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        name="address"
                                        type="text"
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
