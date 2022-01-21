/*
REVISÃO DE CÓDIGO & COMMENT - DEVOPS - 17/01 - 03:10
Engenheiro de Software: Igor S. <igor@cadenzatecnologia.com.br>

Situação: Ok.
Linguagem: Typescript Node.JS, 
Frameworks/Depends: node-telegram-bot-api, uuid, bcrypt, jquery, jsdom, axios


Data Início: 05/01
Data Finalização: 06/01
PROJETO: BOT P/ PROJETO IUPI DIGITAL - SIGILOSO
*/

//OS DADOS FORAM PROTEGIDOS PARA EVITAR MAIORES PROBLEMAS. SE QUISER TESTAR, SIGA O README.

//api do telegram em node.js
const TelegramBot = require('node-telegram-bot-api');

//token do bot
const token = 'token';

//dependências para buscar página web cron
const axios = require('axios');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

//utilizar polling no bot para evitar desligamentos inesperados, funciona perfeitamente em AWS, GCP & Azure
var opt = {polling:true};
const bot = new TelegramBot(token, opt);


//Configuração padrão do BOT, código gerado pelo TelegramAPI.
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});



//Banco de dados MySQL, para realizar mudança para Postgre ou afins é simples, o MySQL foi escolha do cliente.
var mysql = require('mysql');



//Dados conexão SQL - DADOS REMOVIDOS (SEGURANÇA DO CLIENTE)
var con = mysql.createConnection({
  host: "host",
  user: "user",
  password: "pass",
  database: "db"
});


//Se ocorrer erro de polling da API, retorna no console.
bot.on("polling_error", console.log);


//Conexão SQL
con.connect(function(err) {
  if (err) throw err;
  console.log("Conectado na base de dados.");

  
});


//VERIFICAR PLANOS - SEÇÃO MODIFICADA PARA SEGURANÇA

//Utilizei o puppeteer para simular uma pessoa abrindo o navegador
const puppeteer = require('puppeteer');

//Função para verificar planos a cada 2 segundos (tempo de testes, ajuste de acordo com o poder de processamento da máquina. 3 em 3 minutos (recomendado))
function verificaPlanos() {

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.cronjob.para.verificar/acessoSigiloso');
  
    await browser.close();
  })();
}
setInterval(verificaPlanos, 2000);
//

//Função que verifica se o plano do usuário está pago, e logo após o retira do grupo, caso não esteja.
function verificaUser() {
  con.query("SELECT * FROM table WHERE plan='0' and telegramid!='0'", function(err, res){
    if (err) throw err;
    if (res.length ==0) {
      return;
    }
    var iduser = res[0].telegramid;
    //ID DO CHAT DO GRUPO
    var chatid = "-1001509298155";
    bot.kickChatMember(chatid, iduser);
    bot.sendMessage(chatid, "O usuário @" + res[0].telegramdata + " não é mais assinante do Iupi e foi kickado do grupo.");
    con.query("UPDATE table SET plan='2' WHERE telegramdata='" + res[0].telegramdata +"'", function(err, res){
      if (err) throw err;
    });
  });
}
//verifica de 15 em 15 segundos. Ajuste de acordo com o seu banco de dados.
setInterval(verificaUser, 15000);


//Função para detectar novos usuários e ver se ele está com o plano ativo, se não estiver, o bane/kika do grupo.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  //id do chat
  if (msg.chat.id == "-1001509298155") { 
    //FILTRO


   //Novos membros 
  if (msg.new_chat_members != undefined) {
    var usuario = msg.new_chat_member.username;
    const chatId2 = msg.chat.id;
    var id = msg.new_chat_member.id;
    console.log(usuario);
    con.query("SELECT * FROM table WHERE telegramdata='" + usuario +  "' and plan='1'", function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        bot.kickChatMember(chatId2, id);
        bot.sendMessage(chatId2, "O usuário @" + msg.new_chat_member.username + " não é assinante Iupi e foi kickado do grupo.");
        bot.unbanChatMember(chatId2, id);
        return;
      }
     
      bot.sendMessage(chatId2, "O usuário @" + msg.new_chat_member.username + " é um novo integrante, vamos dar as boas vindas!");
      console.log(result);
      con.query("UPDATE table SET telegramid='" + id + "', isOnTelegram='1' WHERE telegramdata='" + usuario +"'", function(erro, res){
        if (erro) throw erro;
        console.log("Usuário alterado!");
      });
    });
}
  

  }else {
    //mensagens fora do grupo, apenas retorna erro.
    bot.sendMessage(chatId, 'Eu não respondo conversas fora do grupo oficial do Iupi.\nAcesse: www.iupi.digital');
}

});