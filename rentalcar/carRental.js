/**
 * Web App to process Car Rentals for
 * "Dodgey Brakes Car Rental"
 */

// storage for client list
let clientArr = [];
let currentClient = {};

const loadClients = () => {
    //Load JSON
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './rentalclients.json', true);

    xhr.onload = () => {
        clientArr = JSON.parse(xhr.responseText)
    }
    xhr.send();
}

// On page Load, call this method to load all of the 
window.onload = loadClients;

// attach keyUP listener
document.getElementById('lastNameSearch').addEventListener('keyup', function() {
    searchList(this.value)
})

const searchList = (lName) => {
    // clears the list 
    document.getElementById('resultList').innerHTML = '';
    let matches = [];

    //checks the list for a matching name
    clientArr.forEach((item) => {
        if (item.last_name.toLowerCase().startsWith(lName.toLowerCase())) {
            matches.push(`<li>${item.first_name} ${item.last_name}</l1>`)
        }
    })

    // display the clients in the text box
    matches.forEach((item) => {
        document.getElementById('resultList').innerHTML += item;
    })

    // once selected enable the next form
    let listItems = document.querySelectorAll('li');
    listItems.forEach((item) => {
        item.addEventListener('click', function() {
            findCurrentClientOBJ(item.innerHTML)
            location.href = "#compactSelector";
            enableForm();
        })
    })


}

// used to display the num of days for a rental
document.getElementById('rentalDayValue').addEventListener('change', function() {
    displayNum(this.value)
})

function displayNum(days) {
    document.querySelector('.rentalDayDisplay').innerHTML = days;
}
let enableForm = () => {
    // allow selectors to be used
    document.getElementById('compactSelector').disabled = false;
    document.getElementById('midSizedtSelector').disabled = false;
    document.getElementById('luxurySelector').disabled = false;
    document.getElementById('vanTruckSelector').disabled = false;
    document.getElementById('roofRack').disabled = false;
    document.getElementById('GPS').disabled = false;
    document.getElementById('childSeat').disabled = false;
    document.getElementById('rentalDayValue').disabled = false;
    document.getElementById('finishOrder').disabled = false;

    // add eventListeners to pictures
    document.querySelector('[src="./img/compact.jpg"]').addEventListener('click', () => {
        document.getElementById('compactSelector').checked = true;
    })
    document.querySelector('[src="./img/midsized.jpg"]').addEventListener('click', () => {
        document.getElementById('midSizedtSelector').checked = true;
    })
    document.querySelector('[src="./img/luxury.jpg"]').addEventListener('click', () => {
        document.getElementById('luxurySelector').checked = true;
    })
    document.querySelector('[src="./img/vanTruck.jpg"]').addEventListener('click', () => {
        document.getElementById('vanTruckSelector').checked = true;
    })

}

// Saves the client info in an global var
function findCurrentClientOBJ(fullName) {
    let full = fullName.split(' ');
    currentClient.fName = full[0];
    currentClient.lName = full[1];

    for (i = 0; i < clientArr.length; i++) {
        if ((currentClient.fName == clientArr[i].first_name) &&
            (currentClient.lName == clientArr[i].last_name)) {
            currentClient.info = clientArr[i];
        }
    }
}
// when button is clicked, the results will be displayed
function finishOrder() {
    // show the block
    let order = document.querySelector('.order');
    order.style.display = 'block';

    // get values of selectors
    let carType = document.querySelector('input[type="radio"]:checked').value.split(' ');

    let rentalOptions = document.querySelectorAll('input[type="checkbox"]:checked');
    let numOfDays = document.getElementById('rentalDayValue').value;
    let pickedOptions = [];
    let carRentalTotal = numOfDays * parseInt(carType[1]);
    let roofRackTotal = 0;
    let gpsTotal = 0;
    let childSeatTotal = 0;
    let optionsTable = '';
    let finalRentalPrice = 0;
    // adds selected items to an Array


    // self invoking function
    (function load() {
        for (i = 0; i < rentalOptions.length; i++) {
            pickedOptions.push(rentalOptions[i].value)
        }
    })();
    // move through list
    // figure out what the item is
    // calculate cost
    // add table for options
    //display final total price

    let tableValues =
        `<h3>Car Rental for</h3>
    <h4>${currentClient.info.first_name} ${currentClient.info.last_name}</h4>
    <p>${currentClient.info.address}, ${currentClient.info.state_prov}
        <br>${currentClient.info.email}
        <br>${currentClient.info.phone}
    </p>
    <table class="table">
        <tr>
            <th>Car Type</th>
            <th>Price Per Day</th>
        </tr>
        <tr>
            <td>${carType[0]}</td>
            <td>$${carType[1]}/Day</td>
        </tr>
        <tr>
            <th>Number Of Days</th>
            <th>Total Price Per Days</th>
        </tr>
        <tr>
            <td>${numOfDays}</td>
            <td>$${carRentalTotal.toFixed(2)}</td>
        </tr>`;
    console.log('Car rental total before Function: ' + typeof carRentalTotal);
    (function formatOptionTable() {
            optionsTable +=
                ` <tr>
            <th>Option</th>
            <th>Price</th>
            </tr>`;
            for (i = 0; i < pickedOptions.length; i++) {
                if (pickedOptions[i].startsWith('Roof Rack or Bicycle Rack')) {
                    roofRackTotal = (5 * numOfDays);
                    let rRow =
                        `<tr>
                        <td>${pickedOptions[i]}</td>
                        <td>$${roofRackTotal.toFixed(2)}</td>
                    </tr>`;
                    console.log('roof rack total ' + typeof roofRackTotal)
                    optionsTable += rRow;
                } else if (pickedOptions[i].startsWith('GPS')) {
                    gpsTotal = 10;
                    let gpsRow = `<tr>
                <td>${pickedOptions[i]}</td>
                <td>$${gpsTotal.toFixed(2)}</td>
            </tr>`;
                    console.log('gps ' + typeof gpsTotal)
                    optionsTable += gpsRow;
                } else if (pickedOptions[i].startsWith('Child Seat')) {
                    let csRow = `<tr>
                <td>${pickedOptions[i]}</td>
                <td>$${childSeatTotal.toFixed(2)}</td>
            </tr>`;
                    console.log('child seat' + typeof childSeatTotal)
                    optionsTable += csRow;
                }
            }

            if (!pickedOptions.length == 0) {
                order.innerHTML += optionsTable;
                tableValues += optionsTable
            }
        }

    )()

    finalRentalPrice = carRentalTotal + childSeatTotal + gpsTotal + roofRackTotal;
    tableValues +=
        `<tr><th colspan="2">FINAL RENTAL PRICE</th></tr>
        <tr><td></td><td>$${finalRentalPrice.toFixed(2)}</td></tr></table>`;
    order.innerHTML = tableValues;



}
