import React, { useState, useRef } from "react";
import { Upload, Plus, Download, Clock, CheckCircle, X, AlertCircle, Copy, Eye, Filter, Search } from "lucide-react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

export const ClientDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [activeSection, setActiveSection] = useState<"overview" | "upload" | "tasks" | "history">("overview");

  const stats = [
    { label: "Active Tasks", value: "12", change: "+3 this week", color: "text-[#00FFB2]" },
    { label: "Total Labels", value: "45,230", change: "+2,341 today", color: "text-[#9B5DE5]" },
    { label: "Escrow Balance", value: "892.4 ICP", change: "Available", color: "text-blue-500" },
    { label: "Completion Rate", value: "94.2%", change: "+1.3% avg", color: "text-green-500" },
  ];

  const tasks = [
    {
      id: 1,
      name: "Bitcoin Transaction Classification",
      type: "BTC Analysis",
      progress: 75,
      status: "In Progress",
      escrow: "125.0 ICP",
      labels: "1,250 / 1,667",
      created: "2 days ago",
      hash: "0xab12...cd34",
      labelers: 8,
      avgAccuracy: 96.2,
    },
    {
      id: 2,
      name: "Smart Contract Risk Assessment",
      type: "Contract Risk",
      progress: 100,
      status: "Completed",
      escrow: "200.0 ICP",
      labels: "2,000 / 2,000",
      created: "1 week ago",
      hash: "0x56ef...gh78",
      labelers: 12,
      avgAccuracy: 98.1,
    },
    {
      id: 3,
      name: "Scam Detection Dataset",
      type: "Scam Detection",
      progress: 45,
      status: "In Progress",
      escrow: "300.0 ICP",
      labels: "900 / 2,000",
      created: "3 days ago",
      hash: "0x9ijk...lm90",
      labelers: 15,
      avgAccuracy: 94.8,
    },
  ];

  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    taskName: "",
    taskType: "BTC Transaction Analysis",
    rewardPerLabel: "",
    qualityThreshold: "High (95%+)",
    labelingInstructions: "",
    description: "",
    totalItems: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFileUpload = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredTasks = showTasks?.filter((task) => {
    if (!searchTerm) return true;

    const lowerSearch = searchTerm.toLowerCase();
    return task.name.toLowerCase().includes(lowerSearch) || task.taskType.toLowerCase().includes(lowerSearch) || task.description.toLowerCase().includes(lowerSearch) || task.id.toString().includes(lowerSearch);
  });

  const handleCreateTask = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!authState.isAuthenticated || !authState.user) {
      alert("Please login first");
      return;
    }

    if (authState.user.role !== "client") {
      alert("Only clients can create labeling tasks");
      return;
    }

    if (!formData.taskName.trim()) {
      alert("Task Name is required");
      return;
    }

    if (!formData.rewardPerLabel) {
      alert("Reward per Label is required");
      return;
    }

    if (!selectedFile) {
      alert("Please upload a dataset first");
      return;
    }

    const taskData = {
      taskName: formData.taskName,
      taskType: formData.taskType,
      rewardPerLabel: Math.round(parseFloat(formData.rewardPerLabel) * 100000000),
      qualityThreshold: formData.qualityThreshold,
      labelingInstructions: formData.labelingInstructions,
      description: formData.description,
      creatorPrincipal: authState.user.principal,
      creatorRole: authState.user.role,
      totalItems: formData.totalItems,
      dataset: {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      },
    };

    // TODO: Call API to create task
    // try {
    //   const makeATask = await main_canister.makeTask(taskData.taskName, taskData.taskType, taskData.description, taskData.qualityThreshold, taskData.totalItems, taskData.rewardPerLabel, taskData.dataset);
    //   console.log("Task created:", taskData, makeATask);
    //   console.log("Dataset:", selectedFile.name);
    //   console.log("Creator principal:", authState.user.principal);
    //   alert("Task created successfully!");
    // } catch (error) {
    //   console.error("Error creating task:", error);
    // }

    setFormData({
      taskName: "",
      taskType: "BTC Transaction Analysis",
      rewardPerLabel: "",
      qualityThreshold: "High (95%+)",
      labelingInstructions: "",
      description: "",
      totalItems: 0,
    });

    resetFileUpload();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    if (e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadResults = async () => {
    alert("Download functionality will be implemented soon");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = [".csv", ".json"];
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(extension)) {
      alert("Only CSV or JSON files are allowed");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("File size exceeds 100MB limit");
      return;
    }

    setSelectedFile(file);
  };

  return (
    <Layout title="Client Dashboard" subtitle="Manage your data labeling projects">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#F2F2F2] p-1 rounded-2xl">
          {[
            { id: "overview", label: "Overview", icon: Eye },
            { id: "upload", label: "Upload Dataset", icon: Upload },
            { id: "tasks", label: "Active Tasks", icon: Clock },
            { id: "history", label: "Job History", icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as "overview" | "upload" | "tasks" | "history")}
                className={`flex items-center px-3 md:px-4 py-2 rounded-xl transition-all duration-200 text-sm md:text-base ${activeSection === tab.id ? "bg-white shadow-sm text-[#0A0E2A]" : "text-gray-600 hover:text-[#0A0E2A]"}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm text-gray-500">{stat.label}</span>
                  </div>
                  <div className={`text-lg md:text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-[#0A0E2A] mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button onClick={() => setActiveSection("upload")} className="w-full flex items-center justify-between p-4 bg-[#00FFB2]/10 hover:bg-[#00FFB2]/20 rounded-xl transition-colors">
                    <div className="flex items-center space-x-3">
                      <Upload className="w-5 h-5 text-[#00FFB2]" />
                      <span className="font-medium text-[#0A0E2A]">Upload New Dataset</span>
                    </div>
                    <Plus className="w-4 h-4 text-[#00FFB2]" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-[#9B5DE5]/10 hover:bg-[#9B5DE5]/20 rounded-xl transition-colors">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-[#9B5DE5]" />
                      <span className="font-medium text-[#0A0E2A]">Download Results</span>
                    </div>
                    <span className="text-xs bg-[#9B5DE5] text-white px-2 py-1 rounded-full">2 Ready</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-[#0A0E2A] mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-sm font-medium">Task Completed</div>
                        <div className="text-xs text-gray-500">Smart Contract Analysis</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">Progress Update</div>
                        <div className="text-xs text-gray-500">BTC Analysis 75% complete</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">4h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {activeSection === "upload" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-[#0A0E2A] mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
                Upload Dataset
              </h2>
              <div
                className={`border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#00FFB2] transition-colors ${isDragging ? "border-[#00FFB2] bg-[#00FFB2]/10" : "border-gray-300 hover:border-[#00FFB2]"}`}
                onClick={handleButtonClick}
                onDragEnter={handleDragIn}
                onDragOver={handleDrag}
                onDragLeave={handleDragOut}
                onDrop={handleDrop}
              >
                <input type="file" className="hidden" accept=".csv, .json" onChange={handleFileChange} ref={fileInputRef} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {selectedFile ? (
                  <>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      File selected: <span className="text-[#00FFB2]">{selectedFile.name}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-700 mb-2">Drag and drop your dataset here</p>
                    <p className="text-sm text-gray-500 mb-4">Supports CSV, JSON formats up to 100MB</p>
                  </>
                )}
                {/* upload CSV */}
                <button
                  className="bg-[#00FFB2] text-[#0A0E2A] px-6 py-2 rounded-xl font-medium hover:bg-[#00FFB2]/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick();
                  }}
                >
                  {selectedFile ? "Change File" : "Choose File"}
                </button>
                {selectedFile && (
                  <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center gap-2" onClick={handleCancel}>
                    <X size={18} /> Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-[#0A0E2A] mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
                Create Labeling Task
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                  <input
                    type="text"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                    placeholder="Enter task name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                  <select name="taskType" value={formData.taskType} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent">
                    <option>BTC Transaction Analysis</option>
                    <option>Smart Contract Risk</option>
                    <option>Scam Detection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reward per Label (ICP)</label>
                  <input
                    type="number"
                    name="rewardPerLabel"
                    value={formData.rewardPerLabel}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                    placeholder="0.1"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality Threshold</label>
                  <select
                    name="qualityThreshold"
                    value={formData.qualityThreshold}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent"
                  >
                    <option>High (95%+)</option>
                    <option>Medium (85%+)</option>
                    <option>Standard (75%+)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Labeling Instructions</label>
                <textarea
                  name="labelingInstructions"
                  value={formData.labelingInstructions}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent h-32"
                  placeholder="Provide detailed instructions for labelers..."
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button className="bg-[#9B5DE5] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#9B5DE5]/90 transition-colors" onClick={handleCreateTask}>
                  Create Task & Deploy Escrow
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {activeSection === "tasks" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-[#0A0E2A]" style={{ fontFamily: "Sora, sans-serif" }}>
                Active Tasks
              </h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00FFB2] focus:border-transparent text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0E2A]" style={{ fontFamily: "Sora, sans-serif" }}>
                      {task.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>{task.type}</span>
                      <span>•</span>
                      <span>{task.created}</span>
                      <span>•</span>
                      <span>{task.labelers} labelers</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{task.status}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-xl">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Progress</div>
                    <div className="text-sm font-medium text-[#0A0E2A]">{task.progress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-[#00FFB2] h-2 rounded-full transition-all duration-300" style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Labels</div>
                    <div className="text-sm font-medium text-[#0A0E2A]">{task.labels}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Escrow</div>
                    <div className="text-sm font-medium text-[#9B5DE5]">{task.escrow}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Avg Accuracy</div>
                    <div className="text-sm font-medium text-[#00FFB2]">{task.avgAccuracy}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Contract Hash</div>
                    <div className="flex items-center">
                      <span className="text-xs font-mono text-[#0A0E2A] mr-2">{task.hash}</span>
                      <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-[#00FFB2]" />
                    </div>
                  </div>
                </div>

                {task.status === "Completed" && (
                  <div className="flex justify-end">
                    <button className="flex items-center bg-[#00FFB2] text-[#0A0E2A] px-4 py-2 rounded-xl font-medium hover:bg-[#00FFB2]/90 transition-colors" onClick={() => handleDownloadResults(task.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Results
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* History Section */}
        {activeSection === "history" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#0A0E2A]" style={{ fontFamily: "Sora, sans-serif" }}>
                Job History
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labels</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks
                    .concat([
                      {
                        id: 4,
                        name: "DeFi Protocol Analysis",
                        type: "DeFi Risk",
                        progress: 100,
                        status: "Completed",
                        escrow: "450.0 ICP",
                        labels: "3,000 / 3,000",
                        created: "2 weeks ago",
                        hash: "0xno34...pq56",
                        labelers: 20,
                        avgAccuracy: 97.5,
                      },
                    ])
                    .map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#0A0E2A]">{task.name}</div>
                          <div className="text-sm text-gray-500">{task.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{task.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.labels}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9B5DE5] font-medium">{task.escrow}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.created}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-[#00FFB2] hover:text-[#00FFB2]/80 font-medium">View Details</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Floating Action Button */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <button onClick={() => setActiveSection("upload")} className="w-14 h-14 bg-[#00FFB2] text-[#0A0E2A] rounded-full shadow-lg flex items-center justify-center hover:bg-[#00FFB2]/90 transition-colors">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Layout>
  );
};
