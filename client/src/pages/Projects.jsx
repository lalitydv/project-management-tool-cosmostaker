/*  src/pages/Projects.jsx  */
import React, { useState, useMemo } from 'react';
import {
  PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------------ */
/*  PALETTE                                                                 */
/* ------------------------------------------------------------------------ */
const colors = {
  primary:   '#eb3b88',
  secondary: '#523d97',
  yellow:    '#FECB19',
};

/* ------------------------------------------------------------------------ */
/*  MOCK AUTH / PEOPLE                                                      */
/* ------------------------------------------------------------------------ */
const currentUser = 'John Smith';            // fake “logged-in” user
const allPeople   = [
  'John Smith', 'Emma Brown', 'Noah Lee', 'Ava Patel',
  'Oliver Khan', 'Mia Gupta', 'Liam Zhou', 'Sophia Rao',
];

/* ------------------------------------------------------------------------ */
/*  EMPTY PROJECT TEMPLATE                                                  */
/* ------------------------------------------------------------------------ */
const emptyProject = {
  id: null,
  name: '',
  description: '',
  owner: currentUser,
  team: [],
};

/* ------------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                          */
/* ------------------------------------------------------------------------ */
export default function Projects() {
  /* ────────────────────────── state ──────────────────────────────────── */
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Full revamp of marketing site.',
      owner: 'John Smith',
      team: ['John Smith', 'Emma Brown', 'Noah Lee'],
    },
    {
      id: 2,
      name: 'Mobile App MVP',
      description: 'Build iOS + Android proof-of-concept.',
      owner: 'Emma Brown',
      team: ['Emma Brown', 'Ava Patel'],
    },
  ]);

  const [query,      setQuery]      = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [formData,   setFormData]   = useState(emptyProject);
  const [isEditing,  setIsEditing]  = useState(false);

  /* ────────────────────────── derived filtered list ──────────────────── */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(p =>
      [p.name, p.description, p.owner, p.team.join(' ')].some(str =>
        str.toLowerCase().includes(q)
      )
    );
  }, [projects, query]);

  /* ────────────────────────── handlers ───────────────────────────────── */
  const openNew  = () => { setFormData(emptyProject); setIsEditing(false); setModalOpen(true); };
  const openEdit = p   => { setFormData(p);           setIsEditing(true);  setModalOpen(true); };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleMember = name =>
    setFormData(prev => ({
      ...prev,
      team: prev.team.includes(name)
        ? prev.team.filter(n => n !== name)
        : [...prev.team, name],
    }));

  const saveProject = () => {
    const clean = { ...formData, name: formData.name.trim() };
    if (clean.name === '') return;       // simple guard
    if (isEditing) {
      setProjects(ps => ps.map(p => (p.id === clean.id ? clean : p)));
    } else {
      setProjects(ps => [...ps, { ...clean, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const deleteProject = id =>
    setProjects(ps => ps.filter(p => p.id !== id));

  /* ────────────────────────── animations helpers ─────────────────────── */
  const rowVariants = {
    hidden:  { opacity: 0, y: -6 },
    show:    { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: 6 },
  };

  /* ────────────────────────── UI ─────────────────────────────────────── */
  return (
    <div className="p-6">
      {/* --- header row --------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: colors.primary }}>
          All Projects
        </h1>

        {/* search bar */}
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            style={{ '--ring': colors.primary }}
          />
        </div>

        {/* new project button */}
        <button
          onClick={openNew}
          className="flex items-center gap-1 px-4 py-2 text-sm rounded-full text-white shadow"
          style={{ background: colors.secondary }}
        >
          <PlusIcon className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* --- table -------------------------------------------------------- */}
      <div className="overflow-x-auto rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-sm ">
          <thead>
            <tr style={{ background: colors.secondary }} className="text-left text-white">
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Description</th>
              <th className="py-3 px-4 font-medium">Owner</th>
              <th className="py-3 px-4 font-medium">Team</th>
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <AnimatePresence component={motion.tbody}>
            {filtered.map(p => (
              <motion.tr
                key={p.id}
                variants={rowVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="py-2.5 px-4">{p.name}</td>
                <td className="py-2.5 px-4">{p.description}</td>
                <td className="py-2.5 px-4">{p.owner}</td>
                <td className="py-2.5 px-4">{p.team.join(', ')}</td>
                <td className="py-2.5 px-4 text-center space-x-2">
                  <button
                    onClick={() => openEdit(p)}
                    disabled={p.owner !== currentUser}
                    title={p.owner !== currentUser ? 'Only owner can edit' : 'Edit'}
                    className="inline-flex disabled:opacity-30"
                  >
                    <PencilSquareIcon className="h-5 w-5" style={{ color: colors.primary }} />
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    disabled={p.owner !== currentUser}
                    title={p.owner !== currentUser ? 'Only owner can delete' : 'Delete'}
                    className="inline-flex disabled:opacity-30"
                  >
                    <TrashIcon className="h-5 w-5 text-red-600" />
                  </button>
                </td>
              </motion.tr>
            ))}

            {filtered.length === 0 && (
              <motion.tr
                key="empty"
                variants={rowVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No matching projects.
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </table>
      </div>

      {/* --- modal -------------------------------------------------------- */}  
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6"
          >
            {/* modal header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold" style={{ color: colors.secondary }}>
                {isEditing ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => setModalOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {/* form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-medium">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': colors.primary }}
                  placeholder="Project name"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': colors.primary }}
                  placeholder="Short description"
                />
              </div>

              {/* team selection */}
              <div>
                <label className="block text-sm mb-1 font-medium">Team Members</label>
                <div className="flex flex-wrap gap-2">
                  {allPeople.map(person => (
                    <button
                      key={person}
                      type="button"
                      onClick={() => toggleMember(person)}
                      className={`px-3 py-1 rounded-full text-xs border
                        ${formData.team.includes(person)
                          ? 'bg-[var(--col-primary)] text-white border-[var(--col-primary)]'
                          : 'hover:bg-gray-100'}`}
                      style={{ '--col-primary': colors.primary }}
                    >
                      {person}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* modal footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveProject}
                className="px-4 py-2 rounded text-white"
                style={{ background: colors.primary }}
              >
                {isEditing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
