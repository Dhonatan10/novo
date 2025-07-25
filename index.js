const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/aulas", async (req, res) => {
  const { tema, publico_alvo = "Alunos", duracao = "45 minutos", detalhes } = req.body;
  let prompt = `Crie um plano de aula para o tema '${tema}', público-alvo '${publico_alvo}', com duração de ${duracao}. `;
  if (detalhes) prompt += `Detalhes adicionais: ${detalhes}.`;
  prompt += "\nPor favor, escreva o plano de forma clara e organizada.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });
    const texto = completion.choices[0].message.content.trim();
    res.json({ plano_de_aula: texto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/provas", async (req, res) => {
  const { disciplina, nivel = "Médio", quantidade_questoes = 10 } = req.body;
  const prompt = `Crie uma prova de ${quantidade_questoes} questões para a disciplina '${disciplina}' de nível ${nivel}. Inclua perguntas variadas e claras.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });
    const texto = completion.choices[0].message.content.trim();
    res.json({ prova_gerada: texto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/assistente", async (req, res) => {
  const { pergunta, contexto } = req.body;
  let prompt = `Responda a pergunta de forma clara e objetiva:\nPergunta: ${pergunta}`;
  if (contexto) prompt = `Contexto: ${contexto}\n` + prompt;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });
    const resposta = completion.choices[0].message.content.trim();
    res.json({ resposta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/quizzes", async (req, res) => {
  const { tema, numero_perguntas = 5 } = req.body;
  const prompt = `Crie um quiz educativo e divertido com ${numero_perguntas} perguntas sobre o tema '${tema}'. Forneça as perguntas com opções de múltipla escolha e destaque a resposta correta.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.6,
    });
    const quiz_texto = completion.choices[0].message.content.trim();
    res.json({ quiz: quiz_texto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/cursos", (req, res) => {
  const cursos = [
    { id: 1, titulo: "Técnicas de Ensino Modernas", descricao: "Curso online para inovar suas aulas." },
    { id: 2, titulo: "Uso da IA na Educação", descricao: "Aprenda a integrar inteligência artificial nas aulas." },
    { id: 3, titulo: "Psicologia Educacional Básica", descricao: "Compreenda o comportamento dos alunos." },
    { id: 4, titulo: "Didática para Professores Iniciantes", descricao: "Fundamentos para planejar aulas eficazes." }
  ];
  res.json({ cursos });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));