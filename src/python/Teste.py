import sys
from colorama import init, Fore, Style
import time
from getpass import getpass

def log(message, color=Fore.BLUE):
    print(f'[*] {message}')

def main(cpf, password):

    # print(f'[>] Enter your CPF(Numbers only): ')
    # print('[>] Enter your password (Used on the app/website): ')

    # cpf = input(f'[>] Enter your CPF(Numbers only): ')
    # password = getpass('[>] Enter your password (Used on the app/website): ')
    print(cpf)
    print(password)

    # log('Requesting e-mail code')

    # email = 'teste@email.com'

    # log(f'Email sent to {email}')

    # time.sleep(2)
    # print('teste.asdasdasd@hotmail.com')
    # print('')

    # code = input('[>] Type the code received by email: ')
    # code = input('')

    # print('Certificates generated successfully. (cert.pem)')
    # print('Warning, keep these certificates safe (Do not share or version in git)')


if __name__ == '__main__':
    cpf = sys.argv[1]
    password = sys.argv[2]
    main(cpf, password)