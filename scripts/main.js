const scope = {};

((scope, $) =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME             = {
        pot: 0,
        cardsOnTable: [],
        numberOfPlayers: null,
        players: [],
        currentPlayer: null
    };
    let currentPlayerIndex = 0;
    let deck;

    // for (let i = 0; i < 5; i++) {
    //     let cardDrawn = deck.drawCard();
    //     cardDrawn.addToTable();
    //     GAME.cardsOnTable.push(cardDrawn);
    // }

    // Raise amount input and slider
    const raiseInput    = $('#raiseInput');
    const raiseSlider   = $('#raiseSlider');
    raiseSlider.change(()=>
    {
        raiseInput.val(raiseSlider.val());
    });

    raiseInput.change(()=>
    {
        /* magic that should not be used in real thingy, but i like it c:
         sets max value to 100 and min to 1 */
         console.log(2);
        raiseInput.val(Math.min(Math.max(raiseInput.val()|0, 1), 100));
        raiseSlider.va(raiseInput.val());
    });

    // source: https://stackoverflow.com/questions/9894339/disallow-twitter-bootstrap-modal-window-from-closing
    // Load modal
    $('#startGameModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    // Button that starts the game
    const startButton = document.getElementById('startButton');

    startButton.addEventListener('click', startGame);

    const foldButton  = $("#foldButton");
    const raiseButton = $('#raiseButton');
    const checkButton = $('#checkCallButton');

    foldButton.on("click", function ()
    {
        let playerNameHolder = $("#playerName");

        /* If current player has already folded */
        if (GAME.players[currentPlayerIndex].fold)
        {
            // alert(GAME.players[currentPlayerIndex].name + " has already folded");
            playerNameHolder.text(GAME.players[currentPlayerIndex].name + "(FOLDED)");
        }
        else
        {
            /* Set the fold status of the current player */
            GAME.players[currentPlayerIndex].fold = true;
            debugger

            /* Advance the current player index by 1 if the advanced/next index value is not greater than
             * the length of the players array. If it is then it sets the current player index to 0.
             */
            const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? ++currentPlayerIndex : 0;

            /* Move to the next player */
            setNextPlayer(nextPlayerIndex);
            console.log(GAME.players);
        }

        //TODO Remove the cards of the folded player from the deck.

    });

    checkButton.on("click", function ()
    {
        /* Advance the current player index by 1 if the advanced/next index value is not greater than
         * the length of the players array. If it is then it sets the current player index to 0.
         */
        const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;

        /* Move to the next player */
        setNextPlayer(nextPlayerIndex);
        console.log(GAME.players);
    });

    raiseButton.click(() =>{

        $('#pot').html(parseInt($('#pot').html()) + parseInt(raiseInput.value));

        const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;
        setNextPlayer(nextPlayerIndex);
        // console.log("Next player: " + nextPlayerIndex);
    });

    function startGame()
    {
        deck                 = new Deck();
        GAME.numberOfPlayers = document.getElementById('numberOfPlayers').value;
        const initialStake   = document.getElementById('initalStake').value;

        /* Put each player inside an array */
        for (var i = 0; i < GAME.numberOfPlayers; i++)
        {
            GAME.players.push(setupPlayer("Bob " + (i + 1), initialStake));
        }

        /* Make the first player the current player */
        setCurrentPlayer(0);

        for (let i = 0; i < 5; i++) {
            let cardDrawn = deck.drawCard();
            cardDrawn.addToTable();
            GAME.cardsOnTable.push(cardDrawn);
        }

        console.log(GAME.players);
    }

    function setCurrentPlayer(playerIndex)
    {
        let playerNameHolder = $("#playerName");
        currentPlayerIndex   = (playerIndex < GAME.players.length) ? playerIndex : 0;

        /* Show the current players name on screen */
        playerNameHolder.text(GAME.players[currentPlayerIndex].name);
    }

    function setNextPlayer(playerIndex)
    {
        let playerNameHolder = $("#playerName");

        /* If the current player has already folded then advance to the next player */
        if (GAME.players[playerIndex].fold)
        {
            /* Show the current players name on screen */
            playerNameHolder.text(GAME.players[playerIndex].name + "(FOLDED)");

            /* Advance the current player index if the index will not go over the array.
             * If the index value will be over the array length then set the index to 0.
             */
            currentPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? ++currentPlayerIndex : 0;

            /* Show the two cards the current player has */
            for (let i = 0; i < 2; i++)
            {
                $("#playerCard" + (i + 1)).attr("src", GAME.players[playerIndex].cards[i].imagePath);
            }

            console.log("Current player index: " + currentPlayerIndex);
            console.log("Current player name: " + GAME.players[currentPlayerIndex].name);
            console.log("Current player fold status: " + GAME.players[currentPlayerIndex].fold);
        }
        else if (!GAME.players[playerIndex].fold)
        {
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

        /* Give the player two cards */
        for (let i = 0; i < 2; i++)
        {
            /* Draw a card from the deck and hand it to the player */
            player.addCard(deck.drawCard());
        }

        /* Show the card image for the 2 cards */
        for (let i = 0; i < 2; i++)
        {
            $("#playerCard" + (i + 1)).attr("src", player.cards[i].imagePath);
        }

        return player;

    }

    scope.checkCards = () => {
        for(const player of GAME.players){
            let allCards = [...player.cards, ...GAME.cardsOnTable];
            let cardCombinations = {
                pairs:[],
                threes:[],
                fours:[],
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
                        cardCombinations.threes.push(i);
                        break;
                    }
                    case 4: {
                        cardCombinations.fours.push(i);
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
                    console.log(tempDeck);

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
                player.best = {fours: cardCombinations.fours, kickers: player.cards};
            }else if(cardCombinations.threes.length && cardCombinations.pairs.length){
                player.best = {threes: cardCombinations.threes, pairs:cardCombinations.pairs};
            }else if(cardCombinations.flushCards.length){
                player.best = {flush: cardCombinations.flushCards};
            }else if(cardCombinations.straight){
                player.bext = {straight: cardCombinations.straight};
            }else if(cardCombinations.threes.length){
                player.best = {threes: cardCombinations.threes, kickers:player.cards};
            }else if(cardCombinations.pairs.length==2){
                player.best = {twoPairs: cardCombinations.pairs, kickers:player.cards};
            }else if(cardCombinations.pairs.length==1){
                player.best = {pair: cardCombinations.pairs};
            }else{
                player.best = {highest:highest};
            }
            
            
        }
        let winners = [];
        for (const player of GAME.players){
            console.log(player.best);
        }
        
    }
        
    })(scope, jQuery);
    