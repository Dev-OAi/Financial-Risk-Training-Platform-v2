/**
 * @file RightSidebar.tsx
 * @description Risk & Compliance Audit Log right sidebar drawer displaying real-time risk scores,
 * selected inspection hot-spots, 12-point forensic audit stages, and per-row add, edit, and delete functionality.
 */

import React, { useState } from 'react';
import { 
  X, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, FileText, 
  Lock, Sparkles, Cpu, Search, Plus, Trash2, Edit3, Copy, Check 
} from 'lucide-react';
import { DocumentTemplate, HotSpot, ThemeMode, AuditStage } from '../types';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate;
  selectedHotSpot: HotSpot | null;
  onSelectHotSpot: (spot: HotSpot) => void;
  themeMode: ThemeMode;
  isAiGenerating: boolean;
  onUpdateTemplate?: (template: DocumentTemplate) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  template,
  selectedHotSpot,
  onSelectHotSpot,
  themeMode,
  isAiGenerating,
  onUpdateTemplate,
}) => {
  // Hotspot Editing Modal State
  const [editingHotspot, setEditingHotspot] = useState<HotSpot | null>(null);
  const [isAddHotspotOpen, setIsAddHotspotOpen] = useState(false);
  const [hotspotForm, setHotspotForm] = useState<HotSpot>({
    id: '',
    title: '',
    titleDescription: '',
    riskLevel: 'low',
    detail: '',
    x: 50,
    y: 50
  });

  // Audit Stage Editing State
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [stageForm, setStageForm] = useState<AuditStage>({
    id: '',
    name: '',
    field: '',
    metric: '',
    status: 'verified',
    riskLevel: 'low'
  });
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);
  const [newStageForm, setNewStageForm] = useState<Omit<AuditStage, 'id'>>({
    name: '',
    field: '',
    metric: '',
    status: 'verified',
    riskLevel: 'low'
  });

  // Hotspot Handlers
  const handleStartEditHotspot = (spot: HotSpot, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHotspot(spot);
    setHotspotForm({ ...spot });
  };

  const handleSaveHotspot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateTemplate || !editingHotspot) return;

    const updatedHotspots = template.hotspots.map(h => 
      h.id === editingHotspot.id ? { ...hotspotForm, id: editingHotspot.id } : h
    );

    const updatedTemplate = {
      ...template,
      hotspots: updatedHotspots
    };
    onUpdateTemplate(updatedTemplate);
    setEditingHotspot(null);
  };

  const handleAddHotspotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateTemplate || !hotspotForm.title.trim()) return;

    const newSpot: HotSpot = {
      ...hotspotForm,
      id: `spot-${Date.now()}`
    };

    const updatedTemplate = {
      ...template,
      hotspots: [...template.hotspots, newSpot]
    };
    onUpdateTemplate(updatedTemplate);
    setIsAddHotspotOpen(false);
    onSelectHotSpot(newSpot);
  };

  const handleDeleteHotspot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateTemplate) return;

    const updatedHotspots = template.hotspots.filter(h => h.id !== id);
    const updatedTemplate = {
      ...template,
      hotspots: updatedHotspots
    };
    onUpdateTemplate(updatedTemplate);
    if (selectedHotSpot?.id === id && updatedHotspots.length > 0) {
      onSelectHotSpot(updatedHotspots[0]);
    }
  };

  const handleDuplicateHotspot = (spot: HotSpot, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateTemplate) return;

    const newSpot: HotSpot = {
      ...spot,
      id: `spot-dup-${Date.now()}`,
      title: `${spot.title} (Copy)`,
      x: Math.min(90, spot.x + 5),
      y: Math.min(90, spot.y + 5)
    };

    const updatedTemplate = {
      ...template,
      hotspots: [...template.hotspots, newSpot]
    };
    onUpdateTemplate(updatedTemplate);
    onSelectHotSpot(newSpot);
  };

  // Audit Stage Handlers
  const handleStartEditStage = (stage: AuditStage, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStageId(stage.id);
    setStageForm({ ...stage });
  };

  const handleSaveStage = (stageId: string) => {
    if (!onUpdateTemplate || !template.auditStages) return;

    const updatedStages = template.auditStages.map(s => 
      s.id === stageId ? { ...stageForm, id: stageId } : s
    );

    const updatedTemplate = {
      ...template,
      auditStages: updatedStages
    };
    onUpdateTemplate(updatedTemplate);
    setEditingStageId(null);
  };

  const handleDeleteStage = (stageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateTemplate || !template.auditStages) return;

    const updatedStages = template.auditStages.filter(s => s.id !== stageId);
    const updatedTemplate = {
      ...template,
      auditStages: updatedStages
    };
    onUpdateTemplate(updatedTemplate);
    if (editingStageId === stageId) setEditingStageId(null);
  };

  const handleDuplicateStage = (stage: AuditStage, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateTemplate || !template.auditStages) return;

    const newStage: AuditStage = {
      ...stage,
      id: `stage-${Date.now()}`,
      name: `${stage.name} (Copy)`
    };

    const updatedStages = [...template.auditStages, newStage];
    const updatedTemplate = {
      ...template,
      auditStages: updatedStages
    };
    onUpdateTemplate(updatedTemplate);
  };

  const handleAddStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateTemplate || !newStageForm.name.trim()) return;

    const newStage: AuditStage = {
      ...newStageForm,
      id: `stage-${Date.now()}`
    };

    const existing = template.auditStages || [];
    const updatedTemplate = {
      ...template,
      auditStages: [...existing, newStage]
    };
    onUpdateTemplate(updatedTemplate);
    setIsAddStageOpen(false);
    setNewStageForm({
      name: '',
      field: '',
      metric: '',
      status: 'verified',
      riskLevel: 'low'
    });
  };

  return (
    <>
      {/* Mobile / Tablet Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-35 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Right Sidebar Container */}
      <aside className={`absolute lg:relative right-0 top-0 bottom-0 z-40 h-full flex flex-col shrink-0 border-l transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none ${
        isOpen ? 'w-80 sm:w-96 xl:w-[23rem] translate-x-0 opacity-100' : 'w-0 translate-x-full lg:translate-x-0 opacity-0 pointer-events-none overflow-hidden border-l-0'
      } ${
        themeMode === 'dark' 
          ? 'bg-[#292a2d] border-[#3c4043] text-[#e8eaed]' 
          : 'bg-white border-[#dadce0] text-[#202124]'
      }`}>
        {/* Header */}
        <div className="p-3.5 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-xs uppercase tracking-wider text-inherit">Risk & Compliance Audit Log</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1  transition-colors ${themeMode === 'dark' ? 'hover:bg-[#3c4043] text-[#bdc1c6]' : 'hover:bg-[#f1f3f4] text-[#5f6368]'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* AI Generating Indicator */}
          {isAiGenerating && (
            <div className="p-3  bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs animate-pulse">
              <Cpu className="w-4 h-4 animate-spin shrink-0" />
              <span>Analyzing document risk variables & security marks...</span>
            </div>
          )}

          {/* Active Specimen Summary */}
          <div className={`p-3.5  border ${
            themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'
          }`}>
            <div className="text-[10px] font-bold text-[#bdc1c6] uppercase tracking-wider mb-1">Active Specimen</div>
            <h3 className="text-xs font-extrabold text-inherit mb-1">{template.title}</h3>
            <p className="text-[11px] text-[#bdc1c6] leading-relaxed font-medium mb-3">{template.summary}</p>
            
            <button
              onClick={() => (window as any).dispatchEvent(new CustomEvent('open-guilloche-magnifier'))}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2  bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs shadow transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Launch Guilloche & Micro-Print Magnifier</span>
            </button>
          </div>

          {/* Risk Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`p-3  border ${themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'}`}>
              <div className="text-[10px] font-bold text-[#bdc1c6] uppercase tracking-wider">Fraud Risk Score</div>
              <div className={`text-sm font-extrabold mt-1 ${template.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {template.riskScore} / 100
              </div>
            </div>
            <div className={`p-3  border ${themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'}`}>
              <div className="text-[10px] font-bold text-[#bdc1c6] uppercase tracking-wider">Neural Confidence</div>
              <div className="text-sm font-extrabold text-[#e8eaed] mt-1">{template.confidence}%</div>
            </div>
          </div>

          {/* Selected Hot-Spot Detail */}
          {selectedHotSpot && (
            <div className={`p-3.5  border ${
              selectedHotSpot.riskLevel === 'critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-200 font-medium' :
              selectedHotSpot.riskLevel === 'high' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200 font-medium' :
              'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-medium'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Selected Hot-Spot</span>
                <span className={`text-[9px] px-1.5 py-0.5  font-bold uppercase ${
                  selectedHotSpot.riskLevel === 'critical' ? 'bg-rose-800 text-white' :
                  selectedHotSpot.riskLevel === 'high' ? 'bg-amber-800 text-white' :
                  'bg-emerald-800 text-white'
                }`}>
                  {selectedHotSpot.riskLevel}
                </span>
              </div>
              <div className="text-xs font-extrabold text-inherit">{selectedHotSpot.titleDescription}</div>
              <p className="text-[11px] text-[#bdc1c6] mt-1 leading-relaxed">{selectedHotSpot.detail}</p>
            </div>
          )}

          {/* 12-Point Forensic Audit Section with Per-Row Add / Edit / Delete */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#bdc1c6] flex items-center gap-1.5">
                <span>Forensic Audit Stages</span>
                <span className="text-[10px] text-blue-400 font-mono">
                  ({(template.auditStages || []).length})
                </span>
              </h4>
              <button
                onClick={() => setIsAddStageOpen(true)}
                className={`p-1  border text-[10px] flex items-center gap-1 font-semibold transition ${
                  themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043] text-emerald-400 hover:bg-[#3c4043]' : 'bg-slate-100 border-slate-300 text-emerald-700 hover:bg-slate-200'
                }`}
                title="Add Audit Stage"
              >
                <Plus className="w-3 h-3" />
                <span>Add Stage</span>
              </button>
            </div>

            {(!template.auditStages || template.auditStages.length === 0) ? (
              <div className="p-3 text-center opacity-60 text-xs border ">
                No audit checkpoints defined. Click "Add Stage" above to manually enter cross-reference items.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {template.auditStages.map((stage) => {
                  const isEditing = editingStageId === stage.id;
                  const isFlagged = stage.status === 'flagged';
                  const isWarning = stage.status === 'warning';

                  if (isEditing) {
                    return (
                      <div key={stage.id} className="p-2.5  border border-blue-500 bg-blue-950/30 space-y-2">
                        <input
                          type="text"
                          value={stageForm.name}
                          onChange={(e) => setStageForm({ ...stageForm, name: e.target.value })}
                          placeholder="Stage name"
                          className="w-full px-2 py-1  bg-[#202124] border border-blue-500 text-xs text-white outline-none font-bold"
                        />
                        <input
                          type="text"
                          value={stageForm.metric}
                          onChange={(e) => setStageForm({ ...stageForm, metric: e.target.value })}
                          placeholder="Metric / verification criteria"
                          className="w-full px-2 py-1  bg-[#202124] border border-blue-500 text-xs text-slate-200 outline-none font-mono"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <select
                            value={stageForm.status}
                            onChange={(e) => setStageForm({ ...stageForm, status: e.target.value as any })}
                            className="px-2 py-1  bg-[#202124] border border-blue-500 text-xs text-white outline-none font-bold"
                          >
                            <option value="verified">Verified</option>
                            <option value="warning">Warning</option>
                            <option value="flagged">Flagged</option>
                          </select>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSaveStage(stage.id)}
                              className="p-1 bg-emerald-800 hover:bg-emerald-700 text-white "
                              title="Save Stage"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingStageId(null)}
                              className="p-1 bg-slate-600 hover:bg-slate-700 text-white "
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={stage.id}
                      className={`p-2  border text-xs flex items-center justify-between gap-2 group ${
                        isFlagged 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                          : isWarning 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                            : themeMode === 'dark' 
                              ? 'bg-[#292a2d] border-[#3c4043] text-slate-300' 
                              : 'bg-white border-[#dadce0] text-slate-700'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[11px] truncate">{stage.name}</span>
                          <span className={`text-[8px] px-1.5 py-0.2  font-bold uppercase shrink-0 ${
                            isFlagged ? 'bg-rose-800 text-white' : isWarning ? 'bg-amber-800 text-white' : 'bg-emerald-800 text-white'
                          }`}>
                            {stage.status}
                          </span>
                        </div>
                        <div className="text-[10px] opacity-75 mt-0.5 font-mono truncate">{stage.metric}</div>
                      </div>

                      {/* Per-Row Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleStartEditStage(stage, e)}
                          className="p-1  hover:bg-black/10 dark:hover:bg-white/10 text-blue-400"
                          title="Edit Stage"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDuplicateStage(stage, e)}
                          className="p-1  hover:bg-black/10 dark:hover:bg-white/10 text-emerald-400"
                          title="Duplicate Stage"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteStage(stage.id, e)}
                          className="p-1  hover:bg-black/10 dark:hover:bg-white/10 text-rose-400"
                          title="Delete Stage"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hot-Spot Inspection Markers List with Per-Row Add / Edit / Delete */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#bdc1c6] flex items-center gap-1.5">
                <span>Inspection Markers</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  ({template.hotspots.length})
                </span>
              </h4>
              <button
                onClick={() => {
                  setHotspotForm({
                    id: '',
                    title: 'New Inspection Marker',
                    titleDescription: 'Manual Security Verification',
                    riskLevel: 'low',
                    detail: 'Specimen feature cross-referenced against core specifications.',
                    x: 50,
                    y: 50
                  });
                  setIsAddHotspotOpen(true);
                }}
                className={`p-1  border text-[10px] flex items-center gap-1 font-semibold transition ${
                  themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043] text-emerald-400 hover:bg-[#3c4043]' : 'bg-slate-100 border-slate-300 text-emerald-700 hover:bg-slate-200'
                }`}
                title="Add New Hotspot Marker"
              >
                <Plus className="w-3 h-3" />
                <span>Add Marker</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {template.hotspots.map((spot, index) => {
                const isSelected = selectedHotSpot?.id === spot.id;
                return (
                  <div
                    key={spot.id}
                    className={`w-full text-left p-2.5  transition-all flex items-start gap-2 border group ${
                      isSelected 
                        ? themeMode === 'dark'
                          ? 'bg-[#3c4043] border-[#5f6368] text-[#e8eaed] shadow-xs'
                          : 'bg-[#e8eaed] border-[#dadce0] text-[#202124] shadow-xs font-semibold'
                        : themeMode === 'dark'
                          ? 'bg-[#292a2d] border-[#3c4043] hover:bg-[#323639] text-[#bdc1c6]'
                          : 'bg-white border-[#dadce0] hover:bg-[#f1f3f4] text-[#202124]'
                    }`}
                  >
                    <button
                      onClick={() => onSelectHotSpot(spot)}
                      className="flex-1 flex items-start gap-2 text-left min-w-0"
                    >
                      <span className={`flex items-center justify-center w-5 h-5 text-[10px] font-bold shrink-0 mt-0.5 ${
                        spot.riskLevel === 'critical' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                        spot.riskLevel === 'high' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-inherit truncate">{spot.title}</div>
                        <div className="text-[10px] text-[#bdc1c6] mt-0.5 truncate font-medium">{spot.titleDescription}</div>
                      </div>
                    </button>

                    {/* Per-Row Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        onClick={(e) => handleStartEditHotspot(spot, e)}
                        className="p-1  hover:bg-black/10 dark:hover:bg-white/10 text-blue-400"
                        title="Edit Hotspot Details"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDuplicateHotspot(spot, e)}
                        className="p-1  hover:bg-black/10 dark:hover:bg-white/10 text-emerald-400"
                        title="Duplicate Marker"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {template.hotspots.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteHotspot(spot.id, e)}
                          className="p-1  hover:bg-black/10 dark:hover:bg-white/10 text-rose-400"
                          title="Delete Marker"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-inherit text-center">
          <p className="text-[10px] font-bold text-[#bdc1c6] font-mono">
            Secure Audit Trail • Compliance Core
          </p>
        </div>
      </aside>

      {/* Edit / Add Hotspot Modal */}
      {(editingHotspot || isAddHotspotOpen) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-md  border p-5 shadow-2xl space-y-4 ${
            themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm">
                  {editingHotspot ? 'Edit Inspection Marker' : 'Add Inspection Marker'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setEditingHotspot(null);
                  setIsAddHotspotOpen(false);
                }} 
                className="p-1  hover:bg-black/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingHotspot ? handleSaveHotspot : handleAddHotspotSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Marker Title *
                </label>
                <input
                  type="text"
                  required
                  value={hotspotForm.title}
                  onChange={(e) => setHotspotForm({ ...hotspotForm, title: e.target.value })}
                  placeholder="e.g. Endorsement Stamp Analysis"
                  className={`w-full px-3 py-2  border text-xs outline-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={hotspotForm.titleDescription}
                  onChange={(e) => setHotspotForm({ ...hotspotForm, titleDescription: e.target.value })}
                  placeholder="e.g. Chemical Wash Discoloration Check"
                  className={`w-full px-3 py-2  border text-xs outline-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                    Risk Level
                  </label>
                  <select
                    value={hotspotForm.riskLevel}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, riskLevel: e.target.value as any })}
                    className={`w-full px-2 py-2  border text-xs outline-none font-bold ${
                      themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="low">Low (Pass)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                    X Pos (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={hotspotForm.x}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, x: Number(e.target.value) })}
                    className={`w-full px-2 py-2  border text-xs outline-none font-mono ${
                      themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                    Y Pos (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={hotspotForm.y}
                    onChange={(e) => setHotspotForm({ ...hotspotForm, y: Number(e.target.value) })}
                    className={`w-full px-2 py-2  border text-xs outline-none font-mono ${
                      themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Audit Findings & Forensic Detail
                </label>
                <textarea
                  rows={3}
                  value={hotspotForm.detail}
                  onChange={(e) => setHotspotForm({ ...hotspotForm, detail: e.target.value })}
                  placeholder="Detailed inspection findings..."
                  className={`w-full px-3 py-2  border text-xs outline-none resize-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => {
                    setEditingHotspot(null);
                    setIsAddHotspotOpen(false);
                  }}
                  className={`px-3.5 py-1.5  text-xs font-medium border ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5  bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold shadow-xs transition"
                >
                  Save Marker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stage Modal */}
      {isAddStageOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-md  border p-5 shadow-2xl space-y-4 ${
            themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm">Add Forensic Audit Stage</h3>
              </div>
              <button onClick={() => setIsAddStageOpen(false)} className="p-1  hover:bg-black/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStageSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Stage Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStageForm.name}
                  onChange={(e) => setNewStageForm({ ...newStageForm, name: e.target.value })}
                  placeholder="e.g. 13. UV Fluorescent Fiber Inspection"
                  className={`w-full px-3 py-2  border text-xs outline-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Metric / Finding Description
                </label>
                <input
                  type="text"
                  value={newStageForm.metric}
                  onChange={(e) => setNewStageForm({ ...newStageForm, metric: e.target.value })}
                  placeholder="e.g. 365nm UV active multi-color fibers verified"
                  className={`w-full px-3 py-2  border text-xs outline-none font-mono ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Audit Status
                </label>
                <select
                  value={newStageForm.status}
                  onChange={(e) => setNewStageForm({ ...newStageForm, status: e.target.value as any })}
                  className={`w-full px-3 py-2  border text-xs outline-none font-bold ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="verified">Verified (Cleared)</option>
                  <option value="warning">Warning (Requires Review)</option>
                  <option value="flagged">Flagged (Anomaly Detected)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsAddStageOpen(false)}
                  className={`px-3.5 py-1.5  text-xs font-medium border ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5  bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Add Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
