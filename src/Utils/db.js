const Datastore = require('nedb');

/**
 * Manipular os bancos de dados
 * @opções_de_bancos ['nedb', 'arquvios']
 */
class Db {
  constructor(parametro) {
    this.db = new Datastore({ filename: `database/${parametro}.db`, autoload: true });
  }

  cadastrar({set = null, event = null, eventTxt = null, transportar = null}) {
    if (!set) return false;
    return new Promise((resolve, reject) => {
      this.db.insert(set, function (err, dados) {
        let msg = (err) ? 'Erro ao inserir documento' : 'Documento inserido com sucesso';
        let erro = (err) ? 1 : 0;
        let erroMsg = (err) ? err : '';
        console.log(msg, erro, erroMsg);
        if (eventTxt) event.reply(eventTxt, {dados, msg, erro, erroMsg, transportar});
        if (err) reject(err);
        else resolve(dados);
      });
    });
  }
  
  buscar({get = {}, event = null, eventTxt = null, transportar = null}) {
    return new Promise((resolve, reject) => {
      this.db.find(get, function (err, dados) {
        let msg = (err) ? 'Erro ao buscar documentos' : 'Documento buscado com sucesso';
        let erro = (err) ? 1 : 0;
        let erroMsg = (err) ? err : '';
        console.log(msg, erro, erroMsg);
        if (eventTxt) event.reply(eventTxt, {dados, msg, erro, erroMsg, transportar});
        if (err) reject(err);
        else resolve(dados);
      });
    });
  }
  
  edicao({get, set, multi = false, upsert = false, event = null, eventTxt = null, transportar = null}) {
    return new Promise((resolve, reject) => {
      this.db.update(get, { $set: set }, { multi: multi, upsert: upsert }, function (err, dados) {
        let msg = (err) ? 'Erro ao atualizar documentos' : 'Documento atualizados com sucesso';
        let erro = (err) ? 1 : 0;
        let erroMsg = (err) ? err : '';
        console.log(msg, erro, erroMsg);
        if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg, transportar);
        if (err) reject(err);
        else resolve(dados);
      });
    });
  }
  
  remover({get, multi = false, event = null, eventTxt = null, transportar = null}) {
    return new Promise((resolve, reject) => {
      this.db.remove(get, {}, function (err, dados) {
        let msg = (err) ? 'Erro ao remover documentos' : 'Documento removidos com sucesso';
        let erro = (err) ? 1 : 0;
        let erroMsg = (err) ? err : '';
        console.log(msg, erro, erroMsg);
        if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg, transportar);
        if (err) reject(err);
        else resolve(dados);
      });
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
  
  count({get = {}, event = null, eventTxt = null, transportar = null}) {
    return new Promise((resolve, reject) => {
      this.db.count(get, function(err, dados) {
        let msg = (err) ? 'Erro no count' : 'Count com sucesso';
        let erro = (err) ? 1 : 0;
        let erroMsg = (err) ? err : '';
        console.log(msg, erro, erroMsg);
        if (eventTxt) event.reply(eventTxt, dados, msg, erro, erroMsg, transportar);
        if (err) reject(err);
        else resolve(dados);
      });
    });
  }
}

module.exports = Db;