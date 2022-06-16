//DOMContentLoaded - der Browser hat HTML vollständig geladen,
//aber externe Ressourcen wie Bilder <img> und Stylesheets wurden möglicherweise noch nicht geladen.
document.addEventListener('DOMContentLoaded', () => {

    let cardsList = [];
    let cardPairs = 0;

    const grid = document.querySelector('.playground');
    const attemptsHolder = document.querySelector('.attemptsHolder');
    const pointsHolder = document.querySelector('.pointsHolder');

    const timerView = document.querySelector('.timerView');
    const attemptsView = document.querySelector('.attemptsView');
    const pointView = document.querySelector('.pointView');

    let character = document.getElementById("character");

    let timer = document.querySelector(".timer");
    const bossCage = document.getElementById('bossCage');

    let tries = 0;
    let foundCards = 0;
    let points = 0;

    pointsHolder.textContent = points.toString();

    let chosenCards = [];
    let chosenCardsIds = [];

    let countInterval;
    let healthBarInterval;
    let heartFallingInterval;

    let numberOfFlips = 0;

    let mode;
    let mode_settings;

    let kartenRückseiteBild;
    let card;
    let audio;

    let x = 0;
    let y = 0;

    //Gibt das aktuelle Level aus dem localstorage zurück
    const level = localStorage.getItem("level");

    //Holt alle Level Einstellungen und Bilder aus der .json Datei
    fetch('../json/data.json')
        .then(data => data.json())
        .then(json => initPlayground(json, level));

    //Erstellt das "Spielbrett"
    function initPlayground(json, level) {

        //Setzt die richtige Einstellung für das jeweilige Level
        let levelSettings = json.levels[level];
        setLevelSettings(levelSettings);

        //Setzt das richtige Grid für die Anzahl Karten, die im Spiel sind.
        grid.style.setProperty('grid-template-columns', 'repeat(' + (cardsList.length / 4) + ', 1fr)');

        //Die Memorykarten werden erstellt
        for (let i = 0; i < cardsList.length; i++) {
            //HTML-Element <img> wird erstellt
            card = document.createElement('img');
            //Dem Element <img> wird die richtige Rückseite der Karten hinzugefügt
            card.setAttribute('src', 'img/memory/' + kartenRückseiteBild);
            //Setzt der Karte eine ID, um später die richtige Karte in dem Array zu finden.
            card.setAttribute('data-id', i.toString());
            //EventListener um die Karte umzudrehen
            card.addEventListener('click', flipCard);
            //Dem "Spielbrett" die Memorykarte hinzufügen
            grid.appendChild(card);
        }

        //Ausblenden des Cursors beim Level f1
        if(mode === 'f1'){
            document.querySelectorAll("img").forEach(function(item){
                item.style.cursor = "none";
                item.style.userSelect = "none";
            });
        }
    }

    //Setzt die Einstellungen für die gewissen Levels
    function setLevelSettings(levelSettings) {
        mode = levelSettings.mode;
        mode_settings = levelSettings.mode_settings;

        //Speichert die Bilder in das Array
        cardsList = levelSettings.bild;
        //Sortiert das Array nach Zufall, dass das Memory nicht jedes Mal gleich ist
        cardsList.sort(() => 0.5 - Math.random());

        cardPairs = cardsList.length / 2;

        switch (mode){
            case 'time': {
                //Setzen der Rückseite der Memory-Karte
                kartenRückseiteBild = "ball.png"

                timer.textContent = mode_settings;

                //Alle nicht gebrauchten HTML-Elemente in diesem Level ausblenden
                attemptsView.remove();
                bossCage.remove();
                character.remove();

                //Background-Sound
                audio = new Audio('sound/wakaWaka.mp3');
                audio.playbackRate = 1.25
                audio.volume = 0.1
                audio.loop = true
                audio.play();
                break;
            }
            case 'tries': {
                //Setzen der Rückseite der Memory-Karte
                kartenRückseiteBild = "Pokeball.jpg"

                tries = mode_settings;

                attemptsHolder.textContent = mode_settings;

                //Alle nicht gebrauchten HTML-Elemente in diesem Level ausblenden
                timerView.remove();
                bossCage.remove();
                character.remove();

                //Background-Sound
                audio = new Audio('sound/Pokemon.mp3');
                audio.volume = 0.1
                audio.loop = true
                audio.play();
                break;
            }
            case 'mario': {
                //Setzen der Rückseite der Memory-Karte
                kartenRückseiteBild = "fragezeichen.png"

                timer.textContent = mode_settings;

                //Alle nicht gebrauchten HTML-Elemente in diesem Level ausblenden
                attemptsView.remove();
                character.remove();

                //Background Sounds
                audio = new Audio('sound/marioStart.mp3');
                audio.volume = 0.4
                audio.play();
                audio = new Audio('sound/SuperMarioMusic.mp3');
                audio.volume = 0.1
                audio.loop = true
                audio.currentTime = 0
                audio.play();
                break;
            }
            case 'f1': {
                //Setzen der Rückseite der Memory-Karte
                kartenRückseiteBild = "f1street.png"

                timer.textContent = mode_settings;

//              grid.style.cursor = "none";
//              grid.style.gap = "25px";
//              grid.style.gridTemplateColumns = "repeat(3, 1fr)";

                //Zeigt bevor man das Memory spielen kann, die Regeln und die Spielsteuerung für das Level an.
                popup("infos", 'Please use the keys w,a,s,d to move the car forward.\r\n To flip the cards, use the space bar.\r\n You need to find the teammates, not the same driver twice!', 'back to start', 'index.html');

                //Alle nicht gebrauchten HTML-Elemente in diesem Level ausblenden
                attemptsView.remove();
                pointView.remove();
                bossCage.remove();

                //Background Sound
                audio = new Audio('sound/F1.mp3');
                audio.volume = 0.1
                audio.loop = true
                audio.currentTime = 0
                audio.play()
                break;
            }
        }
    }

    function flipCard() {
        numberOfFlips++;

        if(numberOfFlips === 1){
            switch(mode){
                case "time": {
                    //Startet den Countdown, wenn die erste Karte gedreht worden ist
                    countdown(mode_settings-1, timer);
                    break;
                }
                case "mario": {
                    //Startet den Countdown, wenn die erste Karte gedreht worden ist
                    countdown(mode_settings-1, timer);

                    //Startet die Abnahme vom Lebensbalken von Peach
                    healthBarInterval = setInterval(healthBar, 2000);

                    //Startet das "herablassen" der Liebesherzen für Peach
                    heartFallingInterval = setInterval(fallingHearts, 3000);
                    break;
                }
                case "f1": {
                    //Startet den Timer, wenn die erste Karte gedreht worden ist
                    f1timer(document.querySelector(".timer"));
                    break;
                }
            }
        }

        //Wenn noch nicht zwei Karten umgedreht worden sind
        if(chosenCards.length !== 2) {
            //Holt die ID der ausgewählten/umgedrehten Memorykarte
            let cardId = this.getAttribute('data-id');
            //Speichert dank der ID den "Namen" der Karte um später die Karten vergleichen zu können.
            chosenCards.push(cardsList[cardId].name);
            chosenCardsIds.push(cardId);
            //Wenn die Karte umgedreht ist, kann man sie nicht mehr anklicken
            this.style.pointerEvents = "none";
            //Setzt der umgedrehten Karte das richtige Bild
            this.setAttribute('src', cardsList[cardId].image);
        }

        //Wenn zwei Karten umgedreht sind, wird gecheckt, ob es die gleichen Karten sind.
        if(chosenCards.length === 2) {
            setTimeout(checkForMatch, 400);
        }
    }

    function checkForMatch() {
        //Speichert alle <img>-Elemente der HTML-Seite in eine Variable.
        let cards = document.querySelectorAll('img');

        //Holt die ID der ersten und zweiten umgedrehten Karte
        let firstCard = chosenCardsIds[0];
        let secondCard = chosenCardsIds[1];

        if(mode === "tries") {
            attempts();
        }

        //Vergleicht die beiden Namen der Karten
        if(chosenCards[0] === chosenCards[1]) {
            foundCards++;
            //Wenn die Namen identisch sind, werden die Punkte erhöht
            if(mode !== "f1"){
                points = points + 50;
            }
        } else {
            //Wenn die Namen nicht identisch sind, werden Punkte weggenommen.
            if(mode !== "f1"){
                points = points - 25;
            }

            //Wenn die Karten nicht übereinstimmen, wird wieder die Rückseite der Karten eingeblendet
            cards[firstCard].setAttribute('src', 'img/memory/' + kartenRückseiteBild);
            cards[secondCard].setAttribute('src', 'img/memory/' + kartenRückseiteBild);

            //Es wird ein Shake-Effekt via CSS hinzugefügt
            cards[firstCard].classList.add("shake");
            cards[secondCard].classList.add("shake");

            //Verzögerung hinzufügen, um die karten wieder umzudrehen, weil sie nicht passen
            setTimeout(() => {
                //löschen der Klassen shake und flip, damit man wieder in der normalen Ausgangslage ist
                cards[firstCard].classList.remove("shake");
                cards[secondCard].classList.remove("shake");
            }, 400); //0.4s

            //Die Karten können wieder angeklickt werden
            cards[firstCard].style.pointerEvents = "auto"
            cards[secondCard].style.pointerEvents = "auto"
        }

        //Die Arrays werden wieder auf 0 gesetzt.
        chosenCards = [];
        chosenCardsIds = [];

        //Die neuen Punkte und Züge werden aktualisiert
        attemptsHolder.textContent = tries.toString();
        pointsHolder.textContent = points.toString();

        //Wenn die gefundenen Karten gleich sind, wie die Anzahl Karten im Spiel, ist das Spiel beendet
        if(foundCards === cardPairs) {
            //wird der Countdown oder Timer gestoppt
            clearInterval(countInterval);

            if(mode === "mario"){
                clearInterval(healthBarInterval);
                clearInterval(heartFallingInterval);
            }

            //Die Punkte berechnen
            countPoints();

            //Punkte werden dem localstorage hinzugefügt
            addPointsToLevel(localStorage.getItem("level"), points);

            //Damit das richtige Pop-up-Fenster erscheint, werden zuerst überfällige Klassennamen entfernt
            document.getElementById("modal-bild").classList.remove("made");
            document.getElementById("modal-bild").classList.remove("infos");
            document.getElementById("modal-bild").classList.remove("error");

            //Das Popup für das erfolgreiche Abschliessen des Levels wird angezeigt
            popup("made",'Yeah, the level was completed.\r\nTry again or go to the next level.', 'back to levels', 'level.html', points);

            //Background Sound beenden und Win-Sound abspielen
            audio.pause()
            audio.currentTime = 0;
            audio = new Audio('sound/marioWin.mp3');
            audio.volume = 0.4
            audio.play()
        }
    }

    //Punkteberechnung für das Level f1 anhand der gebrauchten Zeit.
    function countPoints() {
        if(mode === 'f1'){
            let timeCounter = timer.textContent;
            points = Math.round(15000/timeCounter);
        }
        if(mode === 'time'){
            let countdownCounter = timer.textContent;
            points += countdownCounter * 50;
        }
        if(mode === 'mario'){
            let countdownCounter = timer.textContent;
            points += countdownCounter * 25;
        }
        if(mode === 'tries'){
            points += tries * 50;
        }
    }

    function addPointsToLevel(level, points) {
        // abrufen der Daten des Level (oder ein leeres Array erstellen, wenn noch keine Informationen gespeichert sind)
        let items = JSON.parse(localStorage.getItem('levels')) || [];

        //Holt die korrekten Daten aus dem gespielten Level
        let item = items.find(item => item.level === level);

        // nur neue Daten hinzufügen, wenn noch keine Daten im Level sind
        if (item) {
            if(item.points < points){
                item.points = points;
            }
        } else {
            items.push({
                level,
                points
            })
        }

        // Punkte wieder im localstorage speichern
        localStorage.setItem('levels', JSON.stringify(items));
    }

    function attempts() {
        tries = tries - 1;
        //Wenn keine verfügbaren Züge mehr, dann Fehler Pop-up-Fenster anzeigen
        if(tries === 0) {
            if(cardPairs > 0){
                popup("error", 'Sorry, the level was not completed.\r\nTry again or return to the home page.', 'back to start', 'index.html', points);

                // Background Sounf beenden und Loose-Sound abspielen
                audio.pause()
                audio.currentTime = 0
                audio = new Audio('sound/marioLoose.mp3');
                audio.volume = 0.4
                audio.play()
            }
        }
    }

    function countdown(duration, element){
        let secondsRemaining = duration;

        //Jede Sekunde wird eins minus gezählt
        countInterval = setInterval(() => {
            element.textContent = secondsRemaining;
            secondsRemaining = secondsRemaining - 1

            if (0 > secondsRemaining) {
                //Countdown wird gestoppt
                clearInterval(countInterval);

                //Pop-up-Fenster erscheint
                popup("error", 'Sorry, the level was not completed.\r\nTry again or return to the home page.', 'back to start', 'index.html', points);

                // Background Sound beenden und Loose-Sound abspielen
                audio.pause()
                audio.currentTime = 0
                audio = new Audio('sound/marioLoose.mp3');
                audio.volume = 0.4
                audio.play()

                document.querySelector("body").style.pointerEvents = 'none';
            }

        }, 1000);
    }

    function popup(status, content, secondText, secondLink, points) {
        let modal = document.getElementById("myModal");

        let modalContent = document.getElementById("modal-bild");
        modalContent.classList.add(status);

        let contentPopUp = document.getElementById("contentPopUp");
        contentPopUp.textContent = content;

        let modalPoints = document.getElementById("modal-points");
        modalPoints.textContent = points + " Points";

        if(status === "infos"){
            let btnPopUp = document.getElementById("btnPopUp");
            btnPopUp.style.pointerEvents= "auto";
            btnPopUp.textContent = "start";
            btnPopUp.onclick = function() { modal.style.display = "none" };

            let btnPopUp2 = document.getElementById("btnPopUp2");
            btnPopUp2.style.visibility = "hidden";
            modalPoints.style.visibility = "hidden";
        }else{
            modalPoints.style.visibility = "visible";

            let btnPopUp = document.getElementById("btnPopUp");
            btnPopUp.style.pointerEvents= "auto";
            btnPopUp.textContent = "try again";
            btnPopUp.onclick = function() { location.reload() };

            let btnPopUp2 = document.getElementById("btnPopUp2");
            btnPopUp2.style.visibility = "visible";
            btnPopUp2.style.pointerEvents= "auto";
            btnPopUp2.textContent = secondText;
            btnPopUp2.href = secondLink;
        }

        modal.style.display = "flex";
    }

    function fallingHearts() {
        let item = document.createElement('img');
        item.src = "img/heart.png";
        item.setAttribute('id', 'heart');
        item.onclick = function() {
            let healthBar =  document.getElementById('healthBarContent');
            healthBar.style.width = changeHealthBarWidth(healthBar, 10);
            item.style.visibility = 'hidden';
        };

        item.style.left = generateRandomPlaceForHeartFalling(window.screen.width) + 'px';
        document.querySelector('.wrapper').appendChild(item);
    }

    //Funktion gibt zufällige Zahl zwischen 0 und der Breite des Bildschirms zurück, um die Herzen für Peach so zufällig fallen zu lassen
    function generateRandomPlaceForHeartFalling(maxLimit){
        let rand = Math.random() * maxLimit;
        rand = Math.floor(rand);
        return rand;
    }

    function healthBar() {
        let healthBar = document.getElementById('healthBarContent');
        healthBar.style.width = changeHealthBarWidth(healthBar, -10);

        if(healthBar.style.width === "0%"){
            clearInterval(countInterval);
            clearInterval(healthBarInterval);
            clearInterval(heartFallingInterval);

            popup("error", 'Sorry, the level was not completed.\r\nTry again or return to the home page.', 'back to start', 'index.html', points);

            //Background Sound beenden und Loose-Sound abspielen
            audio.pause()
            audio.currentTime = 0
            audio = new Audio('sound/marioLoose.mp3');
            audio.volume = 0.4
            audio.play()

            document.querySelector("body").style.pointerEvents = 'none';
        }

    }

    function changeHealthBarWidth(healthBar, interval){
        let parent = healthBar.offsetParent || healthBar;
        let newWidth = (healthBar.offsetWidth / parent.offsetWidth)*100+interval;
        return Math.round(newWidth / 10 ) * 10 +'%';
    }

    document.onkeydown = check_key;

    function check_key(e){
        if(e.keyCode === 87){
            moveCar("up");
        }else if(e.keyCode === 83){
            moveCar("down");
        }else if(e.keyCode === 65){
            moveCar("left");
        }else if(e.keyCode === 68){
            moveCar("right");
        }else if(e.keyCode === 32) {
            click();
        }
    }

    function click(){
        let offsets = document.getElementById('character').getBoundingClientRect();
        let top = offsets.top;
        let left = offsets.right;
        document.elementFromPoint(left, top).click();
    }

    function moveCar(a){
        character = document.getElementById("character");
        if(a === 'right'){
            x = x + 50;
            character.style.transform = "translate("+x+"px,"+y+"px)  rotate(0deg)";
        }else if(a === 'left'){
            x = x - 50;
            character.style.transform = "translate("+x+"px,"+y+"px) rotate(180deg)";
        }else if(a === 'up'){
            y = y - 50;
            character.style.transform = "translate("+x+"px,"+y+"px)rotate(270deg)";
        }else if(a === 'down'){
            y = y + 50;
            character.style.transform = "translate("+x+"px,"+y+"px) rotate(90deg)";
        }
    }

    function f1timer(element){
        let startTime = Date.now();

        countInterval = setInterval(function() {
            let elapsedTime = Date.now() - startTime;
            element.innerHTML = (elapsedTime / 1000).toFixed(1);
        }, 100);
    }

    document.getElementById("playPauseButton").addEventListener("click", playPause)

    function playPause() {
        if(!audio.paused){
            audio.pause();
        }else{
            audio.play();
        }
    }

    initPlayground();

})