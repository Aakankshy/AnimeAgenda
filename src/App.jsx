'use strict';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasGeneratedAlready: false,
			agendaToday: null
		};
		this.generateAgenda = this.generateAgenda.bind(this);
	}

	generateAgenda() {
		var animeToday = [];
		const day = new Date().toLocaleString('en-us', {weekday:'long'}).toLowerCase();
		fetch("https://api.jikan.moe/v3/schedule/" + day)
			.then(response => {
				response.json().then(info => {
					info[day].forEach((anime, a) => {
						if(anime.members >= 2000) {
							animeToday.push(anime);
						}
					});

					for (var i = 0; i < animeToday.length; i++) {
						var maxIndex = i;
						for (var j = i + 1; j < animeToday.length; j++) {
							if (animeToday[j].score > animeToday[maxIndex].score) {
								maxIndex = j;
							}
						}
						var temp = animeToday[maxIndex];
						animeToday[maxIndex] = animeToday[i];
						animeToday[i] = temp;
					}

					this.setState({
						hasGeneratedAlready: true,
						agendaToday: animeToday
					});
				})
			})
			.catch(err => {console.log(err)});
	}

	render() {
		return(
			<div className="app">{
				this.state.hasGeneratedAlready
					? <div className='agenda-container'>
					<div className='heading-container'>Today's Agenda</div>
						{
							this.state.agendaToday.map(
								(anime, index) => <div className={`anime${index}`}>
									<a href={anime.url} target="_blank">
										{`${anime.title} - ${anime.score ? anime.score : "Not yet rated"}`}
									</a>
								</div>
							)
						}
					</div>
					: <button className='generation-button' type='button' onClick={this.generateAgenda}>What's on the Agenda?</button>
			}</div>
		);
	}
}

ReactDOM.render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
	document.querySelector('#root')
);
