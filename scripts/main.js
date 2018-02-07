const scope = {};

((scope, $) =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME      = {
        pot: 0,
        cardsOnTable: [],
        winningPlayer: [],
        foldedPlayers: [],
        players: [],
        numberOfPlayers: null,
        currentPlayer: null,
        bigBlind: 200,
        smallBlind: null,
        isWinnerPresent: false,
        lastPlayerToRaise: null,
        phase: 0
    };
    GAME.smallBlind = GAME.bigBlind / 2;
    const pot       = $("#pot");

    scope.thing = GAME;

    let currentPlayerIndex = 0;
    let deck;

    // Raise amount input and slider
    const raiseInput  = $("#raiseInput");
    const raiseSlider = $("#raiseSlider");

    const foldButton  = $("#foldButton");
    const raiseButton = $("#raiseButton");
    const checkButton = $("#checkCallButton");
    const startButton = $('#startButton');

    startButton.click(()=>{startGame(false)});

    // source: https://stackoverflow.com/questions/9894339/disallow-twitter-bootstrap-modal-window-from-closing
    // Load modal
    $('#startGameModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    scope.players = GAME;

    raiseSlider.change(() =>
    {
        raiseInput.val(raiseSlider.val());
    });

    raiseInput.change(() =>
    {
        /* magic that should not be used in real thingy, but i like it c:
         sets max value to 100 and min to 1 */
        raiseInput.val(Math.min(Math.max(parseInt(raiseInput.val()) | 0, 1), 100));
        raiseSlider.val(raiseInput.val());
        console.log(raiseInput.val());
    });

    /* I will come back to this later */
    // raiseInput.keyup(function ()
    // {
    //     if ($.isNumeric(raiseInput.val()))
    //     {
    //         console.log("NUMERIC");
    //     }
    // });

    foldButton.click(() =>
    {

        if (!GAME.isWinnerPresent)
        {
            /* Add the folded player to the array of currently folded players */
            GAME.foldedPlayers.push(GAME.players[currentPlayerIndex]);

            /* Remove the current player from the players array */
            GAME.players.splice(currentPlayerIndex, 1);
            if(GAME.lastPlayerToRaise > currentPlayerIndex){
                GAME.lastPlayerToRaise--;
                if(GAME.lastPlayerToRaise < 0){
                    GAME.lastPlayerToRaise = GAME.players.length;
                }
            }

            console.log(GAME.players);

            /* Advance the current player index by 1 if the advanced/next index value is not greater than
             * the length of the players array. If it is then it sets the current player index to 0.
             */
            // const nextPlayerIndex = (currentPlayerIndex < GAME.players.length) ? ++currentPlayerIndex : 0;

            /* Move to the next player */
            setNextPlayer(true);
        }

        console.log(GAME.players);

    });

    /* Check matches the last bet */
    checkButton.click(() =>
    {
        let currentHighestBet = getHighestPlayerBet();
        console.log("Highest bet " + currentHighestBet);

        let highestBet = getHighestPlayerBet();
        let diff = highestBet - GAME.players[currentPlayerIndex].betAmount;
        GAME.players[currentPlayerIndex].stake -= diff;

        if (GAME.players[currentPlayerIndex].betAmount < currentHighestBet)
        {
            // Then call
            /* Make the player match the current highest bet */
            GAME.players[currentPlayerIndex].betAmount = parseInt(currentHighestBet);
            GAME.pot += GAME.players[currentPlayerIndex].betAmount;

            pot.text(GAME.pot);
            /* Move to the next player */
            setNextPlayer();
        }

        else if (GAME.players[currentPlayerIndex].betAmount === currentHighestBet)
        {
            // Then check
            GAME.players[currentPlayerIndex].check = true;

            /* Move to the next player */
            setNextPlayer();

        }

        /* Make the player match the bet/money in the pot */
        // GAME.players[currentPlayerIndex].betAmount = parseInt(GAME.pot);

        /* Advance the current player index by 1 if the advanced/next index value is not greater than
         * the length of the players array. If it is then it sets the current player index to 0.
         */
        const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;
        
        

        // /* Move to the next player */
        // setNextPlayer();
        console.log(GAME.players);
        console.log(GAME.foldedPlayers);
    });

    //TODO: Announce the winner if there is all but one player has folded

    /* Raise the bet amount by the value in the raiseInput text field */
    raiseButton.click(() =>
    {
        let currentHighestBet           = getHighestPlayerBet();
        let differenceToMatchHighestBet = currentHighestBet - GAME.players[currentPlayerIndex].betAmount;

        /* parseInt(differenceToMatchHighestBet +
         (differenceToMatchHighestBet where the smallest raise value must be differenceToMatchHighestBet  ) )
         */
        // GAME.pot += parseInt(
        //     differenceToMatchHighestBet +
        //     (differenceToMatchHighestBet === 0) ?
        //         differenceToMatchHighestBet + parseInt(raiseInput.val()) :
        //         differenceToMatchHighestBet);

        /* If the current player bet is the same as the highest bet among all the players */
        let prevBet = GAME.players[currentPlayerIndex].betAmount;
        console.log(differenceToMatchHighestBet);
        if (differenceToMatchHighestBet === 0)
        {

            GAME.players[currentPlayerIndex].betAmount += parseInt(raiseInput.val());
            GAME.pot += parseInt(raiseInput.val());
        }
        else
        {
            GAME.players[currentPlayerIndex].betAmount = currentHighestBet + differenceToMatchHighestBet + parseInt(raiseInput.val());
            GAME.pot += currentHighestBet + differenceToMatchHighestBet + parseInt(raiseInput.val());
        }

        /* Show the pot amount on screen */
        pot.text(GAME.pot);

        // GAME.players[currentPlayerIndex].stake -= parseInt(GAME.pot + parseInt(raiseInput.val()));
        let betDiff = GAME.players[currentPlayerIndex].betAmount - prevBet;
        GAME.players[currentPlayerIndex].stake -= betDiff;
        // GAME.players[currentPlayerIndex].betAmount = parseInt(GAME.pot);
        GAME.lastPlayerToRaise = currentPlayerIndex;
        setNextPlayer();

        console.log(GAME.players);
        console.log(GAME.foldedPlayers);
    });

    function startGame(reset = false)
    {
        deck                 = new Deck();
        GAME.numberOfPlayers = document.getElementById('numberOfPlayers').value;
        const initialStake   = document.getElementById('initalStake').value;
        //console.log(res);
        if(!reset){
            /* Put each player inside an array */
            for (let i = 0; i < GAME.numberOfPlayers; i++)
            {
                GAME.players.push(setupPlayer("Player " + (i + 1), initialStake));
            }
    
            
        }else{
            for(const player of GAME.foldedPlayers.sort((a,b)=>a.name-b.name)){
                GAME.players.splice(player.name.replace(/[^\d]/g,'')-1, 0, player);
            }
            
            for(const player of GAME.players){
                player.betAmount = 0;
            }
            Game.phase = 0;
            GAME.foldedPlayers = [];
            GAME.cardsOnTable = [];
            $('#tableCards').html("");
        }
        
        allocateBlindRoles();
        GAME.pot += GAME.bigBlind + GAME.smallBlind;
        pot.text(GAME.pot);

        /* Make the third player the current player */
        setCurrentPlayer(2);

        /* Show the card image for the 2 cards the first player has*/
        $("#playerCard1").attr("src", GAME.players[currentPlayerIndex].cards[0].imagePath);
        $("#playerCard2").attr("src", GAME.players[currentPlayerIndex].cards[1].imagePath);

        for (let i = 0; i < GAME.players.length; i++)
        {
            $(`#Player_${i + 1}`).find(".bet").text(GAME.players[i].betAmount);
            $(`#Player_${i + 1}`).find(".stake").text(GAME.players[i].stake);

        }

        // for (let i = 0; i < 5; i++) {
        //     let cardDrawn = deck.drawCard();
        //     cardDrawn.addToTable();
        //     GAME.cardsOnTable.push(cardDrawn);
        // }

        //console.log(GAME.players);
    }

    /**
     * Sets the big and small blind roles for the first 2 players
     */
    function allocateBlindRoles()
    {
        GAME.players[0].role      = "SMALL BLIND";
        GAME.players[0].betAmount = parseInt(GAME.smallBlind);
        GAME.lastPlayerToRaise = 0;
        GAME.players[0].stake-=GAME.smallBlind;

        GAME.players[1].role      = "BIG BLIND";
        GAME.players[1].betAmount = parseInt(GAME.bigBlind);
        GAME.players[1].stake-=GAME.bigBlind;        
    }

    function setCurrentPlayer(playerIndex)
    {
        let playerNameHolder  = $("#playerName");
        let playerStakeHolder = $("#playerStake");
        let playerBetHolder   = $("#bet");
        currentPlayerIndex    = (playerIndex < GAME.players.length) ? playerIndex : 0;

        /* Show the current players name on screen */
        playerNameHolder.text(GAME.players[currentPlayerIndex].name);

        /* Show the current players stake on the screen */
        playerStakeHolder.text(GAME.players[currentPlayerIndex].stake);
        /* Show the current players stake on screen */
        playerBetHolder.text(GAME.players[currentPlayerIndex].betAmount);
    }

    function setNextPlayer(folded = false)
    {
        let playerNameHolder  = $("#playerName");
        let playerStakeHolder = $("#playerStake");
        let playerBetHolder   = $("#bet");
        let playerId          = GAME.players[(currentPlayerIndex > 0) ? currentPlayerIndex - folded : currentPlayerIndex].name.replace(" ", "_");
        let lastPlayerCard    = $(`#${playerId}`);
        let playerIndex       = (currentPlayerIndex >= GAME.players.length) ? 0 : currentPlayerIndex;

        if (!folded)
        {
            playerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;
        }

        currentPlayerIndex = playerIndex;

        if (GAME.foldedPlayers.length === GAME.numberOfPlayers - 1)
        {
            GAME.isWinnerPresent = true;

            /* Push the winning player into the winning players array */
            GAME.winningPlayer.push(GAME.players[0]);

            /* Give the money in the pot to the winning player */
            GAME.winningPlayer[0].stake += GAME.pot;

            // Reset the pot
            GAME.pot = 0;
            startGame(true);

            console.log("THERE IS A WINNER");
            // Winner is the only player left in the GAME.players array
            console.log("WINNER IS " + GAME.players[0].name);
            alert("BOB's a winner");
        }

        let currentHighestBet = getHighestPlayerBet();        
        if(GAME.lastPlayerToRaise == currentPlayerIndex && GAME.players[currentPlayerIndex].betAmount == currentHighestBet){
            GAME.phase++;
            newRound();

        }

        /* Set the current player index to the current value of the currentPlayerIndex */
        // GAME.currentPlayer = currentPlayerIndex;

        /* Show the current players name on screen */
        playerNameHolder.text(GAME.players[currentPlayerIndex].name);
        /* Show the current players stake on screen */
        playerStakeHolder.text(GAME.players[currentPlayerIndex].stake);
        /* Show the current players stake on screen */
        playerBetHolder.text(GAME.players[currentPlayerIndex].betAmount);

        let previousPlayer = currentPlayerIndex - 1;
        if (previousPlayer < 0)
        {
            previousPlayer = GAME.players.length - 1;
        }
        lastPlayerCard.find(".bet").text(GAME.players[previousPlayer].betAmount);
        lastPlayerCard.find(".stake").text(GAME.players[previousPlayer].stake);

        /* Show the two cards the current player has */
        for (let i = 0; i < 2; i++)
        {
            $("#playerCard" + (i + 1)).attr("src", GAME.players[playerIndex].cards[i].imagePath);
        }
        console.log("Current player index: " + currentPlayerIndex);
        console.log("Current player name: " + GAME.players[currentPlayerIndex].name);
        console.log("Current player fold status: " + GAME.players[currentPlayerIndex].fold);
    }

    /**
     * Gets the highest bet a player has placed.
     * @returns {number} The highest bet amount a player has made.
     */
    function getHighestPlayerBet()
    {
        let currentHighestBet = 0;

        /* loop though players to get the highest be amount */
        for (let i = 0; i < GAME.players.length; i++)
        {
            if (GAME.players[i].betAmount >= currentHighestBet)
            {
                currentHighestBet = GAME.players[i].betAmount;
            }
        }

        return currentHighestBet;
    }


    //NEW ROUND
    function newRound(){
        switch(GAME.phase){
            case 1:{
                for (let i = 0; i < 3; i++) {
                    let cardDrawn = deck.drawCard();
                    cardDrawn.addToTable();
                    GAME.cardsOnTable.push(cardDrawn);
                }
                break;
            }
            case 2:{
                let cardDrawn = deck.drawCard();
                cardDrawn.addToTable();
                GAME.cardsOnTable.push(cardDrawn);
                break;
            }
            case 3:{
                let cardDrawn = deck.drawCard();
                cardDrawn.addToTable();
                GAME.cardsOnTable.push(cardDrawn);
                break;
            }
            case 4:{
               let winners = checkForWinners();
               let diff=0;
               if(winners.length>1){
                   diff = GAME.pot%winners.length;
               }
               GAME.pot-=diff;
               let fullPot = GAME.pot;
               for(const winner of winners){
                   winner.stake+=fullPot/winners.length;
               }
               GAME.pot = diff;
               startGame(true);
            }
        }
    }

    /**
     * Assigns 2 cards to a player and returns the Player object
     * @param playerName
     * @param stake
     * @returns {Player}
     */
    function setupPlayer(playerName, stake)
    {
        /* Create a new player */
        let player = new Player(playerName, stake);

        /* Creates div with player detail in the main tag */
        createPlayerDiv(player);

        /* Give the player two cards */
        player.addCard(deck.drawCard());
        player.addCard(deck.drawCard());
        console.log(player.cards);
        return player;
    }

    function createPlayerDiv(player)
    {
        const name          = player.name.replace(" ", "_");
        const stake         = player.stake;
        const playerDiv     = document.createElement('div');
        playerDiv.className = "col-sm-4";
        playerDiv.innerHTML = name + " " + stake;

        $('#playerList').append(`
          <div id='${name}' class='col-sm-4 border border-dark'>
            <div>Name: ${player.name}<div/>
            <div>Stake: <span class='stake'>${player.stake}</span><div/>
            <div>Bet: <span class="bet">${player.betAmount}</span><div/>
          </div>
          `);
    }

    /*
     returns [] of winners
     if length>1 split pot
     */
    function checkForWinners()
    {
        //loop through all of the players
        for (const player of GAME.players)
        {
            let allCards         = [...player.cards, ...GAME.cardsOnTable];
            //object that golds all of the card combinations
            let cardCombinations = {
                pairs: [],
                threes: 0,
                fours: 0,
                straight: null,
                figures: {
                    Diamonds: 0,
                    Clubs: 0,
                    Spades: 0,
                    Hearts: 0
                },
                straightFlush: 0,
                flushCards: []
            };
            //highest card on hand
            let highest          = 0;
            if (player.cards[0].value > player.cards[1].value)
            {
                highest = player.cards[0].value;
            } else
            {
                highest = player.cards[1].value;
            }
            //array with sorted values of cards
            let straights = allCards.map(a => a.value).sort((a, b) => a - b);
            //check for 2,3 and fours
            for (let i = 2; i < 15; i++)
            {
                let numOfCards = allCards.filter(card => card.value == i).length;
                if (i == 14 && numOfCards > 0)
                {
                    straights.unshift(1);
                }

                switch (numOfCards)
                {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                    {
                        cardCombinations.pairs.push(i);
                        if (cardCombinations.pairs.length > 2) cardCombinations.pairs.shift();
                        break;
                    }
                    case 3:
                    {
                        cardCombinations.threes = i;
                        break;
                    }
                    case 4:
                    {
                        cardCombinations.fours = i;
                        break;
                    }
                }
            }
            //get rid of redundand values in straights
            straights = new Set(straights);
            straights = [...straights];

            //checks for actual straights and then saves the best straight
            for (let i = 0; i < straights.length - 4; i++)
            {
                let check = true;
                for (let j = 1; j < 5; j++)
                {
                    if (straights[j + i] != straights[j + i - 1] + 1)
                    {
                        check = false;
                        break;
                    }
                }
                if (check)
                {
                    cardCombinations.straight = straights[i];
                }
            }
            //count all of the figures, to see if u got flush
            Object.keys(cardCombinations.figures).map(figure =>
                {
                    cardCombinations.figures[figure] = allCards.filter(card => card.figure == figure).length;
                }
            );
            //check for straight flushes, checks if there are more then 4 cards of the same figure and only then checks for straight within those cards
            Object.keys(cardCombinations.figures).map(figure =>
            {
                if (cardCombinations.figures[figure] >= 5)
                {
                    //cards of only one figure, sorted in ascending order by value
                    let tempDeck                = allCards.filter(card => card.figure == figure).sort((a, b) => a.value - b.value);
                    //set property flush cards to tempDeck, not used anymore, too sleepy and hungry to change it now
                    cardCombinations.flushCards = tempDeck;
                    //get rid of redundant data
                    tempDeck                    = [...new Set(tempDeck)];
                    //check for the straights (same as before)
                    for (let i = 0; i < tempDeck.length - 4; i++)
                    {
                        let check = true;
                        for (let j = 1; j < 5; j++)
                        {
                            if (tempDeck[j + i].value != tempDeck[j + i - 1].value + 1)
                            {
                                check = false;
                                break;
                            }
                        }
                        if (check)
                        {
                            cardCombinations.straightFlush = tempDeck[i].value;
                        }
                    }

                }
            });

            //set property of cardCombinations to player
            player.cardCombinations = cardCombinations;
            //get best winning condition for certain player
            if (cardCombinations.straightFlush)
            {
                player.best = {straightFlush: cardCombinations.straightFlush};
            } else if (cardCombinations.fours.length)
            {
                player.best = {
                    fours: cardCombinations.fours,
                    highest: highest
                };
            } else if (cardCombinations.threes.length && cardCombinations.pairs.length)
            {
                player.best = {
                    fullHouse: true,
                    threes: cardCombinations.threes,
                    pair: cardCombinations.pairs.length > 1 ? cardCombinations.pairs[1] : cardCombinations.pair[0]
                };
            } else if (cardCombinations.flushCards.length)
            {
                player.best = {
                    flush: cardCombinations.flushCards,
                    highest: highest
                };
            } else if (cardCombinations.straight)
            {
                player.best = {straight: cardCombinations.straight};
            } else if (cardCombinations.threes.length)
            {
                player.best = {threes: cardCombinations.threes};
            } else if (cardCombinations.pairs.length == 2)
            {
                player.best = {
                    twoPairs: cardCombinations.pairs,
                    highest: highest
                };
            } else if (cardCombinations.pairs.length == 1)
            {
                player.best = {
                    pair: cardCombinations.pairs,
                    highest: highest
                };
            } else
            {
                player.best = {highest: highest};
            }

        }

        //winning conditions in order from best to worst
        let winningTable = ['straightFlush', 'fours', 'fullHouse', 'flush', 'straight', 'threes', 'twoPairs', 'pair', 'highest'];
        let winners      = [];
        let bestWinCondition;
        //if there's a player with a winning condition, add every player with that condition to the array, then break it
        //so it doesn't add people with lower win condition to winners table
        for (const winCondition of winningTable)
        {
            let check = false;
            for (const player of GAME.players)
            {
                if (player.best[winCondition] !== undefined)
                {
                    check = true;
                    winners.push(player);
                }
            }
            if (check)
            {
                bestWinCondition = winCondition;
                break;
            }
        }
        //logs all people with the same (and the best) winning condition
        console.log('possible winners', winners);

        //MAGIC
        //if there's more than one winner, chec if it can be reduced by checking conditions more closely
        //conditions meet criteria of give pdf, with a few additions of comparing highest card on hand when draw in pair/two pairs/fours/ idk what else
        if (winners.length > 1)
        {
            if (bestWinCondition == 'highest')
            {
                let best = 0;
                for (const player of winners)
                {
                    if (player.best.highest > best)
                    {
                        best = player.best.highest;
                    }
                }
                winners = winners.filter(player => player.best.highest == best);

            } else if (bestWinCondition == 'pair')
            {
                let bestPair = 0;
                let bestCard = 0;
                for (const player of winners)
                {
                    if (player.best.pair[0] > bestPair)
                    {
                        bestPair = player.best.pair[0];
                    }
                    if (player.best.highest > bestCard)
                    {
                        bestCard = player.best.highest;
                    }
                }
                winners = winners.filter(player => player.best.pair[0] == bestPair);
                if (winners.length > 1)
                {
                    winners = winners.filter(player => player.best.highest == bestCard);
                }

            } else if (bestWinCondition == 'twoPairs')
            {
                let highestPair      = 0;
                let lowerHighestPair = 0;
                let bestCard         = 0;
                for (const player of winners)
                {
                    if (player.best.twoPairs[0] > lowerHighestPair)
                    {
                        lowerHighestPair = player.best.twoPairs[0];
                    }
                    if (player.best.twoPairs[1] > highestPair)
                    {
                        highestPair = player.best.twoPairs[1];
                    }
                    if (player.best.highest > bestCard)
                    {
                        bestCard = player.best.highest;
                    }
                }
                winners = winners.filter(player => player.best.twoPairs[1] == highestPair);
                if (winners.length > 1)
                {
                    winners = winners.filter(player => player.best.twoPairs[0] == lowerHighestPair);
                    if (winners.length > 1)
                    {
                        winners = winners.filter(player => player.best.highest == bestCard);
                    }
                }

            } else if (bestWinCondition == 'threes')
            {
                let bestThree = 0;
                for (const player of winners)
                {
                    if (player.best.threes > bestThree)
                    {
                        bestThree = player.best.threes;
                    }
                }
                winners = winners.filter(player => player.best.threes = bestThree);
            } else if (bestWinCondition == 'straight')
            {
                let bestStraight = 0;
                for (const player of winners)
                {
                    if (player.best.straight > bestStraight)
                    {
                        bestStraight = player.best.straight;
                    }
                    winners = winners.filter(player => player.best.straight == bestStraight);
                }
            } else if (bestWinCondition == 'flush')
            {
                let highestCard = 0;
                for (const player of winners)
                {
                    if (player.best.highest > highestCard)
                    {
                        highestCard = playe.best.highest;
                    }
                }
                winners = winners.filter(player => player.best.highest == highestCard);
            } else if (bestWinCondition == 'fullHouse')
            {
                let highestThrees = 0;
                let highestPair   = 0;
                for (const player of winners)
                {
                    if (player.best.threes > highestThrees)
                    {
                        highestThrees = player.best.threes;
                    }
                    if (player.best.pair > highestPair)
                    {
                        highestPair = player.best.pair;
                    }
                }

                winners = winners.filter(player => player.best.threes == highestThrees);
                if (winners.length > 1)
                {
                    winners = winners.filter(player => player.best.pair == highestPair);
                }
            } else if (bestWinCondition == 'fours')
            {
                let bestFour = 0;
                let bestCard = 0;
                for (const player of winners)
                {
                    if (player.best.fours > bestFour)
                    {
                        bestFour = player.best.fours;
                    }
                    if (player.best.highest > bestCard)
                    {
                        bestCard = player.best.highest;
                    }
                }

                winners = winners.filter(player => player.best.fours == bestFour);
                if (winners.length > 1)
                {
                    winners = winners.filter(plaer => player.best.highest == bestCard);
                }

            } else if (bestWinCondition == 'straightFlush')
            {
                let bestStraightFlush = 0;
                for (const player of winners)
                {
                    if (player.best.straightFlush > bestStraightFlush)
                    {
                        bestStraightFlush = player.best.straightFlush;
                    }
                }
                winners = winners.filter(player => player.best.straightFlush == bestStraightFlush);
            }
        }

        //logs the actual winners or one winner
        console.log("winners", winners);
        //returns a table of winners
        return winners;

    }

})(scope, jQuery);
    