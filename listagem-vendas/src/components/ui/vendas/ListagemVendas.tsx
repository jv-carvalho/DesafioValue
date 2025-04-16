'use client';

import { useState, useEffect } from 'react';
import { Venda } from '@/types/index';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const dadosIniciais: Venda[] = [
  { id: "1", nome: "Produto A", valor: 100.00 },
  { id: "2", nome: "Produto B", valor: 200.00 },
  { id: "3", nome: "Serviço X", valor: 300.00 },
  { id: "4", nome: "Consultoria Y", valor: 450.00 },
];

export default function ListagemVendas() {
  const [vendas, setVendas] = useState<Venda[]>(dadosIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [vendaAtual, setVendaAtual] = useState<Venda | null>(null);
  
  const [novoNome, setNovoNome] = useState("");
  const [novoValor, setNovoValor] = useState("");

useEffect(() => {
  const vendasSalvas = localStorage.getItem('vendas');
  if (vendasSalvas) {
    try {
      const dados = JSON.parse(vendasSalvas);
      console.log("Dados carregados:", dados);
      setVendas(dados);
    } catch (e) {
      console.error("Erro ao carregar vendas:", e);
      setVendas(dadosIniciais);
    }
  } else {
    setVendas(dadosIniciais);
    localStorage.setItem('vendas', JSON.stringify(dadosIniciais));
  }
}, []);

  const abrirModalEditar = (venda: Venda) => {
    setVendaAtual(venda);
    setNovoNome(venda.nome);
    setNovoValor(venda.valor.toString());
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setVendaAtual(null);
    setNovoNome("");
    setNovoValor("");
  };

  const salvarEdicao = () => {
    if (!vendaAtual) return;

    if (!novoNome.trim() || !novoValor.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    const vendasAtualizadas = vendas.map(venda => 
      venda.id === vendaAtual.id 
        ? { ...venda, nome: novoNome, valor: parseFloat(novoValor) } 
        : venda
    );
    
    setVendas(vendasAtualizadas);
    localStorage.setItem('vendas', JSON.stringify(vendasAtualizadas));

    toast.success('Alterações salvas com sucesso!');

    fecharModal();
  };

  const excluirVenda = (id: string) => {
    const vendasAtualizadas = vendas.filter(venda => venda.id !== id);
    setVendas(vendasAtualizadas);
    localStorage.setItem('vendas', JSON.stringify(vendasAtualizadas));
    toast.success('Venda excluída com sucesso!');
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listagem de Vendas</h1>
        <Link href="/nova-venda">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nova Venda
          </button>
        </Link>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendas.map((venda) => (
              <tr key={venda.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{venda.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{venda.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{formatarValor(venda.valor)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900 border border-blue-600 hover:border-blue-900 rounded-md p-2"
                      onClick={() => abrirModalEditar(venda)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 border border-red-600 hover:border-red-900 rounded-md p-2"
                      onClick={() => excluirVenda(venda.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={fecharModal}></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-50">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Editar Venda</h2>
                <button 
                  onClick={fecharModal}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="py-2">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="nome" className="text-right text-sm">
                      Nome
                    </label>
                    <input
                      id="nome"
                      type="text"
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                      className="col-span-3 p-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="valor" className="text-right text-sm">
                      Valor
                    </label>
                    <input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={novoValor}
                      onChange={(e) => setNovoValor(e.target.value)}
                      className="col-span-3 p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  onClick={fecharModal}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={salvarEdicao}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}