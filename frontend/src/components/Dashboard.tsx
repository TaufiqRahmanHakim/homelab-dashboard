import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Server, RefreshCw, Layers, AlertCircle, Inbox } from 'lucide-react';
import { Application, CreateApplicationRequest } from '../types';
import { api } from '../utils/api';
import { MetricsDisplay } from './MetricsDisplay';
import { AppCard } from './AppCard';
import { AppForm } from './AppForm';

export function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      const data = await api.getApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleCreate = async (data: CreateApplicationRequest) => {
    try {
      await api.createApplication(data);
      setShowForm(false);
      fetchApplications();
    } catch (err) {
      alert('Failed to create application');
      console.error(err);
    }
  };

  const handleUpdate = async (data: CreateApplicationRequest) => {
    if (!editingApp) return;
    try {
      await api.updateApplication(editingApp.id, data);
      setEditingApp(null);
      setShowForm(false);
      fetchApplications();
    } catch (err) {
      alert('Failed to update application');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteApplication(id);
      fetchApplications();
    } catch (err) {
      alert('Failed to delete application');
      console.error(err);
    }
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingApp(null);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background elements */}
      <div className="animated-gradient-bg" />
      <div className="overlay-grid" />
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      {/* Main Content */}
      <div>
        {/* Top Navigation */}
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Logo and Title */}
              <motion.div
                className="flex items-center gap-4"
                whileHover={{ scale: 1.01 }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #ec4899 50%, #8b5cf6 100%)',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <Server size={24} color="white" />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, white, #e9d5ff, #c7d2fe)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0,
                  }}>
                    Homelab Dashboard
                  </h1>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0 0' }}>
                    Manage your self-hosted services
                  </p>
                </div>
              </motion.div>

              {/* Add Application Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="btn-gradient"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'white',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Plus size={18} />
                <span>Add Application</span>
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Main Content Area */}
        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
          {/* Metrics Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              marginBottom: '32px',
              padding: '24px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <MetricsDisplay />
          </motion.div>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '96px 24px',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <RefreshCw size={40} color="#a78bfa" />
                </motion.div>
                <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                  Loading your applications...
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  background: 'rgba(239, 68, 68, 0.1)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  padding: '12px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  background: 'rgba(239, 68, 68, 0.2)',
                }}>
                  <AlertCircle size={32} color="#f87171" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fca5a5', marginBottom: '8px' }}>
                  Oops! Something went wrong
                </h3>
                <p style={{ color: 'rgba(248, 113, 113, 0.7)', marginBottom: '24px' }}>{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchApplications}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    fontWeight: 500,
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}

            {!loading && !error && applications.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  borderRadius: '16px',
                  padding: '64px 32px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{
                    display: 'inline-flex',
                    padding: '20px',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <Inbox size={48} color="#a78bfa" />
                </motion.div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
                  No applications yet
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
                  Get started by adding your first self-hosted application to your homelab dashboard. Track all your services in one place.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="btn-gradient"
                  style={{
                    padding: '14px 32px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    color: 'white',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  }}
                >
                  Add Your First App
                </motion.button>
              </motion.div>
            )}

            {!loading && applications.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px',
                }}
              >
                {applications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <AppCard
                      app={app}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <AppForm
            app={editingApp}
            onSubmit={editingApp ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
