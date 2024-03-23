import sys
import json
from pynubank import Nubank, MockHttpClient

# python TransacoesPaginadas.py "../../public/cert.p12" 16072234739 123456 "../../database/json/nubank/transacoes/Transacao" "true"

cert = sys.argv[1]
cpf = sys.argv[2]
password = sys.argv[3]
caminhoArquivo = sys.argv[4]

nu = Nubank(MockHttpClient())
# nu = Nubank()
nu.authenticate_with_cert(cpf, password, cert)

proxPag = True
pageNumero = 1
cursor = None

dados = []
while proxPag:
    feed = nu.get_account_feed_paginated(cursor)
    dados.append(feed)

    proxPag = feed['pageInfo']['hasNextPage']
    cursor = feed['edges'][-1]['cursor']
    pageNumero += 1
    if (pageNumero > 10) or (not proxPag): break

with open(f'{caminhoArquivo}.json', 'w', encoding='utf-8') as f: json.dump(dados, f)
