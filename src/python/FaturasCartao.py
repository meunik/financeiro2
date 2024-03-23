import sys
import json
from pynubank import Nubank, MockHttpClient

# python FaturasCartao.py "../../public/cert.p12" 16072234739 123456 "../../database/json/nubank/FaturasCartao.json"

cert = sys.argv[1]
cpf = sys.argv[2]
password = sys.argv[3]
caminhoArquivo = sys.argv[4]

nu = Nubank(MockHttpClient())
# nu = Nubank()
nu.authenticate_with_cert(cpf, password, cert)

bills = nu.get_bills()
with open(f'{caminhoArquivo}.json', 'w', encoding='utf-8') as f: json.dump(bills, f)
