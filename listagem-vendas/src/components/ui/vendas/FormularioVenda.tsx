'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Venda } from '@/types/index';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";

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
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
        <Toaster position="top-right" />
          <CardTitle className="text-2xl">Nova Venda</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}