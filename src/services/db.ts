import { Client, Lead, FinancialTransaction, Task } from "../types";

const KEYS = {
  CLIENTS: "axon_clients",
  LEADS: "axon_leads",
  FINANCIALS: "axon_financials",
  TASKS: "axon_tasks",
};

// Default data representing a premium operational agency startup
const DEFAULT_CLIENTS: Client[] = [
  {
    id: "c1",
    name: "Dr. Marcos Oliveira",
    company: "Clínica Innove Dent",
    whatsapp: "11999998888",
    instagram: "clinicainnovedent",
    monthly_value: 3500,
    status: "Ativo",
    start_date: "2026-01-15",
    notes: "Gestão completa de tráfego pago e branding digital.",
    created_at: new Date("2026-01-15").toISOString(),
  },
  {
    id: "c2",
    name: "Dra. Paula Albuquerque",
    company: "Instituto Paula Estética",
    whatsapp: "21988887777",
    instagram: "dra.paulaestetica",
    monthly_value: 4200,
    status: "Ativo",
    start_date: "2026-03-01",
    notes: "Contrato semestral focado em captação de implantes/facetas.",
    created_at: new Date("2026-03-01").toISOString(),
  }
];

const DEFAULT_LEADS: Lead[] = [
  {
    id: "l1",
    name: "Dr. Roberto Santos",
    company: "Odonto Clean SP",
    whatsapp: "11977776666",
    instagram: "odontocleansp",
    value: 3000,
    status: "Reunião",
    notes: "Reunião de alinhamento comercial agendada.",
    created_at: new Date().toISOString(),
  },
  {
    id: "l2",
    name: "Dra. Camila Ferraz",
    company: "Dermatologia Ferraz",
    whatsapp: "19966665555",
    instagram: "dra.camilaferraz",
    value: 5000,
    status: "Proposta",
    notes: "Aguardando confirmação da proposta de funil completo enviada.",
    created_at: new Date().toISOString(),
  }
];

const DEFAULT_FINANCIALS: FinancialTransaction[] = [
  {
    id: "f1",
    type: "entrada",
    description: "Mensalidade - Clínica Innove Dent",
    value: 3500,
    category: "Serviço",
    date: "2026-06-10",
    created_at: new Date("2026-06-10").toISOString(),
  },
  {
    id: "f2",
    type: "entrada",
    description: "Mensalidade - Instituto Paula Estética",
    value: 4200,
    category: "Serviço",
    date: "2026-06-12",
    created_at: new Date("2026-06-12").toISOString(),
  },
  {
    id: "f3",
    type: "saída",
    description: "Assinatura Vercel Pro",
    value: 110,
    category: "Ferramentas/SaaS",
    date: "2026-06-05",
    created_at: new Date("2026-06-05").toISOString(),
  },
  {
    id: "f4",
    type: "saída",
    description: "Anúncios Meta Ads (Campanhas Internas)",
    value: 1500,
    category: "Marketing",
    date: "2026-06-01",
    created_at: new Date("2026-06-01").toISOString(),
  }
];

const DEFAULT_TASKS: Task[] = [
  {
    id: "t1",
    title: "Otimizar campanhas do Dr. Marcos",
    description: "Revisar custo por clique/conversão no Facebook Ads.",
    assigned_to: "Tráfego",
    due_date: "2026-06-25",
    status: "Em andamento",
    priority: "alta",
    created_at: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Enviar proposta comercial Dra. Camila",
    description: "Detalhar o funil estratégico e tráfego pago no PDF.",
    assigned_to: "Comercial",
    due_date: "2026-06-26",
    status: "Pendente",
    priority: "alta",
    created_at: new Date().toISOString(),
  },
  {
    id: "t3",
    title: "Relatório de performance Paula Estética",
    description: "Compilar dados de leads qualificados gerados no mês.",
    assigned_to: "Analytics",
    due_date: "2026-06-28",
    status: "Pendente",
    priority: "média",
    created_at: new Date().toISOString(),
  }
];

export const db = {
  getClients: (): Client[] => {
    const data = localStorage.getItem(KEYS.CLIENTS);
    if (!data) {
      localStorage.setItem(KEYS.CLIENTS, JSON.stringify(DEFAULT_CLIENTS));
      return DEFAULT_CLIENTS;
    }
    return JSON.parse(data);
  },
  saveClients: (data: Client[]) => {
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(data));
  },

  getLeads: (): Lead[] => {
    const data = localStorage.getItem(KEYS.LEADS);
    if (!data) {
      localStorage.setItem(KEYS.LEADS, JSON.stringify(DEFAULT_LEADS));
      return DEFAULT_LEADS;
    }
    return JSON.parse(data);
  },
  saveLeads: (data: Lead[]) => {
    localStorage.setItem(KEYS.LEADS, JSON.stringify(data));
  },

  getFinancials: (): FinancialTransaction[] => {
    const data = localStorage.getItem(KEYS.FINANCIALS);
    if (!data) {
      localStorage.setItem(KEYS.FINANCIALS, JSON.stringify(DEFAULT_FINANCIALS));
      return DEFAULT_FINANCIALS;
    }
    return JSON.parse(data);
  },
  saveFinancials: (data: FinancialTransaction[]) => {
    localStorage.setItem(KEYS.FINANCIALS, JSON.stringify(data));
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    if (!data) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    return JSON.parse(data);
  },
  saveTasks: (data: Task[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(data));
  },

  exportJSON: () => {
    const backup = {
      clients: db.getClients(),
      leads: db.getLeads(),
      financials: db.getFinancials(),
      tasks: db.getTasks(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importJSON: (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.clients)) db.saveClients(data.clients);
      if (Array.isArray(data.leads)) db.saveLeads(data.leads);
      if (Array.isArray(data.financials)) db.saveFinancials(data.financials);
      if (Array.isArray(data.tasks)) db.saveTasks(data.tasks);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  reset: () => {
    localStorage.removeItem(KEYS.CLIENTS);
    localStorage.removeItem(KEYS.LEADS);
    localStorage.removeItem(KEYS.FINANCIALS);
    localStorage.removeItem(KEYS.TASKS);
  }
};
