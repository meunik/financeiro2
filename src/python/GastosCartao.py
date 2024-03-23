import sys
import json
from pynubank import Nubank, MockHttpClient

# python GastosCartao.py "../../public/cert.p12" 16072234739 123456 "../../database/json/nubank/GastosCartao.json"

cert = sys.argv[1]
cpf = sys.argv[2]
password = sys.argv[3]
caminhoArquivo = sys.argv[4]

nu = Nubank(MockHttpClient())
# nu = Nubank()
nu.authenticate_with_cert(cpf, password, cert)
gastos = nu.get_card_statements()
with open(caminhoArquivo, 'w', encoding='utf-8') as f: json.dump(gastos, f)