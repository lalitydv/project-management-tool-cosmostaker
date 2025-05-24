import React, { useEffect, useState, useMemo } from 'react';
import {
  PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios'; // your axios setup with token

const colors = {
  primary: '#eb3b88',
  secondary: '#523d97',
  yellow: '#FECB19',
};

const currentUser = JSON.parse(localStorage.getItem('user'))?.name || 'John Smith';

const emptyProject = {
  _id: null,
  name: '',
  description: '',
  teamMembers: [],
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyProject);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter(p =>
      [p.name, p.description, p.owner?.name].some(field =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [query, projects]);

  const openNew = () => {
    setFormData(emptyProject);
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setFormData({ ...project, _id: project._id });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProject = async () => {
    try {
      if (isEditing) {
        await API.put(`/projects/${formData._id}`, {
          name: formData.name,
          description: formData.description,
          teamMembers: formData.teamMembers
        });
      } else {
        await API.post('/projects', {
          name: formData.name,
          description: formData.description,
          teamMembers: formData.teamMembers
        });
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: colors.primary }}>
          All Projects
        </h1>

        <div className="relative w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:ring-2"
            style={{ '--tw-ring-color': colors.primary }}
          />
        </div>

        <button
          onClick={openNew}
          className="px-4 py-2 text-sm rounded-full text-white shadow"
          style={{ background: colors.secondary }}
        >
          <PlusIcon className="h-4 w-4 inline-block mr-1" />
          New Project
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-white" style={{ background: colors.secondary }}>
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Description</th>
              <th className="py-3 px-4 font-medium">Owner</th>
              <th className="py-3 px-4 font-medium">Team</th>
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-2.5 px-4">{p.name}</td>
                  <td className="py-2.5 px-4">{p.description}</td>
                  <td className="py-2.5 px-4">{p.owner?.name}</td>
                  <td className="py-2.5 px-4">{p.teamMembers.length} Members</td>
                  <td className="py-2.5 px-4 text-center space-x-2">
                    <button onClick={() => openEdit(p)}>
                      <PencilSquareIcon className="h-5 w-5 text-blue-500" />
                    </button>
                    <button onClick={() => deleteProject(p._id)}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold" style={{ color: colors.secondary }}>
                {isEditing ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded"
            />

            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 border rounded"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={saveProject}
                className="px-4 py-2 text-white rounded"
                style={{ background: colors.primary }}
              >
                {isEditing ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
