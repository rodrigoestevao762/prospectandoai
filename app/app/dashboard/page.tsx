"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { DollarSign, CheckCircle2 } from "lucide-react";

export default function VisaoGeralDashboard() {
  const [stats, setStats] = useState({ total: 0, quentes: 0, enviados: 0, clientes: 0, mrr: 0 });
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [sitesEntregues, setSitesEntregues] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabaseBrowser().from("leads").select("id, nome, status, nivel, notas, created_at");
      if (data) {
        let totalMrr = 0;
        let sitesList: any[] = [];
        
        let cNovo = 0, cGerada = 0, cEnviado = 0, cRespondido = 0, cCliente = 0;

        data.forEach((lead) => {
          if (lead.status === "novo") cNovo++;
          if (lead.status === "mensagem_gerada") cGerada++;
          if (lead.status === "enviado") cEnviado++;
          if (lead.status === "respondido") cRespondido++;
          if (lead.status === "cliente") cCliente++;

          try {
            if (lead.notas) {
              const js = JSON.parse(lead.notas);
              if (js.valor_venda) totalMrr += Number(js.valor_venda);
              if (js.site_url || lead.status === 'cliente') {
                sitesList.push({
                  nome: lead.nome,
                  url: js.site_url || null,
                  valor: js.valor_venda || 0,
                  dataFechamento: js.data_fechamento || lead.created_at
                });
              }
            }
          } catch(e) {}
        });

        // Ordena os sites recentes (últimos fechados primeiro)
        sitesList.sort((a, b) => new Date(b.dataFechamento).getTime() - new Date(a.dataFechamento).getTime());

        setStats({
          total: data.length,
          quentes: data.filter(d => d.nivel === "quente").length,
          enviados: data.filter(d => d.status === "enviado").length,
          clientes: cCliente,
          mrr: totalMrr
        });

        setFunnelData([
          { name: 'Prospectos (Frios)', value: cNovo },
          { name: 'Enriquecidos/Gerados', value: cGerada },
          { name: 'Interceptados (Envios)', value: cEnviado },
          { name: 'Em Negociação', value: cRespondido },
          { name: 'Clientes Ativos', value: cCliente },
        ]);

        setSitesEntregues(sitesList.slice(0, 5)); // Mostra os 5 últimos
      }
    }
    load();
  }, []);

  // Fake historic MRR for chart shape, appending real MRR at the end
  const mrrHistory = [
    { name: 'S-4', total: stats.mrr * 0.4 }, 
    { name: 'S-3', total: stats.mrr * 0.6 },
    { name: 'S-2', total: stats.mrr * 0.8 }, 
    { name: 'S-1', total: stats.mrr * 0.9 },
    { name: 'Atual', total: stats.mrr },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="eyebrow">HUD de Comando</p>
        <h1 className="headline mt-1 text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--signal)]">
          Visão Tática Global
        </h1>
        <p className="text-[var(--ink-dim)] mt-2 text-sm">Monitoramento em tempo real do faturamento e status das entregas.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total de Alvos" value={stats.total.toLocaleString()} trend="Base atual" icon="🎯" color="var(--signal)" delay={0} />
        <KPICard title="Leads Quentes" value={stats.quentes.toLocaleString()} trend="Prioridade" icon="🔥" color="var(--alert)" delay={0.1} />
        <KPICard title="Vendas Fechadas" value={stats.clientes.toLocaleString()} trend="Sucesso" icon="🤝" color="#10b981" delay={0.2} />
        <KPICard title="Receita (MRR)" value={stats.mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} trend="Acumulado" icon="💰" color="#facc15" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="panel rounded-3xl p-6 lg:col-span-2 relative overflow-hidden group border border-white/10 bg-black/40 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--amber)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="mono text-xs uppercase tracking-widest text-[var(--amber)] mb-6 flex items-center gap-2 font-bold"><DollarSign className="w-4 h-4"/> Receita Real (Histórico Simulado + Atual)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrHistory}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--amber)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--amber)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--ink-faint)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--ink-faint)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--amber)' }}
                />
                <Area type="monotone" dataKey="total" stroke="var(--amber)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Funnel Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="panel rounded-3xl p-6 relative overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl"
        >
          <h3 className="mono text-xs uppercase tracking-widest text-[var(--ink-dim)] mb-6">Funil de Conversão (Real)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="var(--ink-dim)" fontSize={9} tickLine={false} axisLine={false} width={100} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: 'black', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="var(--signal)" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === funnelData.length - 1 ? '#10b981' : `var(--signal)`} opacity={1 - index * 0.1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Entrega de Site / Serviços Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="panel rounded-3xl p-6 border border-white/10 bg-black/40 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="mono text-xs uppercase tracking-widest text-[var(--ink-dim)]">Status: Sites Hospedados Vercel / Entregues</h3>
            <span className="badge border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981] text-[9px] font-bold tracking-widest">REGISTRO MANUAL E IA</span>
          </div>
          
          {sitesEntregues.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <p className="mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)]">Nenhum site registrado no CRM de vendas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sitesEntregues.map((site, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#10b981]/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[var(--signal)] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#10b981] transition-colors">{site.nome}</h4>
                      <p className="text-[10px] text-[var(--ink-faint)] mono uppercase flex gap-2 mt-1">
                        <span className="text-[#facc15] font-bold">R$ {site.valor}</span>
                        {site.url ? <span>• LINK ATIVO</span> : <span>• S/ URL CADASTRADA</span>}
                      </p>
                    </div>
                  </div>
                  {site.url && (
                    <a href={site.url} target="_blank" className="btn-3d bg-white/5 border border-white/10 text-[10px] py-2 px-4 hover:text-white">Acessar ↗</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Omnichannel Inbox Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="panel rounded-3xl p-6 relative overflow-hidden border border-[var(--signal)]/30 bg-black/40 backdrop-blur-xl"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-[var(--signal)] opacity-5 blur-[100px] pointer-events-none rounded-full" />
          <h3 className="mono text-xs uppercase tracking-widest text-[var(--signal)] mb-2 font-bold">Caixa de Entrada Omnichannel (BETA)</h3>
          <p className="text-[11px] text-[var(--ink-dim)] mb-6">Centralize respostas de WhatsApp, Instagram e Facebook.</p>
          
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <div className="flex gap-2 mb-6">
              <span className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center border border-[#25D366]/50 shadow-[0_0_15px_rgba(37,211,102,0.3)]">💬</span>
              <span className="w-10 h-10 rounded-full bg-[#e879f9]/20 flex items-center justify-center border border-[#e879f9]/50 shadow-[0_0_15px_rgba(232,121,249,0.3)]">📸</span>
              <span className="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center border border-[#1877F2]/50 shadow-[0_0_15px_rgba(24,119,242,0.3)]">📘</span>
            </div>
            <h4 className="font-display font-bold text-white mb-2">Configure os Webhooks Oficiais da Meta</h4>
            <p className="text-xs text-[var(--ink-faint)] leading-relaxed max-w-sm mb-6">
              Para receber e responder mensagens por este painel, é necessário conectar suas contas de negócio nas plataformas da Meta (Facebook Developer).
            </p>
            <button className="btn-3d bg-[var(--signal)] text-black font-bold shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              ⚙️ INICIAR CONFIGURAÇÃO (Em breve)
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}

function KPICard({ title, value, trend, icon, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="panel-hover relative overflow-hidden rounded-3xl bg-black/40 border border-white/10 p-5 backdrop-blur-xl"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 blur-[40px] opacity-20 pointer-events-none" style={{ backgroundColor: color }} />
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl filter drop-shadow-md">{icon}</span>
        <span className="mono text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest" style={{ color: color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="mono text-[10px] uppercase tracking-widest text-[var(--ink-dim)] mb-1">{title}</h3>
        <p className="font-display text-3xl font-black tracking-tight text-white">{value}</p>
      </div>
    </motion.div>
  );
}
