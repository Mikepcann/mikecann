const loadQuiz = () => {
	let xhr = new XMLHttpRequest()
	xhr.onload = () => {
		displayQuestions(xhr)
	}
	xhr.open('GET', './FinalQuiz.xml', true)
	xhr.send()
}
let answers = []
window.onload = loadQuiz

const displayQuestions = (xml) => {
	let xmlDoc = xml.responseXML
	let form = document.getElementById('quizForm')
	let questions = xmlDoc.getElementsByTagName('question')
	answers = xmlDoc
		.getElementsByTagName('rightanswers')[0]
		.childNodes[0].nodeValue.split(',')
	let table = ''

	for (i = 0; i < questions.length; i++) {
		table += `   <h4>Question ${
			questions[i].getElementsByTagName('qnumber')[0].childNodes[0]
				.nodeValue
		}</h4>
                <p>${
					questions[i].getElementsByTagName('qtitle')[0].childNodes[0]
						.nodeValue
				}</p>   
                <input type="radio" id="q${i + 1}_1" name="q${i + 1}" value="a">
                <label for="q${i + 1}_1">A) ${
			questions[i].getElementsByTagName('a')[0].childNodes[0].nodeValue
		}</label> 
                <br>
                <input type="radio" id="q${i + 1}_2" name="q${i + 1}" value="b">
                <label for="q${i + 1}_2">B) ${
			questions[i].getElementsByTagName('b')[0].childNodes[0].nodeValue
		}</label>
                <br>
                <input type="radio" id="q${i + 1}_3" name="q${i + 1}" value="c">
                <label for="q${i + 1}_3">C) ${
			questions[i].getElementsByTagName('c')[0].childNodes[0].nodeValue
		}</label>
                <br>
                <input type="radio" id="q${i + 1}_4" name="q${i + 1}" value="d">
                <label for="q${i + 1}_4">D) ${
			questions[i].getElementsByTagName('d')[0].childNodes[0].nodeValue
		}</label>
                <br>`
	}
	form.innerHTML = table
}

const checkResults = () => {
	let quizLength = 5
	let numOfAnswers = 4
	let userAnswer = [] // Store user answers
	console.log(`Clicked the check button`)

	// Collect answers from the user
	for (i = 1; i <= quizLength; i++) {
		for (j = 1; j <= numOfAnswers; j++) {
			if (document.getElementById(`q${i}_${j}`).checked) {
				userAnswer.push(document.getElementById(`q${i}_${j}`).value)
			}
		}
	}
	let correct = 0
	for (i = 0; i < quizLength; i++) {
		userAnswer[i] === answers[i]
			? console.log('correct' + correct++)
			: console.log(`incorrect`)
	}
	document.getElementById(
		'displayResults'
	).innerHTML = `<h3>You got ${correct}/${quizLength} Correct!\n${
		(correct / quizLength) * 100
	}%</h3> <button type="button" class="btn btn-warning" onclick="location.reload() ">Reset Test</button>`
	if (correct < quizLength) {
		giveFeedback(userAnswer, quizLength)
	}
}

const giveFeedback = (userAnswer, quizLength) => {
	// step 1. turn user selected red

	console.log('User answers: ')
	console.log(userAnswer)
	console.log('Correct answers: ')
	console.log(answers)
	let result = []

	for (i = 0; i < quizLength; i++) {
		if (userAnswer[i] === answers[i]) {
			result.push(true)
		} else {
			result.push(false)
			let wrong = document.querySelector(
				`label[for="q${i + 1}_${returnNumber(userAnswer[i])}"]`
			)
			wrong.style.color = 'red'
			wrong.style.fontWeight = 'bold'
		}
	}
	// step 2. turn correct green
	let qNum = 1
	let iterator = 0
	result.forEach(() => {
		let right = document.querySelector(
			'label[for="q' + qNum + '_' + returnNumber(answers[iterator]) + '"]'
		)
		right.style.color = 'green'
		right.style.fontWeight = 'bold'
		qNum++
		iterator++
	})
}

const returnNumber = (value = 'a') => {
	switch (value) {
		case 'a':
			return 1
		case 'b':
			return 2
		case 'c':
			return 3
		case 'd':
			return 4
		default:
			console.error(`THERE WAS AN ERROR!!! ${value}`)
			break
	}
}
