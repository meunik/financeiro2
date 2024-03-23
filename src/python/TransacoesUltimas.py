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

feed = nu.get_account_feed_paginated()
with open(f'{caminhoArquivo}.json', 'w', encoding='utf-8') as f: json.dump(feed, f)
