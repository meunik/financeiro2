export function dinheiro(numero) {
  return "R$ " + numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export function moeda(numero) {
  return "R$ " + (numero / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}
