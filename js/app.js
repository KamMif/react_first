const my_news = [
  {
    author: 'Саша Печкин',
    text: 'В четчерг, четвертого числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 35 рублей!',
    bigText: 'А евро 42!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];

// --------------------------------------------------------App_Component

window.ee = new EventEmitter();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: my_news
    };
  }
  componentDidMount() {
    const self = this;
    window.ee.addListener('News.add', function(item) {
      const nextNews = item.concat(self.state.news);
      self.setState({news: nextNews})
    });
  }
  componentWillUnmount() {
    window.ee.removeListener('News.add');
  }
  render() {
    return (
      <div className="app">
        <h3>Новости: </h3>
        <Add />
        <News data={this.state.news} />
      </div>
    )
  }
};

class News extends React.Component {
  render() {
    const data = this.props.data;
    let newsTemplate
    
    if (data.length > 0) {
       newsTemplate = data.map(function(item, index) {
        return (
          <div key={index}>
            <Article data={item} />
          </div>
        )
      })
    } else {
      newsTemplate = <p>К сожалению новостей нет!!!</p>
    }
    return (
      <div className='news'>
        {newsTemplate}
        <strong className={ "news_count " + (data.length > 0 ? '' : 'none') }>Всего новостей: {data.length}</strong>
      </div>
    );
  }
};


//----------------------------------------------------Article_Component


class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.readmoreClick = this.readmoreClick.bind(this);
  }

  readmoreClick() {
    this.setState
      ({visible: true
    });
  }
  render() {
    const { author, text, bigText} = this.props.data;
    const visible = this.state.visible;

    return(
      <div className="article">
        <p className="news_author">{author}</p>
        <p className="news_text">{text}</p>
        <a href="#" onClick={this.readmoreClick} className={'news_readmore ' + (visible ? 'none' : '' ) }>Подробнее</a>
        <p className={'news_big-text ' + (visible ? '' : 'none')} >{bigText}</p>
      </div>
    ) 
  }
};

//-----------------------------------------------------Input_Component

class Add extends React.Component {
  constructor() {
    super();
    this.state = {
      agreeNotChecked: true,
      authorIsEmpty: true,
      textIsEmpty: true
    };
    this.onCheckRuleHandler = this.onCheckRuleHandler.bind(this); //Связываем метод с классом
    this.onBtnClickHandler = this.onBtnClickHandler.bind(this) // Связываем метод с классом
    this.onAuthorChange = this.onAuthorChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }
  onAuthorChange(e) { // Если длинна поля без пробелов больше 0, меняем состояние компонента (disable = false)
    if (e.target.value.trim().length > 0) {
      this.setState({authorIsEmpty: false})
    } else {
      this.setState({authorIsEmpty: true})
    }
  }
  onTextChange(e) {
    if (e.target.value.trim().length > 0) {
      this.setState({textIsEmpty: false})
    } else {
      this.setState({textIsEmpty: true})
    }
  }
  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.author).focus(); // устанавливаем фокус на поле author
  }
  onBtnClickHandler(e) { // присваеваем данные из полей переменным и выводим их на экран
    e.preventDefault();
    const author = ReactDOM.findDOMNode(this.refs.author).value;
    const text =ReactDOM.findDOMNode(this.refs.text).value;

    const item = [{
      author: author,
      text: text,
      bigText: '...'
    }];

    window.ee.emit('News.add', item);
    textEl.value = '';
    this.setState({textIsEmpty: true});
  }
  onCheckRuleHandler(e) { // меняем стейт компонента на противоположный 
    this.setState({agreeNotChecked: !this.state.agreeNotChecked})
  }
  render() {
    const { agreeNotChecked, authorIsEmpty, textIsEmpty } = this.state
    return(
      <form className='add'>
        <input
          type='text'
          className='add_author'
          onChange={this.onAuthorChange}
          placeholder='Ваше имя'
          ref='author'
        />
        <textarea
          className='add_text'
          onChange={this.onTextChange}
          placeholder='Текст новости'
          ref='text'
        ></textarea>
        <label className='add_checkrule'>
          <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleHandler}/>Я согласен с правилами
        </label>

        {/* берем значение для disabled атрибута из state */}
        <button
          className='add_btn'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}
          >
          Добавить новость
        </button>
      </form>
    )
  }
};




ReactDOM.render(
  <App />,
  document.getElementById('root')
)

