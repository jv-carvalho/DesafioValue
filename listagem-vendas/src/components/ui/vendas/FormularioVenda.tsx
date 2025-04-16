'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Venda } from '@/types/index';
import toast, { Toaster } from 'react-hot-toast';

export default function FormularioVenda() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!nome.trim() || !valor.trim()) {
      toast.error('Por favor, preencha todos os campos');
      setIsSubmitting(false);
      return;
    }

    try {
      const vendasSalvas = localStorage.getItem('vendas');
      let vendas: Venda[] = [];
      
      if (vendasSalvas) {
        vendas = JSON.parse(vendasSalvas);
      }

      let novoId = "1";
      if (vendas.length > 0) {
        const idsNumericos = vendas.map(v => parseInt(v.id)).filter(id => !isNaN(id));
        const maiorId = idsNumericos.length > 0 ? Math.max(...idsNumericos) : 0;
        novoId = (maiorId + 1).toString();
      }

      const novaVenda: Venda = {
        id: novoId,
        nome: nome.trim(),
        valor: parseFloat(valor)
      };

      vendas.push(novaVenda);
      
      localStorage.setItem('vendas', JSON.stringify(vendas));
      
      console.log('Venda adicionada:', novaVenda);
      console.log('Total de vendas:', vendas.length);
      console.log('Vendas no localStorage:', JSON.stringify(vendas));

      toast.success('Salvo com sucesso!');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      toast.error('Ocorreu um erro ao salvar a venda');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6">Nova Venda</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
            Valor
          </label>
          <input
            id="valor"
            type="number"
            step="0.01"
            min="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.push('/')}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}