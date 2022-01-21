# BOT Iupi Digital

Desenvolvedor: Igor Gabriel Marques de Souza
E-mail: igor@cadenzatecnologia.com.br

Projeto de Inteligência Artificial HTTP para Telegram que realiza consultas internas no sistema do Iupi, controle de planos do usuário e pagamentos automáticos.

## 👨‍💻 Tech

#### Backend (API)
- Node
- MySQL
(Dependências diretas: bcrypt, puppeteer, node-telegram-api)
#### Frontend
- Não utilizei Frontend no projeto do bot.
##
### Começar

É necessário instalar na máquina o node.js antes de utilizar. O sistema funciona melhor em maquinas linux.

- [Node](https://nodejs.org/)

## Instalação
Dê um git clone neste repositório
### Clone
```git clone https://github.com/igorsouzadevbr/iupibot```

### Configure a database e link cron
Neste projeto, utilizei algumas variáveis internas de database e de uma página php que realiza o cronjob para verificar se o usuário tem pagamentos pendentes, e os realiza, caso tenha.

- Quer apenas testar?
Remova os scripts "verificaPlanos" e "verificaUser" do sistema.

## Executar o projeto manualmente

### NODE
O servidor está configurado para operar sozinho, apenas altere o token do bot, consiga o ID do chat e configure a database e funcionará ok.

Iniciando:

```
node ./index.js

# Certifique-se de instalar as dependências do servidor.

npm install #ou npm i
```






