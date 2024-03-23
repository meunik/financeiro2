import sys
import os
import json

def save_cert(cert, caminho=None):
    name = 'teste2.p12' if caminho is None else caminho + 'teste2.p12'
    path = os.path.join(os.getcwd(), name)
    print(json.dumps(cert))
    # with open(path, 'w', encoding='utf-8') as f:
    #     json.dump(cert, f, ensure_ascii=False, indent=4)

def main(cpf, password, caminho=None):
    print('teste@email.com')
    code = input('')
    save_cert({"cpf":cpf, "password":password}, caminho)

    print('Certificates generated successfully. (cert.pem)')
    print('Warning, keep these certificates safe (Do not share or version in git)')

if __name__ == '__main__':
    cpf = sys.argv[1]
    password = sys.argv[2]
    caminho = sys.argv[3] if len(sys.argv) > 3 else None
    main(cpf, password, caminho)