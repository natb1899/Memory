const cards = document.querySelectorAll(".card");

//Ausgabe der Liste aller vorhandenen Karten in der Konsole
console.log(cards);

let matchedCard = 0;

let count = 0;
let counterDisplay = document.querySelector(".counter");

let points = 0;
let pointsDisplay = document.querySelector(".points");

let cardOne, cardTwo;
let disableDeck = false;

//Methode um die beiden Karten zu vergleichen
function matchCards(card1, card2) {
    count++;
    counterDisplay.innerHTML = count.toString();
    //console.log(count);

    if(card1 === card2) {
        points = points + 50;
        pointsDisplay.innerHTML = points.toString();

        matchedCard++;
        console.log("karten passen")

        if(matchedCard == 8) {
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }

        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);

        cardOne = cardTwo = "";

        return disableDeck = false;
    } else {
        points = points - 25;
        pointsDisplay.innerHTML = points.toString();

        console.log("karten passen nicht")

        //Verzögerung hinzufügen, damit die shake animation nicht zu früh ausgeführt wird.
        setTimeout(() => {
            //wenn Karten nicht passen, der Karte die Klasse "shake" hinzufügen
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400); //400ms

        //Verzögerung hinzufügen, um die karten wieder umzudrehen, weil sie nicht passen
        setTimeout(() => {
            //löschen der Klassen shake und flip, damit man wieder in der normalen Ausgangslage ist
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");

            //Beide Karten-Werte wieder auf 0 setzen
            cardOne = cardTwo = "";
            disableDeck = false;
        }, 1200); //1.2s
    }
    //console.log(card1, card2);
}


//Methode um die Karte umzukehren beim Klicken
function flipCard(c) {
    //console.log(c.target);
    let clicked = c.target; //speichert die angeklickte Karte in eine Variable

    //so wird nur ein Klick gewertet
    if(clicked !== cardOne && !disableDeck) {
        clicked.classList.add("flip"); //fügt der angeklickten Karte die Klasse flip hinzu.

        //gibt Karte nur zurück, wenn zweite Karte angeklickt ist
        if(!cardOne) {
            return cardOne = clicked;
        }
        cardTwo = clicked;
        disableDeck = true;
        //console.log(card1, card2);

        let card1Img = cardOne.querySelector("img").src,
            card2Img = cardTwo.querySelector("img").src;

        matchCards(card1Img, card2Img);
    }
}

function shuffleCard() {
    matchedCard = 0;
    cardOne = cardTwo = "";
    cards.forEach(card => {
        card.classList.remove("flip");
    });
}

//Durch iterieren der Liste
cards.forEach(card => {

    //Hinzufügen eines "EventListeners" beim Klicken für jede Karte
    card.addEventListener("click", flipCard);

    //Anzeigen der einzelnen Karten in der Konsole
    //console.log(card);
});