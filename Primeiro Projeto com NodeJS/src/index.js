const { response } = require("express");
const express = require("express");
const app = express();

//Permite o uso de JSON
app.use(express.json());
//Importanto a biblioteca do UUID na V4 - Que utiliza números randômicos e será a responsável por criar o id de cada usuário.
const {v4: uuidV4} = require("uuid");

//Array responsável por armazenar todas as informações dos nossos usuários. 
const users = [];
/**
 * Para criarmos dados, devemos utlizar o post.
 * A conta deverá conter: 
 * Name: String
 * idUser: UUID
 * cpfUser: String
 * statement: Array
 */

/**
 * Vamos utilizar o conceito de Middlewares para criar funções que cuidarão de etapas intermediárias da nossa aplicação.
 * Para uma função ser considerada um middleware, ela deve receber três parâmetros: Req, Res, Next
 * Formas de uso:
 * app.use(verifyIfExistsCPF); -> Utilizamos um middleware assim quando queremos que todas as rotas após ele o utilizem. 
 * app.get("statement", verifyIfExistsCPF, (req, res) => {
 * }) -> Utilizamos dentro da rota, quando desejamos que apenas ela utilize as informações que o middleware possui. 
 * Por exemplo:
 * Verificar se existe uma conta associada ao CPF
 */

//MIDDLEWARE
function verifyIfExistsAccountCPF(req, res, next) {
    //Pega o CPF do usuário, que foi enviado pelo Header.
    const { cpfUser } = req.headers;
    /**
     * Vamos utilizar o método Find, ao invés do Some para fazer a comparação do CPF. 
     * Pois o Some retorna um boolean, enquanto o Find retorna o objeto.
     * Ou seja, o método Find percorrerá o Array e, caso encontre, retornará o objeto solicitado.
     */
    const user = users.find((user) => user.cpfUser === cpfUser); 
    /**
     * Caso o usuário não existir, esta informação deverá ser apresentada.
     */
    if (!user) {
        return res.status(400).json({ error: "User not found"}); 
    }

    //Exporta informações do middleware
    req.user = user;

    return next();
}


app.post("/account", (req, res) => {
    const { nameUser, cpfUser } = req.body;
    /**
     * Poderia ser feito da seguinte maneira:
     * 
     * Recebe o nome do usuário no corpo da requisição. 
     * const nameUser = req.body;
     * Recebe o CPF do usuário no corpo da requisição. 
     * const cpfUser = req.body;
     */

    /**
     * Antes de cadastrar o usuário devemos verificar se o CPF já existe ou não no banco de dados.
     * Aqui, fazemos uma busca dentro do Array de usuários, para verificar se existe lá dentro algum CPF idêntico ao CPF que foi informado pelo usuário. 
     */
    const cpfUserAlreadyExists = users.some(
        (user) => user.cpfUser === cpfUser 
    ); 

    /**
     * Como o retorno do método some é um boolean, podemos utilizar isso para definir o fluxo da nossa aplicação. 
     * Caso o usuário já exista, retornaremos uma mensagem de erro. 
     * Caso contrário, vamos seguir com o processo de cadastro. 
     */
    if (cpfUserAlreadyExists) {
        return res.status(400).json({error: "User already exists!"})
    } else {
        /**
         * Para criar o ID do usuário, basta chamar a função uuidV4()
         */
        const idUser = uuidV4();

        /**
         * Como não estamos utilizando banco de dados, nossas informações serão armazenadas num array, para fins de testes. 
         */

        /**Inserindo as informações no array */
        users.push({
            cpfUser,
            nameUser,
            idUser,
            statement: [],
        });

        //O status 201 deve ser retornado sempre que houver a criação de novas informações.
        return res.status(201).send();
    }
});

/**
 * Buscando as informações do extrato bancário do cliente
 * app.get("/statement/:cpfUser", (req, res) => {
 *  const { cpfUser } = req.params
 * });
 * 
 * Esta seria uma forma de receber o valor do CPF do cliente, utilizando Rote Params, mas ela não é segura, pois expõe uma informação confidencial do cliente.
 * * É necessário converter o valor que recebemos na URL pois ele é armazenado como string e não como Number, o que impediria a verificação de "extritamente igual". 
 */
app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
    //Importa as informações do middleware
    const { user } = req;
    /**
     * Uma vez que o objeto foi encontrado, vamos retornar seu extrato bancário. 
     */
    return res.json(user.statement);
})

app.listen(8080, console.log("Aplicação rodando na porta: 8080."));
