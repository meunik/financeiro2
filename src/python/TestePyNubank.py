from pynubank import Nubank, MockHttpClient

from datetime import datetime
import pandas as pd
from dateutil.relativedelta import relativedelta

nu = Nubank(MockHttpClient())
# nu = Nubank()
nu.authenticate_with_cert("16072234739", "K290605n", "cert.p12")
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



no_of_months = 12  # Quantos meses para trás queremos obter os dados
yield_data = []
now = datetime.now()

# Obtem os dados dos ultimos 12 meses
for i in range(no_of_months):
    ref_date = datetime(now.year, now.month, 1) - relativedelta(months=i)
    yield_data.append({
        'date': ref_date.strftime('%Y-%m-%d'),
        'yield': nu.get_account_investments_yield(ref_date)
    })

    df = pd.DataFrame(yield_data)

print(yield_data)
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