export interface Client {
  id: string;
  name: string;
  company: string;
  whatsapp: string;
  instagram: string;
  monthly_value: number;
  status: 'Ativo' | 'Inativo';
  start_date: string;
  notes: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  whatsapp: string;
  instagram: string;
  value: number;
  status: 'Novo' | 'Contato' | 'Reunião' | 'Proposta' | 'Fechado' | 'Perdido';
  notes: string;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'entrada' | 'saída';
  description: string;
  value: number;
  category: string;
  date: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  due_date: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
  priority: 'baixa' | 'média' | 'alta';
  created_at: string;
}
