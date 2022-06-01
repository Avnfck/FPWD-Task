const express = require('express')
const { urlencoded, json } = require('body-parser')
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(req.params.questionId)
  res.json(question)
})

app.post('/questions', async (req, res) => {
  const question = await {
    id: uuidv4(),
    author: faker.name.findName(),
    summary: `${faker.random.words(5)}?`,
    answers:[]
  }

  await req.repositories.questionRepo.addQuestion(question)
  res.json(await req.repositories.questionRepo.getQuestions())
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(req.params.questionId)
  res.json(answers)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const answer = await {
    id: uuidv4(),
    author: faker.name.findName(),
    summary: `${faker.random.words(4)}.`,
  }

  await req.repositories.questionRepo.addAnswer(req.params.questionId, answer)
  res.json(await req.repositories.questionRepo.getQuestionById(req.params.questionId))
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const answer = await req.repositories.questionRepo.getAnswer(req.params.questionId, req.params.answerId)
  res.json(answer)
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
