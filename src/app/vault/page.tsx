'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import PasswordGenerator from '@/components/PasswordGenerator';
import { encryptVaultItem, decryptVaultItem, VaultItemData } from '@/lib/crypto';

interface VaultItem {
  _id: string;
  encryptedData: string;
  salt: string;
  createdAt: string;
}

interface DecryptedItem extends VaultItemData {
  _id: string;
}

export default function VaultPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<DecryptedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DecryptedItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [copyMessage, setCopyMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState<VaultItemData>({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  });

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  const fetchItems = async () => {
    if (!token || !masterPassword) return;

    try {
      const response = await fetch('/api/vault', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch items');

      const data = await response.json();
      
      // Decrypt all items
      const decrypted = data.items.map((item: VaultItem) => {
        try {
          const decryptedData = decryptVaultItem(
            item.encryptedData,
            item.salt,
            masterPassword
          );
          return { ...decryptedData, _id: item._id };
        } catch (error) {
          console.error('Failed to decrypt item:', error);
          return null;
        }
      }).filter(Boolean);

      setItems(decrypted);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  const handleUnlock = () => {
    if (masterPassword.length >= 8) {
      setShowPasswordPrompt(false);
      fetchItems();
    } else {
      alert('Master password must be at least 8 characters');
    }
  };

  const handleSave = async () => {
    if (!token || !masterPassword) return;

    if (!formData.title || !formData.password) {
      alert('Title and password are required');
      return;
    }

    try {
      const { encrypted, salt } = encryptVaultItem(formData, masterPassword);

      const url = editingItem ? `/api/vault/${editingItem._id}` : '/api/vault';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ encryptedData: encrypted, salt }),
      });

      if (!response.ok) throw new Error('Failed to save item');

      setShowAddModal(false);
      setEditingItem(null);
      setFormData({ title: '', username: '', password: '', url: '', notes: '' });
      fetchItems();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;

    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete');

      fetchItems();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item: DecryptedItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      username: item.username,
      password: item.password,
      url: item.url,
      notes: item.notes,
    });
    setShowAddModal(true);
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    setCopyMessage('Copied! Will clear in 15 seconds.');
    
    // Auto-clear after 15 seconds
    setTimeout(() => {
      navigator.clipboard.writeText('');
      setCopyMessage('');
    }, 15000);
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🔐 Enter Master Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This password encrypts and decrypts your vault items. Use the same password you use to login.
          </p>
          <input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            placeholder="Master password (min 8 characters)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
          />
          <button
            onClick={handleUnlock}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Unlock Vault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔐 Password Vault
          </h1>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Copy Message */}
        {copyMessage && (
          <div className="mb-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
            {copyMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Password Generator */}
          <div className="lg:col-span-1">
            <PasswordGenerator
              onPasswordGenerated={(pwd) =>
                setFormData({ ...formData, password: pwd })
              }
            />
          </div>

          {/* Vault Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Vault ({filteredItems.length})
                </h2>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({ title: '', username: '', password: '', url: '', notes: '' });
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                >
                  + Add Item
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, username, or URL..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />

              {/* Items List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {searchQuery ? 'No items match your search.' : 'No items yet. Add your first password!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          {item.username && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              👤 {item.username}
                            </p>
                          )}
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              🔗 {item.url}
                            </a>
                          )}
                          {item.notes && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              📝 {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => copyPassword(item.password)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                            title="Copy password"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                            title="Edit item"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                            title="Delete item"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingItem ? '✏️ Edit Item' : '➕ Add New Item'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Gmail, Facebook, Work Email"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username / Email
                </label>
                <input
                  type="text"
                  placeholder="username or email"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password *
                </label>
                <input
                  type="text"
                  placeholder="Use generator or type password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  placeholder="Additional information..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                {editingItem ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}