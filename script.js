/*
** Black Jack game by Attila Bulenda
** 2018/oct
** Used Mark Zamoyta's tutorial on PluralSight to learn JS,
** extended with some extra graphical elements, styling,
** and functionality by myself.
**
**     .------.------.------.------.
**    |A_  _ |A /\  |A _   |A .   |
**   |( \/ )| /  \ | ( )  | / \  |
**  | \  / | \  / |(_x_) |(_,_) |
** |  \/ A|  \/ A|  Y  A|  I  A|
** `------^------^------'------'
**
*/


//DOM variables:
let textArea = document.getElementById('text-area');
let dealerText = document.getElementById('dealer-text');
let playerText = document.getElementById('player-text');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

//game variables:
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [],
    nextCard = null;
    playerPoints = 0;
    dealerPoints = 0;

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

//clicking the new game button:
newGameButton.addEventListener('click', function() {

  var elem = document.getElementById('dCards');
  elem.parentNode.removeChild(elem);
  elem = document.getElementById('pCards');
  elem.parentNode.removeChild(elem);

  elem = document.getElementById('dealer-cards');
  var newDiv = document.createElement("div");
  newDiv.id = "dCards";
  elem.appendChild(newDiv);

  elem = document.getElementById('player-cards');
  newDiv = document.createElement("div");
  newDiv.id = "pCards";
  elem.appendChild(newDiv);

  document.getElementById("scores").innerText = "Player: " + playerPoints +
                                      "      ***      Dealer: " + dealerPoints;

  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  playerCards = [getNextCard("player"), getNextCard("player")];
  dealerCards = [getNextCard("dealer"), getNextCard("dealer")];

  newGameButton.style.display = 'none';
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  showStatus();
});

//hit button click event:
hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard("player"));
  checkForEndOfGame();
  showStatus();
});

//stay button click event:
stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

//checking if game is over:
function checkForEndOfGame() {
  updateScores();

  if(gameOver) {
    while (dealerScore < playerScore
            && playerScore <= 21
            && dealerScore <= 21) {
          dealerCards.push(getNextCard("dealer"));
          updateScores();
    }
  }

  if (playerScore > 21) {
    playerWon = false;
    dealerPoints++;
    gameOver = true;
  } else if (dealerScore > 21) {
    playerWon = true;
    playerPoints++;
    gameOver = true;
  } else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
      playerPoints++;
    } else {
      playerWon = false;
      dealerPoints++;
    }
  }
}

//updating scores:
function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore =  getScore(playerCards);
}

//get the numeric value of the card:
function getCardNumericValue(card) {
  switch(card.value) {
    case 'Ace':
    return 1;
    case 'Two':
    return 2;
    case 'Three':
    return 3;
    case 'Four':
    return 4;
    case 'Five':
    return 5;
    case 'Six':
    return 6;
    case 'Seven':
    return 7;
    case 'Eight':
    return 8;
    case 'Nine':
    return 9;
    default:
    return 10;
  }
}

//get score:
function getScore(cardArray) {
  let score = 0;
  let hasAce = false;

  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }

  if (hasAce && score+10<=21) {
    return score+9;
  }
  return score;
}

//show status:
function showStatus() {
  if (!gameStarted) {
    textArea.innerText = "Welcome to BlackJack!";
    return;
  }

  let dealerCardString = '';
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }

  updateScores();

  textArea.innerText = "";

  dealerText.innerText =
  /*  'Dealer has:\n' +
    dealerCardString +*/
    'Dealer score: ' + dealerScore +'\n';

  playerText.innerText=
  /*  'Player has:\n' +
    playerCardString +*/
    'Player score: ' + playerScore +'\n';

    if (gameOver) {
      if (playerWon) {
        textArea.innerText += 'You won!';
      } else {
        textArea.innerText += 'Dealer won!';
      }
      newGameButton.style.display = 'inline';
      hitButton.style.display = 'none';
      stayButton.style.display = 'none';
    }

}

//creates deck for a new game:
function createDeck() {
  let suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
  let values = ["Ace", "King", "Queen", "Jack",
                "Ten", "Nine", "Eight", "Seven",
                "Six", "Five", "Four", "Three",
                "Two"];
  let deck = [];
  for (let suitIndx = 0; suitIndx < suits.length; suitIndx++) {
    for (let valueIndx = 0; valueIndx < values.length; valueIndx++) {
      let card = {
        suit: suits[suitIndx],
        value: values[valueIndx]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random()*deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

//gets next card:
function getNextCard(owner) {

  nextCard = deck.shift();

  if (owner === "dealer") {
    var elem = document.createElement("img");
    elem.src = "cards/" + getCardString(nextCard) + ".png";
    elem.alt = getCardString(nextCard);
    elem.width = "118";
    elem.height = "178";
    document.getElementById("dCards").appendChild(elem);
  } else {
    var elem = document.createElement("img");
    elem.src = "cards/" + getCardString(nextCard) + ".png";
    elem.alt = getCardString(nextCard);
    elem.width = "118";
    elem.height = "178";
    document.getElementById("pCards").appendChild(elem);
  }

  return nextCard;
}

//card object to string:
function getCardString(card) {
  return card.value + " of " + card.suit;
}


console.log("You are dealt: ")
console.log(getCardString(playerCards[0]));
console.log(getCardString(playerCards[1]));
