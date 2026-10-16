"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, ArrowUpRight } from "lucide-react";

interface ModalRegistrarClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (cliente: any) => void;
}

export default function ModalRegistrarCliente({ isOpen, onClose, onSuccess }: ModalRegistrarClienteProps) {
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState("Lead");
  const [github, setGithub] = useState("");
  const [sitePublicado, setSitePublicado] = useState("");
  const [vercel, setVercel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoCliente = {
      id: Date.now().toString(),
      nome: nome || "Contato Comercial",
      empresa: empresa || "Empresa sem razão social",
      whatsapp: whatsapp || "(11) 99999-9999",
      status,
      github,
      sitePublicado,
      vercel,
      created_at: new Date().toISOString()
    };
    if (onSuccess) onSuccess(novoCliente);
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
                    <UserPlus className="w-5 h-5 text-purple-200" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-200">
                      / CODEHARD / NOVO CONTATO
                    </span>
                    <h2 className="text-xl font-bold tracking-tight">Registrar cliente.</h2>
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
                Centralize a identificação, o relacionamento e os canais digitais do cliente.
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* 01 Identidade */}
              <div className="bg-[#120e24] p-4 rounded-2xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    01
                  </span>
                  <span className="font-semibold text-white text-xs">Identidade</span>
                  <span className="text-[11px] text-zinc-500">Quem é o contato e qual empresa ele representa</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Nome</label>
                    <input
                      type="text"
                      placeholder="Ex.: Mariana Costa"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Empresa</label>
                    <input
                      type="text"
                      placeholder="Ex.: Clínica Nova Era"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 02 Relacionamento */}
              <div className="bg-[#120e24] p-4 rounded-2xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    02
                  </span>
                  <span className="font-semibold text-white text-xs">Relacionamento</span>
                  <span className="text-[11px] text-zinc-500">Defina o canal principal e o momento comercial</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">WhatsApp</label>
                    <input
                      type="text"
                      placeholder="(11) 99999-9999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 block">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="Lead">Lead (Contato recém-relacionado)</option>
                      <option value="Negociação">Negociação (Apresentação / Briefing)</option>
                      <option value="Proposta enviada">Proposta enviada (Aguardando fechamento)</option>
                      <option value="Cliente">Cliente (Contrato assinado / Ativo)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 03 Presença digital */}
              <div className="bg-[#120e24] p-4 rounded-2xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    03
                  </span>
                  <span className="font-semibold text-white text-xs">Presença digital</span>
                  <span className="text-[11px] text-zinc-500">Links úteis para acompanhar e entregar o projeto</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-zinc-400">GitHub</label>
                      <span className="text-[9px] text-zinc-600 uppercase font-mono">opcional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="github.com/usuario/repo"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-zinc-400">Site publicado</label>
                      <span className="text-[9px] text-zinc-600 uppercase font-mono">opcional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="empresa.com.br"
                      value={sitePublicado}
                      onChange={(e) => setSitePublicado(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-zinc-400">Vercel</label>
                      <span className="text-[9px] text-zinc-600 uppercase font-mono">opcional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="projeto.vercel.app"
                      value={vercel}
                      onChange={(e) => setVercel(e.target.value)}
                      className="w-full bg-[#181330] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Note & Submit */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  O contato ficará disponível para vendas e projetos.
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#9333ea] text-white font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
                >
                  Salvar cliente <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

