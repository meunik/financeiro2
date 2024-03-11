import re
import sys
import json

from PyPDF2 import PdfReader

def valorFloat(valor): return float(valor.replace('.', '').replace(',', '.'))

def valorTotal(leitorPdf):
    pagina = leitorPdf.pages[0]
    conteudo_pagina = pagina.extract_text()
    total = re.search(r"R\$ ([\d\.,]+)", conteudo_pagina)
    if total is not None: total = total.group(1)
    else: total = "Não encontrado"
    return total

def entradas(transacoes):
    entradas = 0
    for data, nome, valor in transacoes:
        if 'Pagamento' in nome or 'Estorno' in nome: 
            entradas += valorFloat(valor)
    return round(entradas, 2)

def saidas(transacoes):
    saidas = 0
    for data, nome, valor in transacoes:
        if not 'Pagamento' in nome or not 'Estorno' in nome: 
            saidas += valorFloat(valor)
    return round(saidas, 2)

def criaJson(pdf, total):
    transacoes = re.findall(r"\s*\n+(\d{2} \w{3})\s*\n+(.+?)\s*\n+([\d\.,]+)", pdf, re.DOTALL)

    dados = {
        "total": valorFloat(total),
        "transacoes": [
            {
                "nome": nome.strip(),
                "valor": valorFloat(valor),
                "data": data,
                "tipo": '1' if 'Pagamento' in nome or 'Estorno' in nome else '0'
            }
            for data, nome, valor in transacoes
        ],
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
        for i in range(numeroPaginas):
            pagina = leitorPdf.pages[i]
            conteudoPagina = pagina.extract_text()
            if 'TRANSAÇÕES' in conteudoPagina:
                posicaoTransacoes = conteudoPagina.index('VALORES EM R$')
                conteudoPagina = conteudoPagina[posicaoTransacoes:]
                textoTotal += conteudoPagina

        fatura = criaJson(textoTotal, total)
        print(fatura)


if __name__ == "__main__":
    arquivo = sys.argv[1]  # Pega o primeiro argumento da linha de comando
    dadosTabela(arquivo)