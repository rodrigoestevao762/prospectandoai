"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Shield, Bell, Eye, Kanban, CreditCard, DollarSign,
  HelpCircle, Mail, Bug, ArrowUpRight, CheckCircle2
} from "lucide-react";

interface ModalConfiguracoesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalConfiguracoes({ isOpen, onClose }: ModalConfiguracoesProps) {
  const [activeTab, setActiveTab] = useState("support");
  const [nome, setNome] = useState("Rodrigo Estevão");
  const [email, setEmail] = useState("rodrigoestevao762@gmail.com");
  const [ocultarValores, setOcultarValores] = useState(false);
  const [notifVendas, setNotifVendas] = useState(true);
  const [notifHunter, setNotifHunter] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-4xl bg-[#0b0916] border border-purple-500/20 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(124,58,237,0.3)] flex flex-col max-h-[90vh]"
          >
            {/* Header com Gradiente Roxo Real & Marca CM */}
            <div className="relative p-7 bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-purple-200">
                  / CODE MAKERS / CENTRAL DA CONTA
                </span>
                <h2 className="text-2xl font-bold tracking-tight mt-0.5">Configurações.</h2>
                <p className="text-xs text-purple-200/90 mt-1">
                  Seu acesso, sua operação, suas escolhas. Tudo sob o seu controle.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end border-r border-white/20 pr-4">
                  <span className="text-2xl font-black tracking-tighter text-white font-mono">CM/</span>
                  <span className="text-[9px] uppercase tracking-widest text-purple-200 font-mono">
                    SEU SISTEMA SOB CONTROLE
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content Body com Duas Colunas */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Column: Navigation Tabs */}
              <div className="w-full md:w-64 border-r border-white/[0.08] bg-[#080612] p-4 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  {/* Grupo Sua Conta */}
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 px-3 font-semibold">
                      / SUA CONTA
                    </span>
                    <div className="space-y-1 mt-2">
                      <button
                        onClick={() => setActiveTab("profile")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          activeTab === "profile" ? "bg-purple-600/20 text-white font-bold border border-purple-500/40" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <User className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs leading-none">Meu perfil</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Identidade e contato</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("security")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          activeTab === "security" ? "bg-purple-600/20 text-white font-bold border border-purple-500/40" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <Shield className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs leading-none">Segurança</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Senha e sessões</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("notifications")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          activeTab === "notifications" ? "bg-purple-600/20 text-white font-bold border border-purple-500/40" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <Bell className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs leading-none">Notificações</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Alertas de vendas</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("privacy")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          activeTab === "privacy" ? "bg-purple-600/20 text-white font-bold border border-purple-500/40" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <Eye className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs leading-none">Privacidade</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Valores no painel</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Grupo Configurações */}
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 px-3 font-semibold">
                      / CONFIGURAÇÕES
                    </span>
                    <div className="space-y-1 mt-2">
                      <button
                        onClick={() => setActiveTab("crm")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          activeTab === "crm" ? "bg-purple-600/20 text-white font-bold border border-purple-500/40" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <Kanban className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs leading-none">CRM</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Code Hunter e funil</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("plan")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          activeTab === "plan" ? "bg-purple-600/20 text-white font-bold border border-purple-500/40" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs leading-none">Meu plano</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Acesso e benefícios</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("payments")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          activeTab === "payments" ? "bg-purple-600/20 text-white font-bold border border-purple-500/40" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <DollarSign className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs leading-none">Pagamentos</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Integração Asaas / PIX</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("support")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          activeTab === "support" ? "bg-purple-600/20 text-white font-bold border border-purple-500/40" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs leading-none">Suporte</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Ajuda e Bug Hunter</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conta Conectada Badge */}
                <div className="pt-4 border-t border-white/[0.06] mt-4">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block mb-2 font-semibold">
                    / CONTA CONECTADA
                  </span>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-purple-950/30 border border-purple-500/20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-violet-500 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                      R
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-white truncate">Rodrigo Estevão</div>
                      <div className="text-[10px] text-purple-300 font-mono truncate">Code Member · rodrigo...</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Tab View Content */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#0d0a1a]">
                {activeTab === "support" && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                        / CONFIGURAÇÕES / 08 DE 08
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">Como podemos ajudar?</h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Dúvidas, problemas e relatos de bugs chegam direto à equipe da Code Makers.
                      </p>
                    </div>

                    {/* Canal Oficial Card */}
                    <div className="bg-[#130f26] border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                            CANAL OFICIAL
                          </span>
                          <h4 className="text-base font-bold text-white mt-0.5">Fale com o suporte.</h4>
                          <p className="text-xs text-zinc-400 mt-1 max-w-md">
                            Se algo não funcionar como esperado ou você precisar de ajuda, envie uma mensagem. Nossa equipe vai receber seu chamado por e-mail.
                          </p>

                          <div className="mt-4 p-3.5 bg-[#1b1535] border border-white/10 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono block">
                                E-MAIL DE SUPORTE
                              </span>
                              <span className="text-sm font-semibold text-white font-mono">
                                suporte@codemakers.com.br
                              </span>
                            </div>
                            <a
                              href="mailto:suporte@codemakers.com.br"
                              className="w-8 h-8 rounded-lg bg-purple-600/30 hover:bg-purple-600 border border-purple-400/40 flex items-center justify-center text-white transition-colors"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bug Hunter Card */}
                    <div className="bg-[#130f26] border border-white/[0.06] rounded-2xl p-6 flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          01
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">Encontrou um bug no Bug Hunter?</h4>
                          <p className="text-xs text-zinc-400 mt-1 max-w-md">
                            Mande o relato para o mesmo e-mail. Conte o que aconteceu, em qual tela ocorreu e, se possível, anexe uma captura. Essas informações ajudam a equipe a investigar mais rápido.
                          </p>
                        </div>
                      </div>
                      <a
                        href="mailto:suporte@codemakers.com.br?subject=Relato%20de%20Bug"
                        className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        Relatar um bug <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                        / SUA CONTA / MEU PERFIL
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">Identidade e contato</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Nome completo</label>
                        <input
                          type="text"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          className="w-full bg-[#181330] border border-white/10 rounded-xl px-4 py-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">E-mail de acesso</label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full bg-[#141026] border border-white/5 rounded-xl px-4 py-2.5 text-zinc-400 cursor-not-allowed font-mono text-xs"
                        />
                      </div>
                      <button
                        onClick={() => alert("Alterações salvas com sucesso.")}
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                      >
                        Salvar perfil
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                        / SUA CONTA / PRIVACIDADE
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">Privacidade no painel</h3>
                    </div>
                    <div className="p-4 bg-[#141028] rounded-2xl border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-white block">Ocultar valores monetários</span>
                        <span className="text-xs text-zinc-400">
                          Exibe ••••• no lugar do saldo e lucros ao compartilhar a tela.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={ocultarValores}
                        onChange={(e) => setOcultarValores(e.target.checked)}
                        className="w-5 h-5 accent-purple-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "plan" && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                        / CONFIGURAÇÕES / MEU PLANO
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">Plano atual & Limites</h3>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#1c143a] to-[#110d24] border border-purple-500/30 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                            ASSOCIAÇÃO ATIVA
                          </span>
                          <h4 className="text-2xl font-bold text-white">Code Member</h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            Acesso padrão ao CRM Kanban, Dashboard e Gestão de Clientes.
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
                          ATIVO
                        </span>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-zinc-400">
                          Deseja liberar o Code Hunter (7.000 créditos) e IA Prompts?
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            window.location.href = "/app/planos";
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                        >
                          Fazer Upgrade para Elite ↗
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

