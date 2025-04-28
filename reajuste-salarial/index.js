const express = require('express');
const app = express();

// Página inicial com instruções
app.get('/', (req, res) => {
    const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

    // Se não informar parâmetros, exibe instruções
    if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
        res.send(`
            <h1>Bem-vindo ao sistema de Reajuste Salarial</h1>
            <p>Para calcular o reajuste, adicione os seguintes parâmetros na URL:</p>
            <p><strong>Exemplo:</strong> <code>?idade=30&sexo=M&salario_base=2000&anoContratacao=2015&matricula=12345</code></p>
            <p>Parâmetros obrigatórios:</p>
            <ul>
                <li>idade (número > 16)</li>
                <li>sexo (M ou F)</li>
                <li>salario_base (número real)</li>
                <li>anoContratacao (número > 1960)</li>
                <li>matricula (número > 0)</li>
            </ul>
        `);
        return;
    }

    // Validações
    if (isNaN(idade) || idade <= 16) {
        res.send('Erro: Idade inválida. Deve ser maior que 16 anos.');
        return;
    }
    if (isNaN(salario_base) || salario_base <= 0) {
        res.send('Erro: Salário base inválido.');
        return;
    }
    if (isNaN(anoContratacao) || anoContratacao <= 1960) {
        res.send('Erro: Ano de contratação inválido. Deve ser maior que 1960.');
        return;
    }
    if (isNaN(matricula) || matricula <= 0) {
        res.send('Erro: Matrícula inválida. Deve ser um número maior que 0.');
        return;
    }

    // Conversão dos valores
    const idadeNum = parseInt(idade);
    const salarioBase = parseFloat(salario_base);
    const anoContratacaoNum = parseInt(anoContratacao);
    const matriculaNum = parseInt(matricula);

    // Definição de reajuste, desconto ou acréscimo
    let reajustePercentual = 0;
    let ajuste = 0;

    if (idadeNum >= 18 && idadeNum <= 39) {
        if (sexo === 'M') {
            reajustePercentual = 10;
            ajuste = (anoContratacaoNum <= (new Date().getFullYear() - 10)) ? 17 : -10;
        } else if (sexo === 'F') {
            reajustePercentual = 8;
            ajuste = (anoContratacaoNum <= (new Date().getFullYear() - 10)) ? 16 : -11;
        }
    } else if (idadeNum >= 40 && idadeNum <= 69) {
        if (sexo === 'M') {
            reajustePercentual = 8;
            ajuste = (anoContratacaoNum <= (new Date().getFullYear() - 10)) ? 15 : -5;
        } else if (sexo === 'F') {
            reajustePercentual = 10;
            ajuste = (anoContratacaoNum <= (new Date().getFullYear() - 10)) ? 14 : -7;
        }
    } else if (idadeNum >= 70 && idadeNum <= 99) {
        if (sexo === 'M') {
            reajustePercentual = 15;
            ajuste = (anoContratacaoNum <= (new Date().getFullYear() - 10)) ? 13 : -15;
        } else if (sexo === 'F') {
            reajustePercentual = 17;
            ajuste = (anoContratacaoNum <= (new Date().getFullYear() - 10)) ? 12 : -17;
        }
    } else {
        res.send('Erro: Faixa etária inválida para cálculo.');
        return;
    }

    // Cálculo final
    const salarioComReajuste = salarioBase + (salarioBase * reajustePercentual / 100) + ajuste;

    // Exibição dos dados
    res.send(`
        <h1>Reajuste Salarial Calculado</h1>
        <p><strong>Idade:</strong> ${idadeNum}</p>
        <p><strong>Sexo:</strong> ${sexo}</p>
        <p><strong>Salário Base:</strong> R$ ${salarioBase.toFixed(2)}</p>
        <p><strong>Ano de Contratação:</strong> ${anoContratacaoNum}</p>
        <p><strong>Matrícula:</strong> ${matriculaNum}</p>
        <h2>Salário Reajustado: <span style="color: green;">R$ ${salarioComReajuste.toFixed(2)}</span></h2>
    `);
});

// EXPORTA para a Vercel
module.exports = app;
