const scope = {};

((scope, $) =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME = {
        pot: 0,
        cardsOnTable: [],
        numberOfPlayers: null,
        players: [],
        currentPlayer: null,
        bigBlind: 200,
        smallBlind: null,
        winningPlayer: null,
        foldedPlayers: []
    };
    GAME.smallBlind = GAME.bigBlind / 2;
    const pot = $("#pot");

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

    startButton.click(startGame);

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

    raiseInput.change = () =>
    {
        /* magic that should not be used in real thingy, but i like it c:
         sets max value to 100 and min to 1 */
        raiseInput.val(Math.min(Math.max(raiseInput.val(), 1), 100));
        raiseSlider.val(raiseInput.val());
        console.log(raiseInput.val());
    };

    foldButton.click(() =>
    {
        /* Add the folded player to the array of currently folded players */
        GAME.foldedPlayers.push(GAME.players[currentPlayerIndex]);

        /* Remove the current player from the players array */
        GAME.players.splice(currentPlayerIndex, 1);

        console.log(GAME.players);

        /* Advance the current player index by 1 if the advanced/next index value is not greater than
         * the length of the players array. If it is then it sets the current player index to 0.
         */
        const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? ++currentPlayerIndex : 0;

        /* Move to the next player */
        setNextPlayer(nextPlayerIndex);
        console.log(GAME.players);

    });

    /* Check matches the last bet */
    checkButton.click(() =>
    {
        let currentHighestBet = 0;


        /* loop though players to get the highest be amount */
        for (let i=0; i<GAME.players.length; i++)
        {
            if(GAME.players[i].betAmount >= currentHighestBet)
            {
                currentHighestBet = GAME.players[i].betAmount;
            }
        }


        if(GAME.players[currentPlayerIndex].betAmount < currentHighestBet)
        {
            // Then call
            /* Make the player match the current highest bet */
            GAME.players[currentPlayerIndex].betAmount = parseInt(currentHighestBet);
            /* Move to the next player */
            setNextPlayer();
        }

        if(GAME.players[currentPlayerIndex].betAmount === currentHighestBet)
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

    /* Raise the bet amount by the value in the raiseInput text field */
    raiseButton.click(() =>
    {
        /* Raise the pot amount by the amount specified in the raiseInput input field */
        GAME.pot += parseInt(GAME.pot + parseInt(raiseInput.val()) );
        pot.text(GAME.pot);

        GAME.players[currentPlayerIndex].betAmount = parseInt(GAME.pot);
        setNextPlayer();
    });

    function startGame()
    {
        deck                 = new Deck();
        GAME.numberOfPlayers = document.getElementById('numberOfPlayers').value;
        const initialStake   = document.getElementById('initalStake').value;

        /* Put each player inside an array */
        for (let i = 0; i < GAME.numberOfPlayers; i++)
        {
            GAME.players.push(setupPlayer("Player " + (i + 1), initialStake));
        }

        allocateBlindRoles();

        GAME.pot = GAME.bigBlind + GAME.smallBlind;
        pot.text(GAME.pot);

        /* Make the third player the current player */
        setCurrentPlayer(2);



        /* Show the card image for the 2 cards the first player has*/
        $("#playerCard1").attr("src", GAME.players[currentPlayerIndex].cards[0].imagePath);
        $("#playerCard2").attr("src", GAME.players[currentPlayerIndex].cards[1].imagePath);

        for (let i = 0; i < 5; i++) {
            let cardDrawn = deck.drawCard();
            cardDrawn.addToTable();
            GAME.cardsOnTable.push(cardDrawn);
        }

        //console.log(GAME.players);
    }

    function allocateBlindRoles()
    {
        GAME.players[0].role = "SMALL BLIND";
        GAME.players[0].betAmount = parseInt(GAME.smallBlind);

        GAME.players[1].role = "BIG BLIND";
        GAME.players[1].betAmount = parseInt(GAME.bigBlind);
    }


    function setCurrentPlayer(playerIndex)
    {
        let playerNameHolder  = $("#playerName");
        let playerStakeHolder = $("#playerStake");
        currentPlayerIndex    = (playerIndex < GAME.players.length) ? playerIndex : 0;

        /* Show the current players name on screen */
        playerNameHolder.text(GAME.players[currentPlayerIndex].name);

        /* Show the current players stake on the screen */
        playerStakeHolder.text(GAME.players[currentPlayerIndex].stake);
    }

    function setNextPlayer()
    {
        let playerNameHolder = $("#playerName");
        const playerIndex    = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;

        currentPlayerIndex = playerIndex;

        /* Set the current player index to the current value of the currentPlayerIndex */
        // GAME.currentPlayer = currentPlayerIndex;

        /* Show the current players name on screen */
        playerNameHolder.text(GAME.players[currentPlayerIndex].name);

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
        const name = player.name.replace(" ", "_");
        const stake = player.stake;
        const playerDiv = document.createElement('div');
        playerDiv.className = "col-sm-4";
        playerDiv.innerHTML = name + " " + stake;

        $('#playerList').append(`
          <div id='${name}' class='col-sm-4 border border-dark'>
            <div>Name: ${player.name}<div/>
            <div>Stake: ${player.stake}<div/>
          </div>
          `);
    }


    /*
    returns [] of winners
    if length>1 split pot
    */
    function checkForWinners() {
        for(const player of GAME.players){
            let allCards = [...player.cards, ...GAME.cardsOnTable];
            let cardCombinations = {
                pairs:[],
                threes:0,
                fours:0,
                straight:null,
                figures:{
                    Diamonds: 0,
                    Clubs: 0,
                    Spades: 0,
                    Hearts:0
                },
                straightFlush: 0,
                flushCards:[]
            };
            let highest = 0;
            if(player.cards[0].value > player.cards[1].value){
                highest = player.cards[0].value;
            }else{
                highest = player.cards[1].value;
            }

            let straights = allCards.map(a=>a.value).sort((a,b)=>a-b);
            for(let i=2; i<15; i++){
                let numOfCards = allCards.filter(card=>card.value==i).length;
                if(i==14 && numOfCards>0){
                    straights.unshift(1);
                }

                switch(numOfCards){
                    case 0: break;
                    case 1: break;
                    case 2: {
                        cardCombinations.pairs.push(i);
                        if(cardCombinations.pairs.length > 2) cardCombinations.pairs.shift();
                        break;
                    }
                    case 3: {
                        cardCombinations.threes=i;
                        break;
                    }
                    case 4: {
                        cardCombinations.fours=i;
                        break;
                    }
                }
            }
            
            straights = new Set(straights);
            straights = [...straights];
            //for(const st of straights){
                //console.log(st);
                //}
                
            for(let i=0; i<straights.length-4; i++){
                let check = true;
                for(let j=1; j<5; j++){
                    if(straights[j + i] != straights[j + i - 1] + 1){
                        check=false;
                        break;
                    }
                }
                if(check){
                    cardCombinations.straight = straights[i];
                }
            }

            Object.keys(cardCombinations.figures).map(figure=>{
                    cardCombinations.figures[figure] = allCards.filter(card=>card.figure == figure).length;
                }
            );

            Object.keys(cardCombinations.figures).map(figure=>{
                if(cardCombinations.figures[figure]>=5){
                    let tempDeck = allCards.filter(card=>card.figure == figure).sort((a,b)=>a.value-b.value);
                    cardCombinations.flushCards = tempDeck;
                    tempDeck = [...new Set(tempDeck)];
                    //console.log(tempDeck);

                    for(let i=0; i<tempDeck.length-4; i++){
                        let check = true;
                        for(let j=1; j<5; j++){
                            if(tempDeck[j + i].value != tempDeck[j + i - 1].value + 1){
                                check=false;
                                break;
                            }
                        }
                        if(check){
                            cardCombinations.straightFlush = tempDeck[i].value;
                        }
                    }
            

                };
            });


            player.cardCombinations = cardCombinations;

            if(cardCombinations.straightFlush){
                player.best = {straightFlush: cardCombinations.straightFlush};    
            }else if(cardCombinations.fours.length){
                player.best = {fours: cardCombinations.fours};
            }else if(cardCombinations.threes.length && cardCombinations.pairs.length){
                player.best = {fullHouse:true, threes: cardCombinations.threes, pair:cardCombinations.pairs.length>1?cardCombinations.pairs[1]:cardCombinations.pair[0]};
            }else if(cardCombinations.flushCards.length){
                player.best = {flush: cardCombinations.flushCards, highest:highest};
            }else if(cardCombinations.straight){
                player.best = {straight: cardCombinations.straight};
            }else if(cardCombinations.threes.length){
                player.best = {threes: cardCombinations.threes};
            }else if(cardCombinations.pairs.length==2){
                player.best = {twoPairs: cardCombinations.pairs};
            }else if(cardCombinations.pairs.length==1){
                player.best = {pair: cardCombinations.pairs};
            }else{
                player.best = {highest:highest};
            }
            
            
        }
        let winningTable = ['straightFlush', 'fours', 'fullHouse', 'flush', 'straight', 'threes', 'twoPairs', 'pair', 'highest'];
        let winners = [];
        let bestWinCondition;
        
        for(const winCondition of winningTable){
            let check=false;
            for(const player of GAME.players){
                if(player.best[winCondition] !== undefined){
                    check=true;
                    winners.push(player);
                }
            }
            if(check){
                bestWinCondition = winCondition;
                break;
            }
        }

        console.log('possible winners', winners);

        
        if(winners.length>1){
            if(bestWinCondition == 'highest'){
                let best = 0;
                for(const player of winners){
                    if(player.best.highest>best){
                        best = player.best.highest;
                    }
                }
                winners = winners.filter(player=>player.best.highest == best);

            }else  if(bestWinCondition == 'pair'){
                let bestPair = 0;
                for(const player of winners){
                    if(player.best.pair[0]>bestPair){
                        bestPair = player.best.pair[0];
                    }
                }
                winners = winners.filter(player=>player.best.pair[0]==bestPair);

            }else if(bestWinCondition == 'twoPairs'){
                let highestPair = 0;
                let lowerHighestPair = 0;
                for(const player of winners){
                    if(player.best.twoPairs[0]>lowerHighestPair){
                        lowerHighestPair = player.best.twoPairs[0];
                    }
                    if(player.best.twoPairs[1]>highestPair){
                        highestPair = player.best.twoPairs[1];
                    }
                }
                winners = winners.filter(player=>player.best.twoPairs[1] == highestPair);
                if(winners.length > 1){
                    winners = winners.filter(player=>player.best.twoPairs[0] == lowerHighestPair);
                }

            }else if(bestWinCondition == 'threes'){
                let bestThree = 0;
                for(const player of winners){
                    if(player.best.threes > bestThree){
                        bestThree = player.best.threes;
                    }
                }
                winners = winners.filter(player=>player.best.threes = bestThree);
            }else if(bestWinCondition == 'straight'){
                let bestStraight = 0;
                for(const player of winners){
                    if(player.best.straight > bestStraight){
                        bestStraight = player.best.straight;
                    }
                    winners = winners.filter(player=>player.best.straight == bestStraight);
                }
            }else if(bestWinCondition == 'flush'){
                let highestCard = 0;
                for(const player of winners){
                    if(player.best.highest > highestCard){
                        highestCard = playe.best.highest;
                    }
                }
                winners = winners.filter(player=>player.best.highest == highestCard);
            }else if(bestWinCondition == 'fullHouse'){
                let highestThrees = 0;
                let highestPair = 0;
                for(const player of winners){
                    if(player.best.threes > highestThrees){
                        highestThrees = player.best.threes;
                    }
                    if(player.best.pair>highestPair){
                        highestPair = player.best.pair;
                    }
                }

                winners = winners.filter(player=>player.best.threes == highestThrees);
                if(winners.length > 1){
                    winners = winners.filter(player=>player.best.pair == highestPair);
                }
            }else if(bestWinCondition == 'fours'){
                let bestFour = 0;
                for(const player of winners){
                    if(player.best.fours>bestFour){
                        bestFour = player.best.fours;
                    }
                }

                winners = winners.filter(player=>player.best.fours == bestFour);
            }else if(bestWinCondition == 'straightFlush'){
                let bestStraightFlush = 0;
                for(const player of winners){
                    if(player.best.straightFlush > bestStraightFlush){
                        bestStraightFlush = player.best.straightFlush;
                    }
                }
                winners = winners.filter(player=>player.best.straightFlush == bestStraightFlush);
            }
        }


        console.log("winners",winners);
        return winners;
        
    }
        
    })(scope, jQuery);
    