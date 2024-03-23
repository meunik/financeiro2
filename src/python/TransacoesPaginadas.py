import sys
import json
from pynubank import Nubank, MockHttpClient

# python TransacoesPaginadas.py "../../public/cert.p12" 16072234739 123456 "../../database/json/nubank/transacoes/Transacao"

cert = sys.argv[1]
cpf = sys.argv[2]
password = sys.argv[3]
caminhoArquivo = sys.argv[4]
cursor = sys.argv[5] if len(sys.argv) > 5 else False

# nu = Nubank(MockHttpClient())
nu = Nubank()
nu.authenticate_with_cert(cpf, password, cert)
feed = nu.get_account_feed_paginated(cursor) if cursor else nu.get_account_feed_paginated()
print(json.dumps(feed))
