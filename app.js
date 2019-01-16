class Storage {
     constructor(key) {
         this.key = key;
     }
getStorage() {
    const data = window.localStorage.getItem(this.key);
         if (data) {
             return JSON.parse(data)

         } else {
             return data;
         }
     }
save(data){
   window.localStorage.setItem(this.key,JSON.stringify(data))

}     
 }

 //--- GLOBAL VARIABLES 
const storage = new Storage('app-state');
const greenBtn = document.querySelector('.greenBtn');
const header = document.querySelector('.greyHeader');
const redBtn = document.querySelector('.redBtn');
const deckId = document.querySelector('.deckId');
const cardsRemaining = document.querySelector('.cardsRemaining')
const displayContainer = document.querySelector('.displayContainer')

//--- API 
//this one is calling for shuffle the deck the red button
const getNewShuffledDeck = (cb)=> {
   const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
   let request = new XMLHttpRequest();
   request.open('GET', url);
   request.addEventListener('load', (e)=>{
       const data = JSON.parse(e.currentTarget.response)
       console.log(data)
       cb(data)
   })
 request.send();
}
// this one is calling API for getting new cards the green button
const drawNewCard = (deckId, cb )=> {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', (e)=>{
        const data = JSON.parse(e.currentTarget.response)
        cb(data)
    })
    request.send();
}

const cardsShwToHTML = (card) =>{
    return `<div class='card' cardId='${card.code}'>
            <p class='value'>${card.value} ${card.suit}</p>
            <img src='${card.image}'>
            </div>`;
}

const saveAndRender = () => {
   storage.save(state);
   render(state)
} 

 //--- STATE 
let state = {
    greenBTN: 'hide',
    deckId: '',
    cardsRemaining: '',
    cardsDrawn: [],

}


//--- RENDER 
const render = state => {
 if(state.greenBtn === 'show'){
     greenBtn.classList.remove('hidden');
 }
 if(state.deckId){
     deckId.innerHTML = `<span>DECK ID:${state.deckId}</span`;
     cardsRemaining.innerHTML =`<span>CARDS REMAINING:${state.cardsRemaining}</span>`;
 }
  const cardsToHTML = state.cardsDrawn.reduce((acc, card)=>{
      return acc + cardsShwToHTML(card)
      
  }, '');

     displayContainer.innerHTML = cardsToHTML;
     console.log(cardsToHTML)
  
}





//--- EVENTS 
header.addEventListener('click', e =>{
    // --------- EVENT: CLICK ON RED BUTTON TO DRAW NEW DECK
    if(e.target.value === 'New Deck'){
        console.log("here")
        getNewShuffledDeck(data => {
            state.deckId = data.deck_id;
            state.cardsRemaining = data.remaining;
            state.cardsDrawn = [];
            state.greenBtn = 'show';
            saveAndRender();
        });
    }
   // ---------- EVENT: CLICK ON GREEN BTN TO DRAW NEW CARD 
   if(e.target.value === 'Draw Card'){
    if(state.cardsRemaining === 0){
        alert("52 cards are displayed please click new Deck button again")
        getNewShuffledDeck(data => {
            state.deckId = data.deck_id;
            state.cardsRemaining = data.remaining;
            state.cardsDrawn = [];
            state.greenBtn = 'show';
            saveAndRender();
        })
    }
}
    if(e.target.value === 'Draw Card'){
        if(state.cardsRemaining > 0){
           drawNewCard(state.deckId, data =>{
            state.cardsDrawn.unshift(data.cards[0]);
            state.cardsRemaining--;
            saveAndRender();      
           })
        }
    } 

})

 //---- RETRIEVE SAVED STATE 
 const stored_state = storage.getStorage();
 if(stored_state){
      state.deckId = stored_state.deckId;
      state.cardsRemaining = stored_state.cardsRemaining;
      state.cardsDrawn = stored_state.cardsDrawn;
 }
 render(state)