import React, { useState } from "react";

const TASK_STATUSES = ["Todo", "In Progress", "Completed"];

const initialProjects = [
  {
    id: 1,
    name: "Project Alpha",
    tasks: [
      { id: 1, title: "Setup repo", status: "Todo", assignedTo: "Alice" },
      { id: 2, title: "Design UI", status: "In Progress", assignedTo: "Bob" },
    ],
    team: ["Alice", "Bob", "Charlie"],
  },
  {
    id: 2,
    name: "Project Beta",
    tasks: [],
    team: ["David", "Eve"],
  },
];

const Tasks = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskUser, setNewTaskUser] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState(TASK_STATUSES[0]);

  // Get selected project object
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Add new task handler
  const addTask = () => {
    if (!newTaskTitle || !newTaskUser) return alert("Fill all task fields");

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      status: newTaskStatus,
      assignedTo: newTaskUser,
    };

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === selectedProjectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      )
    );

    // Clear input fields
    setNewTaskTitle("");
    setNewTaskUser("");
    setNewTaskStatus(TASK_STATUSES[0]);
  };

  // Change task status
  const changeTaskStatus = (taskId, status) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, status } : task
              ),
            }
          : project
      )
    );
  };

  // Remove user from project
  const removeUser = (user) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,
              team: project.team.filter((member) => member !== user),
              tasks: project.tasks.filter((task) => task.assignedTo !== user),
            }
          : project
      )
    );
  };

  return (  
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20, margin: "auto" }}>
      <h1 style={{ color: "#4A90E2" }}>Task Management & Team Collaboration</h1>

      {/* Project Selector */}
      <div style={{ marginBottom: 20 }}>
        <label>
          Select Project:{" "}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            style={{ padding: "5px 10px", fontSize: 16 }}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Task Management Section */}
      <section
        style={{
          backgroundColor: "#f0f8ff",
          padding: 20,
          borderRadius: 8,
          marginBottom: 30,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#0077b6" }}>Task Management</h2>

        {/* Add Task */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ padding: 8, marginRight: 10, width: 200 }}
          />
          <select
            value={newTaskUser}
            onChange={(e) => setNewTaskUser(e.target.value)}
            style={{ padding: 8, marginRight: 10 }}
          >
            <option value="">Assign to</option>
            {selectedProject.team.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <select
            value={newTaskStatus}
            onChange={(e) => setNewTaskStatus(e.target.value)}
            style={{ padding: 8, marginRight: 10 }}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={addTask}
            style={{
              padding: "8px 15px",
              backgroundColor: "#0077b6",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        <div>
          {selectedProject.tasks.length === 0 ? (
            <p>No tasks for this project yet.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#90e0ef" }}>
                  <th style={{ padding: 10 }}>Title</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedProject.tasks.map((task) => (
                  <tr key={task.id} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={{ padding: 10 }}>{task.title}</td>
                    <td>{task.assignedTo}</td>
                    <td
                      style={{
                        color:
                          task.status === "Completed"
                            ? "green"
                            : task.status === "In Progress"
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {task.status}
                    </td>
                    <td>
                      <select
                        value={task.status}
                        onChange={(e) => changeTaskStatus(task.id, e.target.value)}
                      >
                        {TASK_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Team Collaboration Section */}
      <section
        style={{
          backgroundColor: "#e6f2ff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#0077b6" }}>Team Collaboration</h2>

        {/* Team Members List */}
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {selectedProject.team.length === 0 ? (
            <p>No team members assigned to this project.</p>
          ) : (
            selectedProject.team.map((member) => (
              <li
                key={member}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#cce4ff",
                  padding: "6px 12px",
                  borderRadius: 4,
                }}
              >
                <span>{member}</span>
                <button
                  onClick={() => removeUser(member)}
                  style={{
                    backgroundColor: "#d00000",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    padding: "3px 8px",
                  }}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Tasks Assigned Per Member */}
        <h3 style={{ marginTop: 20 }}>Tasks Per Team Member</h3>
        {selectedProject.team.length === 0 ? (
          <p>No team members to display tasks for.</p>
        ) : (
          selectedProject.team.map((member) => {
            const memberTasks = selectedProject.tasks.filter(
              (task) => task.assignedTo === member
            );
            return (
              <div key={member} style={{ marginBottom: 15 }}>
                <strong>{member}</strong>
                {memberTasks.length === 0 ? (
                  <p style={{ fontStyle: "italic", marginLeft: 15 }}>No tasks assigned</p>
                ) : (
                  <ul style={{ marginLeft: 15 }}>
                    {memberTasks.map((task) => (
                      <li key={task.id}>
                        {task.title} -{" "}
                        <span
                          style={{
                            color:
                              task.status === "Completed"
                                ? "green"
                                : task.status === "In Progress"
                                ? "orange"
                                : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {task.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default Tasks;
