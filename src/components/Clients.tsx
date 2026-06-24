import React, { useState } from "react";
import { Client } from "../types";
import { Search, Plus, X, Edit, Trash2, User, MessageSquare, Instagram, Calendar, FileText } from "lucide-react";

interface ClientsProps {
  clients: Client[];
  onSave: (client: Client) => void;
  onDelete: (id: string) => void;
}

export default function Clients({ clients, onSave, onDelete }: ClientsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    whatsapp: "",
    instagram: "",
    monthly_value: "",
    status: "Ativo" as "Ativo" | "Inativo",
    start_date: new Date().toISOString().split("T")[0],
    notes: ""
  });

  const filteredClients = clients.filter(client => {
    const search = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(search) ||
      client.company.toLowerCase().includes(search) ||
      client.instagram.toLowerCase().includes(search)
    );
  });

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({
      name: "",
      company: "",
      whatsapp: "",
      instagram: "",
      monthly_value: "",
      status: "Ativo",
      start_date: new Date().toISOString().split("T")[0],
      notes: ""
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(client);
    setFormData({
      name: client.name,
      company: client.company,
      whatsapp: client.whatsapp,
      instagram: client.instagram,
      monthly_value: client.monthly_value.toString(),
      status: client.status,
      start_date: client.start_date,
      notes: client.notes
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newClient: Client = {
      id: editingClient ? editingClient.id : "c_" + Math.random().toString(36).substr(2, 9),
      name: formData.name,
      company: formData.company,
      whatsapp: formData.whatsapp,
      instagram: formData.instagram,
      monthly_value: parseFloat(formData.monthly_value) || 0,
      status: formData.status,
      start_date: formData.start_date,
      notes: formData.notes,
      created_at: editingClient ? editingClient.created_at : new Date().toISOString()
    };

    onSave(newClient);
    setIsFormOpen(false);
    
    // Update selected profile view if edited
    if (selectedClient && selectedClient.id === newClient.id) {
      setSelectedClient(newClient);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      onDelete(id);
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex justify-between items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
          />
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors h-9"
        >
          <Plus size={14} />
          Cadastrar
        </button>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredClients.map(client => (
          <div
            key={client.id}
            onClick={() => setSelectedClient(client)}
            className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 cursor-pointer hover:border-neutral-700 transition-all flex justify-between items-start"
          >
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">{client.name}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                  client.status === "Ativo" 
                    ? "bg-neutral-900 border-neutral-700 text-white" 
                    : "bg-neutral-950 border-neutral-900 text-neutral-500"
                }`}>
                  {client.status}
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 truncate">{client.company || "Empresa não informada"}</div>
              <div className="text-[10px] text-neutral-500">R$ {client.monthly_value.toLocaleString("pt-BR")}/mês</div>
            </div>

            <div className="flex gap-1 ml-3">
              <button
                onClick={(e) => handleOpenEdit(client, e)}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                <Edit size={13} />
              </button>
              <button
                onClick={(e) => handleDelete(client.id, e)}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-10 text-xs text-neutral-500">Nenhum cliente cadastrado.</div>
        )}
      </div>

      {/* Details Side-Drawer / Modal Overlay */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-neutral-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Perfil do Cliente</span>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Title & Status */}
              <div>
                <h2 className="text-lg font-bold text-white">{selectedClient.name}</h2>
                <div className="text-xs text-neutral-400 mt-0.5">{selectedClient.company || "Empresa não informada"}</div>
              </div>

              {/* Specs */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-neutral-800/40">
                  <span className="text-neutral-500">Status</span>
                  <span className={`font-semibold ${selectedClient.status === "Ativo" ? "text-white" : "text-neutral-500"}`}>
                    {selectedClient.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-neutral-800/40">
                  <span className="text-neutral-500">Valor Mensal</span>
                  <span className="font-bold text-white">R$ {selectedClient.monthly_value.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-neutral-800/40">
                  <span className="text-neutral-500">Data de Entrada</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <Calendar size={12} className="text-neutral-500" />
                    {new Date(selectedClient.start_date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {selectedClient.whatsapp && (
                  <div className="flex justify-between items-center py-1.5 border-b border-neutral-800/40">
                    <span className="text-neutral-500">WhatsApp</span>
                    <a
                      href={`https://wa.me/${selectedClient.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-neutral-200 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare size={12} className="text-neutral-500" />
                      {selectedClient.whatsapp}
                    </a>
                  </div>
                )}
                {selectedClient.instagram && (
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-neutral-500">Instagram</span>
                    <a
                      href={`https://instagram.com/${selectedClient.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-neutral-200 hover:underline flex items-center gap-1"
                    >
                      <Instagram size={12} className="text-neutral-500" />
                      @{selectedClient.instagram}
                    </a>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                  <FileText size={12} /> Observações
                </span>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300 leading-relaxed min-h-20 whitespace-pre-wrap">
                  {selectedClient.notes || "Nenhuma observação cadastrada."}
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex gap-2 pt-4 border-t border-neutral-800">
              <button
                onClick={(e) => handleOpenEdit(selectedClient, e)}
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl py-2.5 text-xs text-white font-semibold transition-colors"
              >
                Editar Perfil
              </button>
              <button
                onClick={(e) => handleDelete(selectedClient.id, e)}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-red-900 rounded-xl p-2.5 text-neutral-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">
                {editingClient ? "Editar Cliente" : "Cadastrar Cliente"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 hover:bg-neutral-900 rounded text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  placeholder="Nome do responsável"
                />
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Empresa / Clínica</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  placeholder="Nome da empresa"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">WhatsApp (apenas números)</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  placeholder="ex: 11999998888"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Instagram (usuário)</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  placeholder="ex: clinicax"
                />
              </div>

              {/* Monthly Value */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Valor Mensal (R$)</label>
                <input
                  type="number"
                  value={formData.monthly_value}
                  onChange={(e) => setFormData({ ...formData, monthly_value: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  placeholder="Valor recorrente"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Data de Entrada</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-neutral-700"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "Ativo" | "Inativo" })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-neutral-700"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Observações</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 resize-none"
                  placeholder="Detalhes adicionais do cliente..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 bg-neutral-900 hover:bg-neutral-800 rounded-xl py-2.5 text-xs text-neutral-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl py-2.5 text-xs transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
