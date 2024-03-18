const Datastore = require('nedb');

/**
 * Manipular os bancos de dados
 * @opções_de_bancos ['nedb', 'arquvios']
 */
class Db {
  constructor(parametro) {
    this.db = new Datastore({ filename: `path/to/${parametro}.db`, autoload: true });
  }

  cadastrar(valores, event = null, eventTxt = null) {
    this.db.insert(valores, function (err, dados) {
      let msg = (err) ? 'Erro ao inserir documento' : 'Documento inserido com sucesso';
      let erro = (err) ? 1 : 0;
      let erroMsg = (err) ? err : '';
      console.log(msg, erro, erroMsg);
      if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg);
    });
  }
  
  buscar(valores, event = null, eventTxt = null) {
    return new Promise((resolve, reject) => {
      this.db.find(valores, function (err, dados) {
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
  
  edicao(buscar, editar, multi = false, event = null, eventTxt = null) {
    this.db.update(buscar, editar, { multi: multi }, function (err, dados) {
      let msg = (err) ? 'Erro ao atualizar documentos' : 'Documento atualizados com sucesso';
      let erro = (err) ? 1 : 0;
      let erroMsg = (err) ? err : '';
      console.log(msg, erro, erroMsg);
      if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg);
    });
  }
  
  remover(buscar, multi = false, event = null, eventTxt = null) {
    this.db.remove(buscar, {}, function (err, dados) {
      let msg = (err) ? 'Erro ao remover documentos' : 'Documento removidos com sucesso';
      let erro = (err) ? 1 : 0;
      let erroMsg = (err) ? err : '';
      console.log(msg, erro, erroMsg);
      if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg);
    });
  }
  
  zerar(db='') {
    return new Promise((resolve, reject) => {
      this.db.remove({}, { multi: true }, (err, numRemoved) => {
        this.db.loadDatabase((err) => { 
          if (err) {
            console.error('Erro ao zerar o banco:', err);
            reject(err);
          } else {
            console.log(`Banco '${db}' Zerado`);
            resolve();
          }
        });
      });
    });
  }
}

module.exports = Db;