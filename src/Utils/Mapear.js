const fs = require('fs');
const path = require('path');

export function listarArquivos(caminho) {
  let arvore = [];
  const nomes = fs.readdirSync(caminho);

  for (let nome of nomes) {
    if (nome.startsWith('.')) continue;
    let caminhoCompleto = path.join(caminho, nome);
    let stat = fs.statSync(caminhoCompleto);

    if (stat.isFile()) {
      let extensao = path.extname(caminhoCompleto).slice(1);
      if (extensao == 'ini') continue;
      arvore.push({
        "name": nome,
        "type": "arquivo",
        "path": caminhoCompleto,
        "caminho": caminhoCompleto,
        "file": extensao
      });
    } else {
      arvore.push({
        "name": nome,
        "type": "pasta",
        "caminho": caminhoCompleto,
        "children": listarArquivos(caminhoCompleto)
      });
    }

    // if (nome === '2022-12.jpg') break;
  }

  return arvore;
}

let caminhoPasta = "E:\\OneDrive\\Financeiro";
