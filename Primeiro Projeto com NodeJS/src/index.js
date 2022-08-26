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
app.post("/account", (req, res) => {
    //Recebe o nome do usuário no corpo da requisição. 
    const nameUser = req.body;
    //Recebe o CPF do usuário no corpo da requisição. 
    const cpfUser = req.body;

    /**
     * Poderia ser feito utilizando a desestruturação:
     * const { nameUser, cpfUser = req.body}
     */

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
        statement: []
    })

    //O status 201 deve ser retornado sempre que houver a criação de novas informações.
    return res.status(201).send();
});

app.listen(8080, console.log("Aplicação rodando na porta: 8080."));
