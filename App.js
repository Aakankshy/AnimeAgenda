'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

		_this.state = {
			hasGeneratedAlready: false,
			agendaToday: null
		};
		_this.generateAgenda = _this.generateAgenda.bind(_this);
		return _this;
	}

	_createClass(App, [{
		key: 'generateAgenda',
		value: function generateAgenda() {
			var _this2 = this;

			var animeToday = [];
			var day = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
			fetch("https://api.jikan.moe/v3/schedule/" + day).then(function (response) {
				response.json().then(function (info) {
					info[day].forEach(function (anime, a) {
						if (anime.members >= 2000) {
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

					_this2.setState({
						hasGeneratedAlready: true,
						agendaToday: animeToday
					});
				});
			}).catch(function (err) {
				console.log(err);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			return React.createElement(
				'div',
				{ className: 'app' },
				this.state.hasGeneratedAlready ? React.createElement(
					'div',
					{ className: 'agenda-container' },
					React.createElement(
						'div',
						{ className: 'heading-container' },
						'Today\'s Agenda'
					),
					this.state.agendaToday.map(function (anime) {
						return React.createElement(
							'div',
							{ className: 'anime' + _this3.state.agendaToday.indexOf(anime) },
							React.createElement(
								'a',
								{ href: anime.url, target: '_blank' },
								anime.title + ' - ' + (anime.score ? anime.score : "Not yet rated")
							)
						);
					})
				) : React.createElement(
					'button',
					{ className: 'generation-button', type: 'button', onClick: this.generateAgenda },
					'What\'s on the Agenda?'
				)
			);
		}
	}]);

	return App;
}(React.Component);

ReactDOM.render(React.createElement(
	React.StrictMode,
	null,
	React.createElement(App, null)
), document.querySelector('#root'));