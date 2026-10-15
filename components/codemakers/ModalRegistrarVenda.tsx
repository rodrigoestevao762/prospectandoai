"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Calendar, DollarSign, Layers, ArrowUpRight } from "lucide-react";

interface ModalRegistrarVendaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (venda: any) => void;
}

export default function ModalRegistrarVenda({ isOpen, onClose, onSuccess }: ModalRegistrarVendaProps) {
  const [projeto, setProjeto] = useState("");
  const [cliente, setCliente] = useState("Projeto independente");
  const [valorVendido, setValorVendido] = useState("");
  const [custoProjeto, setCustoProjeto] = useState("");
  const [tipoProjeto, setTipoProjeto] = useState("Site institucional");
  const [dataVenda, setDataVenda] = useState(new Date().toISOString().split("T")[0]);
  const [previsaoEntrega, setPrevisaoEntrega] = useState("");

  const numVendido = parseFloat(valorVendido.replace(/[^0-9.-]+/g, "")) || 0;
  const numCusto = parseFloat(custoProjeto.replace(/[^0-9.-]+/g, "")) || 0;
  const lucroEstimado = Math.max(0, numVendido - numCusto);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novaVenda = {
      id: Date.now().toString(),
      projeto: projeto || "Site Institucional Premium",
      cliente,
      valorVendido: numVendido,
      custoProjeto: numCusto,
      lucroEstimado,
      tipoProjeto,
      dataVenda,
      previsaoEntrega,
      status: "Em andamento",
      created_at: new Date().toISOString()
    };
    if (onSuccess) onSuccess(novaVenda);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-2xl bg-[#0c0a17] border border-purple-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.25)] flex flex-col max-h-[92vh]"
          >
            {/* Header com Gradiente Roxo Real */}
            <div className="relative p-6 bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-200" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-200">
                      CODE MAKERS / NOVA OPERAÇÃO
                    </span>
                    <h2 className="text-xl font-bold tracking-tight">Registrar venda.</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-xs text-purple-200/90 mt-2">
                Organize o projeto, os valores e a entrega em um único lançamento.
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* 01 Identificação */}
              <div className="bg-[#120e24] p-4 rounded-2xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    01
                  </span>
                  <span className="font-semibold text-white text-xs">Identificação</span>
                  <span className="text-[11px] text-zinc-500">O que foi vendido e para quem</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Projeto</label>
                    <input
                      type="text"
                      placeholder="Ex.: Landing page premium"
                      value={projeto}
                      onChange={(e) => setProjeto(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-zinc-400">Cliente</label>
                      <span className="text-[9px] text-zinc-600 uppercase font-mono">opcional</span>
                    </div>
                    <select
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="Projeto independente">Projeto independente (Sem cliente vinculado)</option>
                      <option value="Mariana Costa - Clínica Nova Era">Mariana Costa - Clínica Nova Era</option>
                      <option value="Rodrigo Silva - Studio Design">Rodrigo Silva - Studio Design</option>
                      <option value="Alpha Tech Solutions">Alpha Tech Solutions</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 02 Resultado financeiro */}
              <div className="bg-[#120e24] p-4 rounded-2xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    02
                  </span>
                  <span className="font-semibold text-white text-xs">Resultado financeiro</span>
                  <span className="text-[11px] text-zinc-500">Informe receita e custo para prever o lucro</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Valor vendido</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-zinc-500 text-xs font-mono">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={valorVendido}
                        onChange={(e) => setValorVendido(e.target.value)}
                        className="w-full bg-[#181330] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Custo do projeto</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-zinc-500 text-xs font-mono">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={custoProjeto}
                        onChange={(e) => setCustoProjeto(e.target.value)}
                        className="w-full bg-[#181330] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="bg-[#1c1538] border border-purple-500/30 p-2.5 rounded-xl text-center">
                    <span className="text-[9px] uppercase tracking-wider text-purple-300 font-mono font-bold block">
                      LUCRO ESTIMADO
                    </span>
                    <span className="text-base font-bold text-white">
                      R$ {lucroEstimado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[9px] text-zinc-500 block">Calculado automaticamente</span>
                  </div>
                </div>
              </div>

              {/* 03 Entrega */}
              <div className="bg-[#120e24] p-4 rounded-2xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    03
                  </span>
                  <span className="font-semibold text-white text-xs">Entrega</span>
                  <span className="text-[11px] text-zinc-500">Classifique o projeto e organize as datas</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Tipo de projeto</label>
                    <select
                      value={tipoProjeto}
                      onChange={(e) => setTipoProjeto(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="Site institucional">Site institucional (Presença digital completa)</option>
                      <option value="Landing page premium">Landing page premium (Alta conversão)</option>
                      <option value="E-commerce Store">E-commerce / Catálogo online</option>
                      <option value="SaaS / Web App">SaaS / Web App interativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Data da venda</label>
                    <input
                      type="date"
                      value={dataVenda}
                      onChange={(e) => setDataVenda(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-zinc-400">Previsão de entrega</label>
                      <span className="text-[9px] text-zinc-600 uppercase font-mono">opcional</span>
                    </div>
                    <input
                      type="date"
                      value={previsaoEntrega}
                      onChange={(e) => setPrevisaoEntrega(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Note & Submit */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  O lucro entra na sua carteira após o registro.
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] text-white font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
                >
                  Registrar venda <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

