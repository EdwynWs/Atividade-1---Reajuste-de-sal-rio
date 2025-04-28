const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Página inicial: mostra instruções
app.get('/', (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  // Se não enviou parâmetros, mostrar instruções
  if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
    res.send(`
      <h1>Calculadora de Reajuste Salarial</h1>
      <p>Para calcular o reajuste do seu salário, informe os dados na URL no seguinte formato:</p>
      <code>https://seusite.vercel.app/?idade=30&sexo=F&salario_base=2500&anoContratacao=2010&matricula=12345</code>
      <p><strong>Regras:</strong></p>
      <ul>
        <li>A idade deve ser maior que 16 anos.</li>
        <li>O salário base deve ser um número real válido.</li>
        <li>O ano de contratação deve ser maior que 1960.</li>
        <li>A matrícula deve ser um número inteiro maior que zero.</li>
      </ul>
    `);
    return;
  }

  // Validações
  if (isNaN(idade) || idade <= 16) {
    return res.send('<h2>Idade inválida. Deve ser maior que 16 anos.</h2>');
  }
  if (isNaN(parseFloat(salario_base))) {
    return res.send('<h2>Salário base inválido. Deve ser um número real.</h2>');
  }
  if (isNaN(anoContratacao) || anoContratacao <= 1960) {
    return res.send('<h2>Ano de contratação inválido. Deve ser maior que 1960.</h2>');
  }
  if (isNaN(matricula) || matricula <= 0) {
    return res.send('<h2>Matrícula inválida. Deve ser maior que zero.</h2>');
  }

  // Cálculo do reajuste
  let percentualReajuste = 0;
  let adicional = 0;

  const idadeNum = parseInt(idade);
  const salarioNum = parseFloat(salario_base);
  const anoNum = parseInt(anoContratacao);

  if (idadeNum >= 18 && idadeNum <= 39) {
    percentualReajuste = sexo.toUpperCase() === 'M' ? 0.10 : 0.11;
    adicional = (2025 - anoNum) <= 10 ? -10 : 17;
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    percentualReajuste = sexo.toUpperCase() === 'M' ? 0.08 : 0.09;
    adicional = (2025 - anoNum) <= 10 ? -5 : 15;
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    percentualReajuste = sexo.toUpperCase() === 'M' ? 0.15 : 0.17;
    adicional = (2025 - anoNum) <= 10 ? -7 : 12;
  } else {
    return res.send('<h2>Faixa etária não suportada para cálculo de reajuste.</h2>');
  }

  const salarioReajustado = (salarioNum * (1 + percentualReajuste)) + adicional;

  // Resposta HTML
  res.send(`
    <h1>Resultado do Reajuste Salarial</h1>
    <p><strong>Idade:</strong> ${idadeNum} anos</p>
    <p><strong>Sexo:</strong> ${sexo.toUpperCase()}</p>
    <p><strong>Salário Base:</strong> R$ ${salarioNum.toFixed(2)}</p>
    <p><strong>Ano de Contratação:</strong> ${anoNum}</p>
    <p><strong>Matrícula:</strong> ${matricula}</p>
    <hr>
    <h2>Salário Reajustado: <span style="color:green;">R$ ${salarioReajustado.toFixed(2)}</span></h2>
  `);
});

module.exports = app;

