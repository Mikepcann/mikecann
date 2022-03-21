//store all of the forms/api links in an array of OBJ for easy access
let formsList = [
	{
		id: 'shortTermRental',
		searchForm: './forms/shortTermRentalForm.html',
		searchID: [
			{
				elementId: 'addressSTR',
				isText: true,
			},
			{
				elementId: 'businessLicenceNumberSTR',
				isText: true,
			},
			{
				elementId: 'licenseTypeSTR',
				isText: true,
			},
			{
				elementId: 'typeOfResidenceSTR',
				isText: true,
			},
		],
		api: 'https://data.calgary.ca/resource/gzkz-5k9a.json',
	},
	{
		id: 'secondarySuite',
		searchForm: './forms/secondarySuitesForm.html',
		searchID: [
			{
				elementId: 'addressSS',
				isText: true,
			},
			{
				elementId: 'communitySS',
				isText: true,
			},
			{
				elementId: 'stickerNumberSS',
				isText: false,
			},
			{
				elementId: 'wardSS',
				isText: false,
			},
		],
		api: 'https://data.calgary.ca/resource/jwn6-r58y.json',
	},
	{
		id: 'communityCrimeStats',
		searchForm: './forms/communityCrimeStatsForm.html',
		searchID: [
			{
				elementId: 'categoryCCS',
				isText: true,
			},
			{
				elementId: 'monthCCS',
				isText: true,
			},
			{
				elementId: 'sectorCCS',
				isText: true,
			},
			{
				elementId: 'yearCCS',
				isText: false,
			},
		],
		api: 'https://data.calgary.ca/resource/78gh-n26t.json',
	},
	{
		id: 'publicArt',
		searchForm: './forms/publicArtForm.html',
		searchID: [
			{
				elementId: 'addressPA',
				isText: true,
			},
			{
				elementId: 'artistPA',
				isText: true,
			},
			{
				elementId: 'tabNamePA',
				isText: true,
			},
			{
				elementId: 'titlePA',
				isText: true,
			},
		],
		api: 'https://data.calgary.ca/resource/2kp2-hsy7.json',
	},
]
let shortTermJSON = []
let secondarySuiteJSON = []
let communityCrimeStatJSON = []
let publicArtJSON = []
let currentSearch = ''
let displayTable = document.getElementById('displayTable')
/* Event listens added to the buttons  
 in order to load the forms
*/
window.onload = function attachListeners() {
	document
		.getElementById('shortTermRentalDisplay')
		.addEventListener('click', function () {
			document.getElementById('searchForm').style.display = 'block'
			loadXML(formsList[0], assignKeyups)
		})

	document
		.getElementById('secondarySuiteDisplay')
		.addEventListener('click', function () {
			document.getElementById('searchForm').style.display = 'block'
			loadXML(formsList[1], assignKeyups)
		})

	document
		.getElementById('communityCrimeDisplay')
		.addEventListener('click', function () {
			document.getElementById('searchForm').style.display = 'block'
			loadXML(formsList[2], assignKeyups)
		})
	document
		.getElementById('publicArtDisplay')
		.addEventListener('click', function () {
			document.getElementById('searchForm').style.display = 'block'
			loadXML(formsList[3], assignKeyups)
		})

	// load JSON Calls
	loadJSON(formsList[0])
	loadJSON(formsList[1])
	loadJSON(formsList[2])
	loadJSON(formsList[3])
}

// Loads the XML forms onto the page
function loadXML(fileAddress) {
	document.getElementById('searchForm').scrollIntoView({ behavior: 'smooth' })
	let xhr = new XMLHttpRequest()
	xhr.open('Get', fileAddress.searchForm, true)
	xhr.onload = function () {
		document.getElementById('searchForm').innerHTML = this.responseText
		assignKeyups(fileAddress.id, fileAddress.searchID)
	}
	xhr.send()
}
// load the JSON into the variables
function loadJSON(rawData) {
	let xhr = new XMLHttpRequest()
	xhr.open('GET', rawData.api, true)
	xhr.onload = function () {
		switch (rawData.id) {
			case 'shortTermRental':
				shortTermJSON = JSON.parse(xhr.responseText)
				break
			case 'secondarySuite':
				secondarySuiteJSON = JSON.parse(xhr.responseText)
				break
			case 'communityCrimeStats':
				communityCrimeStatJSON = JSON.parse(xhr.responseText)
				break
			case 'publicArt':
				publicArtJSON = JSON.parse(xhr.responseText)
				break
			default:
				console.error('ERROR LOADING JSON FILE')
				break
		}
	}
	xhr.send()
}

// add event listeners
function assignKeyups(searchForm, searchID) {
	switch (searchForm) {
		case 'shortTermRental':
			for (i = 0; i < searchID.length; i++) {
				let isText = searchID[i].isText
				let elementId = searchID[i].elementId
				document
					.getElementById(elementId)
					.addEventListener('keyup', function () {
						searchStringSTR(this.value, elementId)
					})
			}
			break
		case 'secondarySuite':
			for (i = 0; i < searchID.length; i++) {
				let isText = searchID[i].isText
				let elementId = searchID[i].elementId
				document
					.getElementById(elementId)
					.addEventListener('keyup', function () {
						searchStringSS(this.value, elementId)
					})
			}
			break
		case 'communityCrimeStats':
			for (i = 0; i < searchID.length; i++) {
				let isText = searchID[i].isText
				let elementId = searchID[i].elementId
				document
					.getElementById(elementId)
					.addEventListener('keyup', function () {
						searchStringCCS(this.value, elementId)
					})
			}
			break
		case 'publicArt':
			for (i = 0; i < searchID.length; i++) {
				let isText = searchID[i].isText
				let elementId = searchID[i].elementId
				document
					.getElementById(elementId)
					.addEventListener('keyup', function () {
						searchStringPA(this.value, elementId)
					})
			}
			break
		default:
			console.error('NO MATCH')
	}
}

/**
 *Search functions for short term rentals
 *
 */
function searchStringSTR(str, id) {
	clearTable()
	str = str.toLowerCase()
	let property = ''
	let tablehead = `<thead class ="table"> 
        <td>Row</td>
        <td>Address</td>
        <td>Business Licence Number</td>
        <td>Licence Type</td>
        <td>Type Of Residence</td>
        <td>Map Link</td>
        </thead>`

	switch (id) {
		case 'addressSTR':
			property = 'address'
			break
		case 'businessLicenceNumberSTR':
			property = 'business_licence_number'
			break
		case 'licenseTypeSTR':
			property = 'business_licence_type'
			break
		case 'typeOfResidenceSTR':
			property = 'type_of_residence'
			break
		default:
			console.error('ERROR')
			break
	}

	for (i = 0; i < shortTermJSON.length; i++) {
		// used if the property does no exist on a record
		if (shortTermJSON[i][`${property}`] == undefined) {
			continue
		}
		if (shortTermJSON[i][`${property}`].toLowerCase().startsWith(str)) {
			tablehead += `<tr class="table">
                <td>${i + 1}</td>
            <td>${shortTermJSON[i].address}</td>
            <td>${shortTermJSON[i].business_licence_number}</td>
            <td>${shortTermJSON[i].business_licence_type}</td>
            <td>${shortTermJSON[i].type_of_residence}</td>
            <td>${createMap(
				shortTermJSON[i].latitude,
				shortTermJSON[i].longitude
			)}</td>
        </tr>`
		}
	}
	displayTable.innerHTML = tablehead
}

/**
 *Search functions for Secondary Suites
 *
 */
function searchStringSS(str, id) {
	clearTable()
	str = str.toLowerCase()
	let property = ''
	let tablehead = `<thead class ="table"> 
        <td>Row</td>
        <td>Address</td>
        <td>Community</td>
        <td>Sticker Number</td>
        <td>Ward</td>
        <td>Map Link</td>
        </thead>`

	switch (id) {
		case 'addressSS':
			property = 'address'
			break
		case 'communitySS':
			property = 'community'
			break
		case 'stickerNumberSS':
			property = 'stickernumber'
			break
		case 'wardSS':
			property = 'ward'
			break
		default:
			console.error('ERROR')
			break
	}

	for (i = 0; i < secondarySuiteJSON.length; i++) {
		// used if the property does no exist on a record
		if (secondarySuiteJSON[i][`${property}`] == undefined) {
			continue
		}
		if (
			secondarySuiteJSON[i][`${property}`].toLowerCase().startsWith(str)
		) {
			tablehead += `<tr class="table">
                <td>${i + 1}</td>
            <td>${secondarySuiteJSON[i].address}</td>
            <td>${secondarySuiteJSON[i].community}</td>
            <td>${secondarySuiteJSON[i].stickernumber}</td>
            <td>${secondarySuiteJSON[i].ward}</td>
            <td>${createMap(
				secondarySuiteJSON[i].latitude,
				secondarySuiteJSON[i].longitude
			)}</td>
        </tr>`
		}
	}
	displayTable.innerHTML = tablehead
}

/**
 *Search functions for Community Crim stats
 *
 */
function searchStringCCS(str, id) {
	clearTable()
	str = str.toLowerCase()
	let property = ''
	let tablehead = `<thead class ="table"> 
        <td>Row</td>
        <td>Category</td>
        <td>Month</td>
        <td>Sector</td>
        <td>Year</td>
        <td>Map Link</td>
        </thead>`

	switch (id) {
		case 'categoryCCS':
			property = 'category'
			break
		case 'monthCCS':
			property = 'month'
			break
		case 'sectorCCS':
			property = 'sector'
			break
		case 'yearCCS':
			property = 'year'
			break
		default:
			console.error('ERROR')
			break
	}

	for (i = 0; i < communityCrimeStatJSON.length; i++) {
		// used if the property does no exist on a record
		if (communityCrimeStatJSON[i][`${property}`] == undefined) {
			continue
		}
		if (
			communityCrimeStatJSON[i][`${property}`]
				.toLowerCase()
				.startsWith(str)
		) {
			tablehead += `<tr class="table">
                <td>${i + 1}</td>
            <td>${communityCrimeStatJSON[i].category}</td>
            <td>${communityCrimeStatJSON[i].month}</td>
            <td>${communityCrimeStatJSON[i].sector}</td>
            <td>${communityCrimeStatJSON[i].year}</td>
            <td>${createMap(
				communityCrimeStatJSON[i].latitude,
				secondarySuiteJSON[i].longitude
			)}</td>
        </tr>`
		}
	}
	displayTable.innerHTML = tablehead
}

/**
 *Search functions for Public Art
 *
 */
function searchStringPA(str, id) {
	clearTable()
	str = str.toLowerCase()
	let property = ''
	let tablehead = `<thead class ="table"> 
        <td>Row</td>
        <td>Address</td>
        <td>Artist</td>
        <td>Tab Name</td>
        <td>Title</td>
        <td>Map Link</td>
        </thead>`

	switch (id) {
		case 'addressPA':
			property = 'address'
			break
		case 'artistPA':
			property = 'artist'
			break
		case 'tabNamePA':
			property = 'tab_name'
			break
		case 'titlePA':
			property = 'title'
			break
		default:
			console.error('ERROR')
			break
	}

	for (i = 0; i < publicArtJSON.length; i++) {
		// used if the property does no exist on a record
		if (publicArtJSON[i][`${property}`] == undefined) {
			continue
		}
		if (publicArtJSON[i][`${property}`].toLowerCase().startsWith(str)) {
			tablehead += `<tr class="table">
                <td>${i + 1}</td>
            <td>${publicArtJSON[i].address}</td>
            <td>${publicArtJSON[i].artist}</td>
            <td>${publicArtJSON[i].tab_name}</td>
            <td>${publicArtJSON[i].title}</td>
            <td>${createMap(
				publicArtJSON[i].latitude,
				publicArtJSON[i].longitude
			)}</td>
        </tr>`
		}
	}
	displayTable.innerHTML = tablehead
}

// creates a string used to move to a google maps link
const createMap = (lat, long) =>
	`<a href= "https://www.google.com/maps/search/?api=1&query=${lat},${long}" target="_blank">Google Maps</A>`

// clears table when changing fields
function clearTable() {
	displayTable.innerHTML = ''
}
