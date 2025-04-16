'use client';

import { useState, useEffect } from 'react';
import { Venda } from '@/types/index';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

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
      setVendas(JSON.parse(vendasSalvas));
    } else {
      setVendas(dadosIniciais);
      localStorage.setItem('vendas', JSON.stringify(dadosIniciais));
    }
  }, []);

  useEffect(() => {
    if (vendas.length > 0) {
      localStorage.setItem('vendas', JSON.stringify(vendas));
    }
  }, [vendas]);

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
        <Toaster position="top-right" />
          <CardTitle className="text-2xl">Listagem de Vendas</CardTitle>
          <Link href="/nova-venda">
            <Button className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Nova Venda
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Nome</TableHead>
                <TableHead className="text-center">Valor</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="text-center">{venda.id}</TableCell>
                  <TableCell className="text-center font-medium">{venda.nome}</TableCell>
                  <TableCell className="text-center">{formatarValor(venda.valor)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => abrirModalEditar(venda)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-600 hover:text-red-900 hover:border-red-900"
                        onClick={() => excluirVenda(venda.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onOpenChange={(open) => !open && fecharModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Venda</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">Nome</Label>
              <Input
                id="nome"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={salvarEdicao}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}