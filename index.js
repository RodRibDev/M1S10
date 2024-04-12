const express = require("express");
const app = express();
const PORT = 3000;

let produtos = [];
let proximoId = 1;

app.use(express.json());

const logMetodoURLHora = (req, res, next) => {
    const horaAtual = new Date().toISOString();
    console.log(`[${horaAtual}] Nova solicitação recebida para: ${req.method} ${req.originalUrl}`);
    next();
};
app.use(logMetodoURLHora);

app.post('/produtos', (req, res) => {
    const { nome, preco, descricao } = req.body;

    if (!nome || typeof preco !== 'number' || !descricao) {
        return res.status(400).json({ error: 'Dados inválidos para o produto.' });
    }

    const novoProduto = {
        id: proximoId,
        nome,
        preco,
        descricao
    };

    produtos.push(novoProduto);
    proximoId++;

    res.status(201).json(novoProduto);
});

app.get('/produtos', (req, res) => {
    res.json(produtos);
});

app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const produto = produtos.find(p => p.id === parseInt(id));

    if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json(produto);
});

app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;

    // Encontra o índice do produto na lista de produtos
    const index = produtos.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Atualiza os dados completos do produto com os novos dados fornecidos
    produtos[index] = {
        id: parseInt(id),
        nome: nome || produtos[index].nome,
        preco: typeof preco === 'number' ? preco : produtos[index].preco,
        descricao: descricao || produtos[index].descricao
    };

    res.status(200).json({ message: 'Produto atualizado com sucesso.', updatedProduct: produtos[index] });
});


app.patch('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;

    const index = produtos.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    if (nome) {
        produtos[index].nome = nome;
    }
    if (preco) {
        produtos[index].preco = preco;
    }
    if (descricao) {
        produtos[index].descricao = descricao;
    }

    res.status(200).json({ message: 'Produto atualizado parcialmente com sucesso.', updatedProduct: produtos[index] });
});

app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;

    const index = produtos.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const removedProduct = produtos.splice(index, 1);

    res.status(200).json({ message: 'Produto removido com sucesso.', removedProduct });
});

app.options('*', (req, res) => {
    res.set('Allow', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.status(200).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});