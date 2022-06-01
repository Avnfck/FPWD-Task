const { readFile, writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  
  test('should return a single question', async () => {
    const questions = await questionRepo.getQuestions()

    expect(await questionRepo.getQuestionById(questions[0].id)).toMatchObject(questions[0])
  })

  test('should add question to testQuestions and return list of n-th testQuestions + 1', async () => {
    let questions = await questionRepo.getQuestions()
    const newQuestion = [
      {
        id: faker.datatype.uuid(),
        summary: `${faker.random.words(5)}?`,
        author: faker.name.findName(),
        answers: []
      }
    ]
    const newQuestions = await questionRepo.addQuestion(newQuestion)
    questions = newQuestions

    expect(await questions).toHaveLength(3)
  })

  test('should add answer to questionId provided', async () => {
    let questions = await questionRepo.getQuestions()
    const newAnswer = {
      id: faker.datatype.uuid(),
      author: faker.name.findName(),
      summary: `${faker.random.words(4)}.`,
    }
    const newQuestions = await questionRepo.addAnswer(questions[0].id, newAnswer)
    questions = newQuestions

    expect(await questions[0].answers).toHaveLength(1)
  })

  test('shoudl return all answers for questionId provided', async () => {
    const questions = await questionRepo.getQuestions()

    expect(await questionRepo.getAnswers(questions[0].id)).toMatchObject(questions[0].answers)
    expect(await questionRepo.getAnswers(questions[0].id)).toHaveLength(1)
  })

  test('', async () => {
    const questions = await questionRepo.getQuestions()

    expect(await questionRepo.getAnswer(questions[0].id, questions[0].answers[0].id)).toMatchObject(questions[0].answers[0])
  })

})
