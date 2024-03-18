# -*- coding: utf-8 -*-

import re
import sys
import json
from datetime import datetime

from PyPDF2 import PdfReader

nomesEstornos = ['Estorno', 'Crédito', 'Credito', 'Desconto']
nomesEntradas = ['Pagamento'] + nomesEstornos

def formataData(dataStr):
    meses = {"JAN":1,"FEV":2,"MAR":3,"ABR":4,"MAI":5,"JUN":6,"JUL":7,"AGO":8,"SET":9,"OUT":10,"NOV":11,"DEZ":12}
    dia, mes, ano = dataStr.split()
    mes = meses[mes]
    data = datetime(int(ano), mes, int(dia))
    dataFormatada = data.strftime("%Y-%m-%d")
    return dataFormatada 

def valorFloat(valor): return float(valor.replace('.', '').replace(',', '.'))

def valorTotal(leitorPdf):
    pagina = leitorPdf.pages[0]
    conteudo_pagina = pagina.extract_text()
    total = re.search(r"R\$ ([\d\.,]+)", conteudo_pagina)
    if total is not None: total = total.group(1)
    else: total = "Não encontrado"
    return total

def pagamentos(transacoes):
    pagamentos = 0
    for data, nome, valor in transacoes:
        if 'Pagamento' in nome: pagamentos += valorFloat(valor)
    return round(pagamentos, 2)

def estornos(transacoes):
    global nomesEstornos
    estornos = 0
    for data, nome, valor in transacoes:
        if any(nomeEntrada in nome for nomeEntrada in nomesEstornos): estornos += valorFloat(valor)
    return round(estornos, 2)

def entradas(transacoes):
    global nomesEntradas
    entradas = 0
    for data, nome, valor in transacoes:
        if any(nomeEntrada in nome for nomeEntrada in nomesEntradas): entradas += valorFloat(valor)
    return round(entradas, 2)

def saidas(transacoes):
    global nomesEntradas
    saidas = 0
    for data, nome, valor in transacoes:
        if any(nomeEntrada in nome for nomeEntrada in nomesEntradas): continue
        else: saidas += valorFloat(valor)
    return round(saidas, 2)

def criaJson(pdf, total, textoTotal):
    global nomesEntradas
    vencimento = re.findall(r"vencimento: (\d{2} \w{3} \d{4})\s*\n+", textoTotal, re.DOTALL)
    transacoes = re.findall(r"\s*\n+(\d{2} \w{3})\s*\n+(.+?)\s*\n+([\d\.,]+)", pdf, re.DOTALL)

    dados = {
        "total": valorFloat(total),
        "vencimento": formataData(vencimento[0]),
        "transacoes": [
            {
                "nome": nome.strip(),
                "valor": valorFloat(valor),
                "data": data,
                "tipo": '1' if any(nomeEntrada in nome for nomeEntrada in nomesEntradas) else '0'
            }
            for data, nome, valor in transacoes
        ],
        "pagamentos": pagamentos(transacoes),
        "estornos": estornos(transacoes),
        "entradas": entradas(transacoes),
        "saidas": saidas(transacoes)
    }

    return json.dumps(dados, indent=4, ensure_ascii=False)


def dadosTabela(arquivo):
    with open(arquivo, "rb") as arquivoPdf:
        leitorPdf = PdfReader(arquivoPdf)
        total = valorTotal(leitorPdf)
        numeroPaginas = len(leitorPdf.pages)
        textoTotal = ""
        textoFatura = ""
        for i in range(numeroPaginas):
            pagina = leitorPdf.pages[i]
            conteudoPagina = pagina.extract_text()
            textoTotal += conteudoPagina
            if 'TRANSAÇÕES' in conteudoPagina:
                posicaoTransacoes = conteudoPagina.index('VALORES EM R$')
                conteudoPagina = conteudoPagina[posicaoTransacoes:]
                textoFatura += conteudoPagina

        fatura = criaJson(textoFatura, total, textoTotal)
        print(fatura)


if __name__ == "__main__":
    arquivo = sys.argv[1]  # Pega o primeiro argumento da linha de comando
    dadosTabela(arquivo)