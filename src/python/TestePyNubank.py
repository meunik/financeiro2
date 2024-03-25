from pynubank import Nubank, MockHttpClient

from datetime import datetime
import pandas as pd
import sys
from dateutil.relativedelta import relativedelta


cert = sys.argv[1]

# cpf = sys.argv[1]
# password = sys.argv[2]

nu = Nubank(MockHttpClient())
# nu = Nubank()
nu.authenticate_with_cert("16072234739", "K290605n", cert)
# nu.authenticate_with_cert("16072234739", "K290605n", "./teste/cert.p12")
print('------------------------------------------------------------------')
print('------------------------------------------------------------------')
print('------------------------------------------------------------------')
print('------------------------------------------------------------------')
print('------------------------------------------------------------------')
print('------------------------------------------------------------------')
print('------------------------------------------------------------------')
# print(nu.get_account_balance())

# A variável feed conterá a página atual com as transações
# feed = nu.get_account_feed_paginated()


# Lista de dicionários contendo todas as transações de seu cartão de crédito
# card_statements = nu.get_card_statements()
# print(card_statements)




# df['date'] = pd.to_datetime(df['date'])
# df.index = df.date
# df.groupby(pd.Grouper(freq='M')).sum().plot()


# ////////////////////////////////////////////////////////////

# Retorna um dicionário contendo os detalhes de uma transação retornada por get_card_statements()
# Contém as parcelas da transação
# card_statement_details = nu.get_card_statement_details(card_statements[0])
# print(card_statement_details)

# Soma de todas as compras
# print(sum([t['amount'] for t in card_statements]))

# Lista de dicionários contendo todas as faturas do seu cartão de crédito
# bills = nu.get_bills()
# print(bills)

# Retorna um dicionário contendo os detalhes de uma fatura retornada por get_bills()
# bill_details = nu.get_bill_details(bills[1])
# print(bill_details)