import React from "react";
import { Client, Lead, FinancialTransaction, Task } from "../types";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CheckSquare, 
  AlertCircle,
  Clock
} from "lucide-react";

interface DashboardProps {
  clients: Client[];
  leads: Lead[];
  financials: FinancialTransaction[];
  tasks: Task[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ clients, leads, financials, tasks, onNavigate }: DashboardProps) {
  // Metrics Calculations
  const activeClients = clients.filter(c => c.status === "Ativo");
  const activeClientsCount = activeClients.length;

  // Monthly Revenue (MRR) = sum of monthly values of active clients
  const monthlyRevenue = activeClients.reduce((sum, c) => sum + (c.monthly_value || 0), 0);

  // Financial calculations
  const totalReceived = financials
    .filter(f => f.type === "entrada")
    .reduce((sum, f) => sum + f.value, 0);

  const totalSpent = financials
    .filter(f => f.type === "saída")
    .reduce((sum, f) => sum + f.value, 0);

  const currentCash = totalReceived - totalSpent;

  // Operational metrics
  const pendingTasks = tasks.filter(t => t.status !== "Concluído");
  const pendingTasksCount = pendingTasks.length;

  const activeLeads = leads.filter(l => l.status !== "Fechado" && l.status !== "Perdido");
  const activeLeadsCount = activeLeads.length;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-xs text-neutral-400 mt-1">Visão geral e faturamento da operação interna AXON.</p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* MRR Card */}
        <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start text-neutral-400">
            <span className="text-xs font-medium">Receita Mensal (MRR)</span>
            <TrendingUp size={14} className="text-neutral-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              R$ {monthlyRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-neutral-500">Recorrente de {activeClientsCount} ativos</span>
          </div>
        </div>

        {/* Caixa Atual Card */}
        <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start text-neutral-400">
            <span className="text-xs font-medium">Caixa Atual</span>
            <DollarSign size={14} className="text-neutral-500" />
          </div>
          <div>
            <div className={`text-lg font-bold ${currentCash >= 0 ? "text-white" : "text-red-400"}`}>
              R$ {currentCash.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-neutral-500">Saldo líquido disponível</span>
          </div>
        </div>

        {/* Total Recebido Card */}
        <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start text-neutral-400">
            <span className="text-xs font-medium">Total Recebido</span>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              R$ {totalReceived.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-neutral-500">Histórico de entradas</span>
          </div>
        </div>

        {/* Total Gasto Card */}
        <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start text-neutral-400">
            <span className="text-xs font-medium">Total Gasto</span>
            <TrendingDown size={14} className="text-neutral-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              R$ {totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-neutral-500">Histórico de despesas</span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => onNavigate("clientes")}
          className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/60 rounded-xl p-3 text-left transition-all"
        >
          <div className="text-neutral-500 mb-1"><Users size={16} /></div>
          <div className="text-sm font-bold text-white">{activeClientsCount}</div>
          <div className="text-[10px] text-neutral-400">Clientes Ativos</div>
        </button>

        <button 
          onClick={() => onNavigate("crm")}
          className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/60 rounded-xl p-3 text-left transition-all"
        >
          <div className="text-neutral-500 mb-1"><AlertCircle size={16} /></div>
          <div className="text-sm font-bold text-white">{activeLeadsCount}</div>
          <div className="text-[10px] text-neutral-400">Leads no CRM</div>
        </button>

        <button 
          onClick={() => onNavigate("tarefas")}
          className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/60 rounded-xl p-3 text-left transition-all"
        >
          <div className="text-neutral-500 mb-1"><CheckSquare size={16} /></div>
          <div className="text-sm font-bold text-white">{pendingTasksCount}</div>
          <div className="text-[10px] text-neutral-400">Tarefas Abertas</div>
        </button>
      </div>

      {/* Recent Activity lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Urgent Tasks */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Tarefas Urgentes</h3>
            <button 
              onClick={() => onNavigate("tarefas")}
              className="text-[10px] text-white font-medium hover:underline"
            >
              Ver todas
            </button>
          </div>
          
          <div className="space-y-2">
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex justify-between items-center bg-black/40 border border-neutral-800/40 rounded-lg p-2.5">
                <div className="min-w-0 flex-1 pr-3">
                  <div className="text-xs font-semibold text-white truncate">{task.title}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1.5">
                    <span className="capitalize">{task.assigned_to}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={10} />
                      {new Date(task.due_date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                    </span>
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  task.priority === "alta" 
                    ? "bg-neutral-900 border-neutral-700 text-white" 
                    : task.priority === "média"
                    ? "bg-neutral-900 border-neutral-800 text-neutral-300"
                    : "bg-neutral-950 border-neutral-900 text-neutral-500"
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
            {pendingTasksCount === 0 && (
              <div className="text-center py-6 text-xs text-neutral-500">Nenhuma tarefa pendente.</div>
            )}
          </div>
        </div>

        {/* Hot Leads */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Pipeline Recente</h3>
            <button 
              onClick={() => onNavigate("crm")}
              className="text-[10px] text-white font-medium hover:underline"
            >
              Ver CRM
            </button>
          </div>

          <div className="space-y-2">
            {leads.filter(l => l.status !== "Fechado" && l.status !== "Perdido").slice(0, 3).map(lead => (
              <div key={lead.id} className="flex justify-between items-center bg-black/40 border border-neutral-800/40 rounded-lg p-2.5">
                <div className="min-w-0 flex-1 pr-3">
                  <div className="text-xs font-semibold text-white truncate">{lead.name}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 truncate">{lead.company || "Empresa não informada"}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">R$ {lead.value}</div>
                  <div className="text-[9px] text-neutral-500 mt-0.5">{lead.status}</div>
                </div>
              </div>
            ))}
            {activeLeadsCount === 0 && (
              <div className="text-center py-6 text-xs text-neutral-500">Nenhum lead no pipeline.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
