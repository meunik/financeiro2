import sys

def main(cpf, password):
    print(cpf)
    print(password)

if __name__ == '__main__':
    cpf = sys.argv[1]
    password = sys.argv[2]
    main(cpf, password)