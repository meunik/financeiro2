export function dinheiro(numero) {
  return "R$ " + numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}