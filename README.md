# API Coleta

## Sobre

Código fonte do projeto de API Restful de Coleta desenvolvido durante o 
<a href="https://www.youtube.com/playlist?list=PLE0DHiXlN_qp251xWxdb_stPj98y1auhc">Mini Curso de NodeJS e TypeScript</a> 
do <a href="https://github.com/aluiziodeveloper/">@aluiziodeveloper</a>.

## Requerimentos

* NodeJS 14.16+
* NPM 6.14+
* Algum REST client (ex: <a href="https://www.postman.com/product/rest-client/">Postman</a>)

## Executando

Para executar o projeto localmente basta seguir os seguintes passos:

1. Realizar o clone do repositório usando o git:
```
git clone https://github.com/nivaldomcj/coleta-api-typescript.git
```
2. Instalar as bibliotecas do projeto com o npm:
```
npm install
```
3. Executar as migrações do banco de dados:
```
npm run knex:migrate
npm run knex:seed
```
4. Executar o ambiente de desenvolvimento local:
```
npm run dev
```
