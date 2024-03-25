export function dinheiro(numero) {
  return "R$ " + numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export function modeda(numero) {
  return "R$ " + (numero / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
