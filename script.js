let suits = ["harten", "ruiten", "klaver", "schoppen"];
let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "boer", "koningin", "koning", "aas"];
let deck, playerHand, dealerHand;

function createDeck() {
    let deck = []; // hierin word het deck gemaakt wat overal gebruikt word
    for (let suit of suits) {
        for (let value of values) {
            let imagePath = `images/kaartset/${suit}${value}.jpg`; // Assuming you have images named like '2_of_hearts.png' in an 'images' folder
            deck.push({ suit: suit, value: value, image: imagePath});
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) { // 52 - 1 = 51, i nogsteeds groter dan 0, dus i - 1, tot het op index = 1 komt
        let j = Math.floor(Math.random() * (i + 1)); // j = afronden (random getal)
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards(deck) {
    return { playerHand: [deck.pop(), deck.pop()], dealerHand: [deck.pop()] };
}

function handValue(hand) {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
        if (card.value === "aas") {
            value += 11;
            aces += 1;
        } 
        
        else if (card.value === "koning" || card.value === "koningin" || card.value === "boer") {
            value += 10;
        } 
        
        else {
            value += parseInt(card.value);
        }
    }

    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }

    return value;
}

function startGame() {
    deck = createDeck();
    shuffleDeck(deck);
    let hands = dealCards(deck);
    playerHand = hands.playerHand;
    dealerHand = hands.dealerHand;
    displayHands();
    document.getElementById('result').textContent = ''; // Clear the result
    document.getElementsByClassName('startbutton btn')[0].textContent = 'Restart Game';
    document.getElementsByClassName('hitbutton btn')[0].style.display = 'inline-block';
    document.getElementsByClassName('standbutton btn')[0].style.display = 'inline-block';
    document.getElementsByClassName('hitbutton btn')[0].disabled = false;
    document.getElementsByClassName('standbutton btn')[0].disabled = false;
}

function hit() {
    let card = deck.pop();
    card.new = true; // Add a new property to the card
    playerHand.push(card);
    displayHands();
    if (handValue(playerHand) > 21) {
        endGame();
    }
}

function stand() {
    let i = 0;
    function drawCard() {
        if (handValue(dealerHand) < 21) {
            dealerHand.push(deck.pop());
            displayHands();
            if (handValue(dealerHand) == 21 || handValue(dealerHand) > 21 || handValue(dealerHand) > handValue(playerHand)){
                endGame();
            } 
            
            else {
                i++;
                setTimeout(drawCard, 1250 * i); // Delay the next card by an additional second
            }
        }
    }
    drawCard();
} 

function displayHands() {
    document.getElementById('player-hand').textContent = "Player hand: " + playerHand.map(card => card.value + ' of ' + card.suit).join(', ') + " Value: " + handValue(playerHand);
    document.getElementById('dealer-hand').textContent = "Dealer hand: " + dealerHand.map(card => card.value + ' of ' + card.suit).join(', ') + " Value: " + handValue(dealerHand);

    // Display card images for player
    let playerHandImages = document.getElementById('player-hand-images');
    while (playerHandImages.firstChild) {
        playerHandImages.firstChild.remove();
    }
    for (let i = playerHandImages.children.length; i < playerHand.length; i++) {
        let card = playerHand[i];
        let img = document.createElement('img');
        img.src = card.image;
        img.className = 'card flip'; // add flip class to new card
        playerHandImages.appendChild(img);

        // remove flip class after animation ends
        img.addEventListener('animationend', function() {
            this.className = 'card';
        });
    }

    // Display card images for dealer
    let dealerHandImages = document.getElementById('dealer-hand-images');
    while (dealerHandImages.firstChild) {
        dealerHandImages.firstChild.remove();
    }
    for (let i = dealerHandImages.children.length; i < dealerHand.length; i++) {
        let card = dealerHand[i];
        let img = document.createElement('img');
        img.src = card.image;
        img.className = 'card flip'; // add flip class to new card
        dealerHandImages.appendChild(img);

        // remove flip class after animation ends
        img.addEventListener('animationend', function() {
            this.className = 'card';
        });
    }
}

function endGame() {
    let playerValue = handValue(playerHand);
    let dealerValue = handValue(dealerHand);
    let result;
    
    if (playerValue == 21) {
        result = "Blackjack! Player wins!";
    }

    else if (playerValue > 21) {
        result = "Player busts! Dealer wins.";
    } 
           
    else if (dealerValue === 21) {
        result = "Blackjack! Dealer wins!";
    }

    else if (dealerValue > 21) {
        result = "Dealer busts! Player wins.";
    } 

    else if (playerValue > dealerValue) {
        result = "Player wins!";
    } 
    
    else if (dealerValue > playerValue) {
        result = "Dealer wins!";
    } 
    
    else if (dealerValue === 21 && playerValue === 21){
        result = "It's a tie!";
    }
    document.getElementsByClassName('startbutton btn')[0].textContent = 'Play again?';
    document.getElementById('result').textContent = result; // Display the result
    document.getElementsByClassName('hitbutton btn')[0].disabled = true;
    document.getElementsByClassName('standbutton btn')[0].disabled = true;
}

document.getElementsByClassName('startbutton btn')[0].addEventListener('click', startGame);
document.getElementsByClassName('hitbutton btn')[0].addEventListener('click', hit);
document.getElementsByClassName('standbutton btn')[0].addEventListener('click', stand);

