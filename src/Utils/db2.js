const Datastore = require('nedb');
let db = new Datastore({ filename: 'path/to/nedb.db', autoload: true });

export function cadastrar(valores, event = null, eventTxt = null) {
  db.insert(valores, function (err, dados) {
    let msg = (err) ? 'Erro ao inserir documento' : 'Documento inserido com sucesso';
    let erro = (err) ? 1 : 0;
    let erroMsg = (err) ? err : '';
    console.log(msg, erro, erroMsg);
    if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg);
  });
}

export async function buscar(valores, event = null, eventTxt = null) {
  return new Promise((resolve, reject) => {
    db.find(valores, function (err, dados) {
      let msg = (err) ? 'Erro ao buscar documentos' : 'Documento buscado com sucesso';
      let erro = (err) ? 1 : 0;
      let erroMsg = (err) ? err : '';
      console.log(msg, erro, erroMsg);
      if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg);
      if (err) {
        reject(err);
      } else {
        resolve(dados);
      }
    });
  });
}

export function edicao(buscar, editar, multi = false, event = null, eventTxt = null) {
  db.update(buscar, editar, { multi: multi }, function (err, dados) {
    let msg = (err) ? 'Erro ao atualizar documentos' : 'Documento atualizados com sucesso';
    let erro = (err) ? 1 : 0;
    let erroMsg = (err) ? err : '';
    console.log(msg, erro, erroMsg);
    // if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg);
  });
}

export function remover(buscar, multi = false, event = null, eventTxt = null) {
  db.remove(buscar, {}, function (err, dados) {
    let msg = (err) ? 'Erro ao remover documentos' : 'Documento removidos com sucesso';
    let erro = (err) ? 1 : 0;
    let erroMsg = (err) ? err : '';
    console.log(msg, erro, erroMsg);
    // if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg);
  });
}

export function zerar() {
  db.remove({}, { multi: true }, function (err, numRemoved) {
    db.loadDatabase(function (err) { console.log('Banco Zerado') });
  });
}