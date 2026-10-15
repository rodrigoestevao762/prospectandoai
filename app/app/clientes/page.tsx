"use client";

import React, { useState } from "react";
import { Plus, Users, UserPlus, ArrowUpRight, Search, Filter } from "lucide-react";
import ModalRegistrarCliente from "@/components/codemakers/ModalRegistrarCliente";
import HardyMascot from "@/components/codemakers/HardyMascot";

export default function ClientesPage() {
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [filterStage, setFilterStage] = useState("Todos");
  const [clientes, setClientes] = useState<any[]>([]);

  const stages = ["Todos", "Lead", "Negociação", "Proposta enviada", "Cliente"];

  const filteredClientes = filterStage === "Todos"
    ? clientes
    : clientes.filter(c => c.status === filterStage);

  return (
    <div className="space-y-6">
      {/* ── HERO BANNER: RELATIONSHIP DESK COM HARDY MASCOTE ── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-6 md:p-8 overflow-hidden shadow-[0_0_40px_rgba(109,40,217,0.35)] border border-purple-400/30">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Mascot Hardy on Right */}
        <div className="absolute right-4 md:right-10 -bottom-4 md:-bottom-8 w-44 md:w-60 h-44 md:h-60 pointer-events-none">
          <HardyMascot variant="client" className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 font-bold">
              / CODEHARD / RELATIONSHIP DESK
            </span>
            <button
              onClick={() => setModalClienteOpen(true)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Novo cliente
            </button>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2">
            Clientes que viram resultado.
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 mt-1.5 max-w-lg">
            Acompanhe relações, avance negociações e transforme cada contato no próximo projeto.
          </p>

          {/* 4 Métricas Cards no Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Clientes cadastrados</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">{clientes.length}</span>
              <span className="text-[9px] text-purple-200/70 block">na sua carteira</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Em negociação</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">0</span>
              <span className="text-[9px] text-purple-200/70 block">oportunidades abertas</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Projetos fechados</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">0</span>
              <span className="text-[9px] text-purple-200/70 block">0% de conversão</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-purple-200 block font-mono">Receita gerada</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">R$ 0</span>
              <span className="text-[9px] text-purple-200/70 block">0 vendas registradas</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID INFERIOR: SUA CARTEIRA & WIDGETS DO FUNIL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Principal: Tabela da Carteira (8 colunas) */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  RELATIONSHIP BOARD / 00
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">Sua carteira</h3>
                <span className="text-xs text-zinc-500 font-mono">
                  {clientes.length} de {clientes.length} empresas no radar
                </span>
              </div>

              {/* Filtro por estágio */}
              <div className="flex items-center p-1 rounded-xl bg-[#140f28] border border-white/[0.06] text-xs">
                {stages.map((stg) => (
                  <button
                    key={stg}
                    onClick={() => setFilterStage(stg)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      filterStage === stg
                        ? "bg-purple-600 text-white font-bold shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            {/* Cabeçalho da Tabela */}
            <div className="grid grid-cols-5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 py-3 border-b border-white/[0.04] mt-2">
              <span>EMPRESA</span>
              <span>CONTATO</span>
              <span>ESTÁGIO</span>
              <span>ENTREGA DIGITAL</span>
              <span className="text-right">RESULTADO</span>
            </div>

            {/* Lista ou Empty State */}
            {filteredClientes.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#15102a] border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 shadow-inner">
                  <Users className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Sua carteira está vazia</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Cadastre a primeira empresa e comece a vender.
                </p>
                <button
                  onClick={() => setModalClienteOpen(true)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-100 transition-colors shadow-lg cursor-pointer"
                >
                  Cadastrar cliente
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {filteredClientes.map((c) => (
                  <div key={c.id} className="grid grid-cols-5 py-3.5 items-center text-xs">
                    <span className="font-semibold text-white truncate">{c.empresa}</span>
                    <span className="text-zinc-400 truncate">{c.nome}</span>
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                        {c.status}
                      </span>
                    </div>
                    <span className="text-zinc-500 truncate">{c.sitePublicado || "—"}</span>
                    <span className="text-right font-mono text-zinc-400">R$ 0,00</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Widgets Pulso & Próximo Movimento (4 colunas) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card Pulso da Carteira */}
          <div className="p-6 rounded-3xl bg-[#0c0a18] border border-purple-900/25 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                  FUNIL / SINAL AO VIVO
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">Pulso da carteira</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#16102e] border border-purple-500/20 text-[10px] font-mono text-zinc-400">
                0 contatos
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {["Lead", "Negociação", "Proposta enviada", "Cliente"].map((f) => (
                <div
                  key={f}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#120e24] border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-xs text-zinc-300">{f}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">0</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setFilterStage("Todos")}
              className="w-full py-2.5 rounded-xl bg-[#140f28] hover:bg-[#1c1538] border border-white/10 text-white text-xs font-semibold transition-colors mt-2"
            >
              Ver carteira completa
            </button>
          </div>

          {/* Card Próximo Movimento */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#4c1d95] via-[#581c87] to-[#1e0b3d] border border-purple-500/30 shadow-[0_0_25px_rgba(109,40,217,0.3)] space-y-3">
            <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest font-bold">
              PRÓXIMO MOVIMENTO
            </span>
            <h4 className="text-lg font-bold text-white">Pronto para começar.</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              Cadastre uma empresa para criar sua primeira oportunidade comercial.
            </p>
            <button
              onClick={() => setModalClienteOpen(true)}
              className="w-full py-3 rounded-xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-100 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" /> Novo cliente
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalRegistrarCliente
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        onSuccess={(c) => setClientes((prev) => [c, ...prev])}
      />
    </div>
  );
}

