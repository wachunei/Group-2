
/*
* DATA
*/
var cards1 = [
  {
    front: "1 + 1",
    back: "2",
    id: 1
  },
  {
    front: "1 + 3",
    back: "4",
    id: 2
  },
  {
    front: "1 + 5",
    back: "6",
    id: 3
  },
  {
    front: "1 + 7",
    back: "8",
    id: 4
  },
  {
    front: "3 + 3",
    back: "6",
    id: 5
  },
  {
    front: "4 + 1",
    back: "5",
    id: 6
  },
  {
    front: "2 + 3",
    back: "5",
    id: 7
  },
  {
    front: "9 + 2",
    back: "11",
    id: 8
  },
  {
    front: "2 + 7",
    back: "9",
    id: 9
  },
  {
    front: "6 + 8",
    back: "14",
    id: 10
  }
];

var cards2 = [];
var decks = [
  {title:"Two digits sum", id:1, cards: cards1},
  {title:"Another deck", id:2, cards: cards2}
];

/*
* Components
*/

// Main App
var App = React.createClass({
  getInitialState: function() {
    return {
      selected: undefined
    };
  },
  handleSelect: function(id, e) {
    var selected = decks.filter(deck => deck.id == id)[0];
    this.setState({selected: selected});
  },
  handleNewDeck: function(title) {
    var maxId = Math.max.apply(Math,decks.map(function(deck){return deck.id;}))
    var newDeck = {title:title, id: maxId+1, cards: []};
    decks.push(newDeck);
    this.setState({selected: newDeck});
  },
  deleteCard: function(id, e) {
    var filteredCards = this.state.selected.cards.filter(card => card.id != id);
    var newDeck = this.state.selected;
    newDeck.cards = filteredCards;
    this.setState({selected: newDeck});
  },
  newCard: function(question, answer) {
    var selected = this.state.selected;
    var maxCardId = selected.cards.length > 0 ? Math.max.apply(Math,selected.cards.map(function(card){return card.id;})): 1;
    var newCard = {front: question, back: answer, id: maxCardId+1};
    selected.cards.push(newCard);
    this.setState({selected: selected});
  },
  render: function() {
    return (
      <div>
      <header id="main-header"><h1>React Flip Cards {this.state.selected? '» '+ this.state.selected.title: ''}</h1></header>
      <DecksList decks={decks} clickHandle={this.handleSelect} handleNewDeck={this.handleNewDeck} selectedDeck={this.state.selected? this.state.selected.id : null} />
      <DeckStage cards={this.state.selected ? this.state.selected.cards: undefined} handleDelete={this.deleteCard} handleNewCard={this.newCard}/>
      </div>
    );
  }
});

// decks List
var DecksList = React.createClass({
  handleSelect: function(id, e) {
    this.props.clickHandle(id, e);
  },
  handleSubmit: function(title) {
    this.props.handleNewDeck(title);
  },
  render: function() {
    var self = this;
    var decks = this.props.decks.map(function(deck) {
      return <Deck
      isSelected={self.props.selectedDeck == deck.id}
      title={deck.title}
      key={deck.id}
      id={deck.id}
      clickHandle={self.handleSelect} />});

    return (
      <div id="decks-list">
        <DecksListForm onSubmit={this.handleSubmit}/>
        <h3>Decks</h3>
        {decks}
      </div>
    );
  },
});

var DecksListForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.title.value.trim();
    if(title == ''){
      return;
    }
    this.props.onSubmit(title);
    this.refs.title.value = '';
  },
  render: function() {
    return <form onSubmit={this.handleSubmit}>
      <h3>Create New Deck</h3>
      <input type="text" ref="deckTitle" placeholder="New Deck Title" ref="title"/>
      <input type="submit" value="Create" />
    </form>;
  }
});

// deck for list display
var Deck = React.createClass({
  titleClick: function(id,e) {
    e.preventDefault();
    this.props.clickHandle(id, e);
  },
  render: function() {
    var deckClasses = classNames({'deck': true, 'selected': this.props.isSelected})
    return (
      <div className={deckClasses}>
        <a href="#" className="deck-title" onClick={this.titleClick.bind(this, this.props.id)}>{this.props.title}</a>
      </div>
    );
  }
});

// deck stage for display
var DeckStage = React.createClass({
  handleDelete: function(id, e) {
    this.props.handleDelete(id, e);
  },
  handleNewCard: function(question, answer) {
    this.props.handleNewCard(question, answer);
  },
  render: function() {
    if(!this.props.cards) {
      return (
        <div id="deck-stage">
          <span className="alert-message">Select a deck</span>
        </div>
      );
    }

    var deckStageForm = <DeckStageForm onSubmit={this.handleNewCard}/>

    if(this.props.cards.length == 0) {
      return (
        <div id="deck-stage">
          {deckStageForm}
          <span className="alert-message">This deck has no cards</span>
        </div>
      );
    }

    var cards = this.props.cards.map(card =>
      <Card key={card.id}
      id={card.id}
      front={card.front}
      back={card.back} handleDelete={this.handleDelete} />);

    return (
      <div id="deck-stage">
      {deckStageForm}
       <div className="cards-container">{cards}</div>
      </div>
    );
  }
});

var DeckStageForm = React.createClass({
  handleNewCard: function(e) {
    e.preventDefault();
    var question = this.refs.question.value.trim();
    var answer = this.refs.answer.value.trim();
    if(question == '' || answer ==  '') {
      return;
    }
    this.props.onSubmit(question, answer);
    this.refs.question.value = this.refs.answer.value = '';
  },
  render: function() {
    return <form className="new-card-form" onSubmit={this.handleNewCard}>
      <h3>Add Card</h3>
      <label>
      Question:
      <input type="text" ref="question" />
      </label>
        <label>
        Answer:
        <input type="text" ref="answer"/>
        </label>
      <input type="submit" />
    </form>
  }
});

// deck cards for deck display
var Card = React.createClass({
  getInitialState: function() {
    return ({flipped: false, gone: false});
  },
  flipCard: function(e) {
    var nextState = !this.state.flipped
    this.setState({flipped: nextState});
  },
  deleteCard: function(id, e) {
    this.setState({gone: true});
    this.props.handleDelete(id, e);
  },
  render: function() {
    var cardClasses = classNames({'card':true, 'flipped': this.state.flipped, 'gone': this.state.gone});
    var cardActionsTop = <div className="card-actions card-actions-top">
      <span className="card-action" onClick={this.deleteCard.bind(this, this.props.id)} >Delete ╳</span>
    </div>;
    var cardActionsBottom = <div className="card-actions card-actions-bottom">
      <span className="card-action" onClick={this.flipCard}>
        ↪ Flip Card
      </span>
    </div>;
    return (
      <div className={cardClasses}>
        <div className="card-front">
          {cardActionsTop}
          <div className="card-content">
            {this.props.front}
          </div>
          {cardActionsBottom}
        </div>
        <div className="card-back">
          {cardActionsTop}
          <div className="card-content">
            {this.props.back}
          </div>
          {cardActionsBottom}
        </div>
      </div>
    );
  }
});


ReactDOM.render(
  <App />, document.getElementById('content')
);
