'use strict';

/**
 * @var Системные, на них завязан некоторый функционал
 */
var queryIsSimple = /^(#?[\w-]+|\.[\w-.]+)$/, eventsList = [], storageCache = _getStorage();

/* Очистка консоли от мусора */
console.clear();

/* Ну расширение почти загружено */
document.body.style.opacity = 1;

/**
 * Тут заполнять фичи титулов
 */
var userTitles = {
	'Aлександр': {
		name: '<strong>Создатель MipedSmiles</strong>',
		background: {
			color: '#000',
		},
		emHandler: function(em){
			em.style.color = '#fff';
		}
	},
	'Negezor': {
		background: {
			name: 'negezor.png'
		}
	},
	'AnotherOne': {
		name: 'Генерал канавы',
		background: {
			name: 'anotherone.png'
		}
	},
	'Occultist': {
		name: '<strong>ღ♥</strong>',
		background: {
			name: 'occulist.gif'
		}
	},
	'flnn_human': {
		background: {
			name: 'flnn_human.gif'
		}
	},
	'Lynxire': {
		name: '<strong>Грибная богиня</strong>',
		background: {
			name: 'lynxire.png'
		}
	},
	'bold222': {
		background: {
			name: 'bold222.jpg'
		}
	},
	'_Trader Milk_': {
		name: '<strong>трапоняшка</strong>',
		background: {
			name: 'trader_milk.gif'
		}
	},
	'Dany1508': {
		name: '<strong>ТОПОВЫЙ КУН</strong>',
		background: {
			name: 'dany1508.jpg'
		}
	},
	'Logequm': {
		background: {
			name: 'logequm.gif'
		}
	}
};

/**
 * ----
 *
 * Определение некотрых элементов форума
 *
 * ----
 */

var controllers = {
	conversation: 'переписка с пользователем',
	conversations: 'список переписок',
	members: 'список пользователей',
	member: 'страница пользователя',
	threads: 'тема обсуждения',
	search: 'страница поиска',
	main: 'главная страница'
};

var controller = /\/f\/([^/]+)/i.exec(window.location.pathname);
var params = /(\w+)\.(\d+)/i.exec(window.location.pathname);

if (controller === null) {
	controller = 'main';
} else {
	controller = controller[1];
}

if (params !== null) {
	params.shift();

	if (controller === 'members') {
		controller = 'member';
		controllers.member += ' '+params[0];
	}

	if (controller === 'conversations') {
		controller = 'conversation';
	}
}

log('Открыта «'+(controllers[controller] || 'неизвестная страница')+'»');

var isDarkTheme = (function(){
	var choosers = $$('footer .choosers a');

	if (1 in choosers) {
		return choosers[1].innerHTML === 'miped.ru dark';
	}

	return getStorage('theme',false);
})();

setStorage('theme',isDarkTheme);

log('Активирована «'+(isDarkTheme?'тёмная':'светлая')+'» тема');

$('html').classList.add(isDarkTheme?'miped-theme-dark':'miped-theme-light');


/**
 * ----
 *
 * Титулы
 *
 * ----
 */

var messageList = $('#messageList');
if (['threads','conversation'].indexOf(controller) > -1 && messageList) {
	$$('.message',messageList).forEach(updatePostTitle);

	var observerNewMessage = new MutationObserver(function(mutations){
		$$('.message',messageList).forEach(updatePostTitle);
	});

	observerNewMessage.observe(messageList,{
		childList: true
	});
}

/**
 * Обновляет пост под юзера
 *
 * @param object post
 */
function updatePostTitle (post) {
	if (post.classList.contains('miped-processed')) {
		return;
	}

	var tooltip = $('.Tooltip',post);

	if (tooltip !== null) {
		tooltip.style.display = 'none';
		$('.avatar',post).classList.add('miped-avatar-online');
	}

	post.classList.add('miped-processed');

	var plusRep = $('.pairsInlineplus img',post);

	/* В любом случае нельзя поставить себе +rep) */
	if (plusRep !== null) {
		plusRep.src = getURL('/images/plus-reputation.png');
	} else {

	}

	var minusRep = $('.pairsInlineminus img',post);

	if (minusRep !== null) {
		minusRep.src = getURL('/images/minus-reputation.png');
	}

	var name = post.getAttribute('data-author');

	if (!(name in userTitles)) {
		return;
	}

	var user = userTitles[name];

	var em = createElement('em',{
		class: 'userBanner bannerStaff wrapped mipedCreator'
	});

	em.innerHTML = '<span class="before"></span>'+(user.name || '<div class="miped-titles-extend"></div>')+'<span class="after"></span>';

	if ('background' in user) {
		var background = null;

		if ('url' in user.background) {
			background = 'url('+user.background.url+')';
		} else if ('name' in user.background) {
			background = 'url('+getURL('/images/banner/'+user.background.name)+')';
		} else if ('color' in user.background) {
			background = user.background.color;
		}

		if (background !== null) {
			em.style.background = background;
		}
	}

	if ('emHandler' in user) {
		user.emHandler(em);
	}

	$('.userText',post).appendChild(em);

	if ('postHandler' in user) {
		user.postHandler(post);
	}
}

/**
 * ----
 *
 * Интерфейс настроек с боку (но пико)
 *
 * ----
 */

fetch(getURL('/assets/settings.html'),{
	credentials: 'include'
})
.then(function(response){
	return response.text();
})
.then(function(template){
	document.body.insertBefore(parseHTML(template),document.body.firstChild);

	var isEnabledVk = putStorage('vk',true);
	var isEnabledTwitch = putStorage('twitch',true);
	var isEnabledAnimenu = putStorage('animenu',false);

	log('Emoji вконтакте «'+(isEnabledVk?'включены':'выключены')+'»');
	log('Emoji твича «'+(isEnabledTwitch?'включены':'выключены')+'»');
	log('Аниме меню «'+(isEnabledAnimenu?'включено':'выключено')+'»');

	$('#nt').src = getURL('/images/'+(isEnabledAnimenu?'animenu':'menu')+'.png');

	var smilePanel = $('#smile_panel');

	$$('input',smilePanel).forEach(function(input){
		input.checked = getStorage(input.dataset.setting,false);
	});

	on(smilePanel,'change','input',function(event){
		setStorage(event.target.dataset.setting,event.target.checked);
	});
});

/**
 * ----
 *
 * Собственно сама установка нормальных emoji
 *
 * ----
 */

 if (['threads','conversation','posts'].indexOf(controller) > -1) {
	fetch(getURL('/assets/smiles.txt'))
	.then(function(response){
		return response.text();
	})
	.then(function(smilesList){
		smilesList = smilesList.trim();

		var fragmentSmiles = document.createDocumentFragment();

		appendSmiles('vk');
		appendSmiles('twitch');

		var ul = createElement('ul',{
			id: 'SmilieCategories1462645490',
			class: 'primaryContent smilieContainer'
		});
		var li = createElement('li',{
			class: 'smilieCategory'
		});

		li.appendChild(fragmentSmiles);
		ul.appendChild(li);

		log('Emoji загружены и распарсены!');

		on(document.body,'click','.redactor_btn_smilies',function(event){
			var redactorBox = event.target.closest('.redactor_box');

			var interval = setInterval(function(){
				var redactor = $('.redactor_smilies',redactorBox);

				if (redactor === null) {
					return;
				}

				clearInterval(interval);

				redactor.innerHTML = '';
				redactor.appendChild(ul);
			},500);
		});

		function appendSmiles (name) {
			var fragment = document.createDocumentFragment();

			var devider = createElement('div',{
				class: 'miped-smile-devider'
			});

			if (getStorage(name,true)) {
				fragment.appendChild(getImg(getURL('/images/'+name+'.png')));

				parseBlockSmile(name,smilesList)
				.forEach(function(src){
					var li = createElement('li',{
						'data-text': '',
						class: 'Smilie'
					});
					li.appendChild(getImg(src));

					fragment.appendChild(li);
				});
			} else {
				fragment.appendChild(getImg(getURL('/images/'+name+'_off.png')));
			}

			devider.appendChild(fragment);

			fragmentSmiles.appendChild(devider);
		}

		function getImg (src) {
			return createElement('img',{
				src: src,
				class: 'miped-smile'
			});
		}
	});
}

/**
 * Парсирит блок со смайлами
 *
 * @param string name
 * @param string smiles
 *
 * @return array
 */
function parseBlockSmile (name,smiles) {
	var indexStart, indexEnd, startString;

	startString = '['+name+']';

	indexStart = smiles.indexOf(startString);
	indexEnd = smiles.indexOf('[/'+name+']');

	if (indexStart === -1 || indexEnd === -1) {
		return [];
	}

	indexStart += startString.length;
	indexEnd -= startString.length;

	return smiles.substr(indexStart,indexEnd).trim().replace(/\[\/?\w+\]/ig,'').split('\n');
}

/**
 * ----
 *
 * Новые профили пользователей
 *
 * ----
 */

if (controller === 'member') {
	var content = $('#content');

	content.classList.add('miped-member');

	$$('.messageSimple img',content).forEach(function(avatar){
		avatar.src = avatar.src.replace(/\/s\//i,'/l/');
	})

	/**
	 * TODO: Добавить аватарку в профиль
	 * На данный момент без CSS
	 */

	/*

	var avatar = createElement('img',{
		class: 'miped-member-avatar',
		src: $('.mast img',content).src
	});

	var title = $('.mainText h1',content);

	title.parentNode.insertBefore(avatar,title.nextSibling);

	*/
}

/**
 * ----
 *
 * Всё что находится внизу
 * Производительная и не костыльная реализация функционала
 *
 * ----
 */

/**
 * Возвращает URL от расширения
 *
 * @param string path
 *
 * @return string
 */
function getURL (path) {
	return chrome.extension.getURL(path);
}

/**
 * Снипет для одного элемента
 * (Снипет сворован с консоли)
 *
 * @param string selector
 * @param object context
 *
 * @return nodeElement
 */
function $ (selector,context) {
	return $$(selector,context)[0] || null;
}

/**
 * Производтельный QuerySelector
 *
 * @param string selector
 * @param object context
 *
 * @return array
 */
function $$ (selector,context) {
	context = context || document;

	if (!queryIsSimple.test(selector)) {
		return Array.prototype.slice.call(context.querySelectorAll(selector));
	}

	switch (selector.charAt(0)) {
		case '#':
			return [context.getElementById(selector.substr(1))];
		case '.':
			return Array.prototype.slice.call(context.getElementsByClassName(
				selector.substr(1).replace(/\./g,' ')
			));
		default:
			return Array.prototype.slice.call(context.getElementsByTagName(selector));
	}
}

/**
 * Живой обработчик событий
 *
 * @param mixed    element
 * @param string   name
 * @param string   selector
 * @param function handler
 */
function on (element,name,selector,handler) {
	if (typeof element === 'string') {
		element = $(element);
	}

	eventsList.push({
		name: name,
		element: element,
		handler: handler,
		selector: selector
	});

	element.addEventListener(name,function(event){
		var target = event.target;
		var current = event.currentTarget;

		while (target !== current && !target.matches(selector)) {
			target = target.parentNode;
		}

		if (target !== current) {
			handler.call(target,event);
		}
	},false);
}

/**
 * Удаляет живой обработчик событий
 *
 * @param function handler
 */
function off (handler) {
	eventsList.forEach(function(delegate,key){
		if (delegate.handler !== handler) {
			return;
		}

		delegate.removeEventListener(delegate.name,delegate.handler,false);
		eventsList.splice(key,1);
	});
}

/**
 * Логирует действия в консоль
 */
function log () {
	var args = Array.prototype.slice.call(arguments);

	args.unshift('%c[MipedSmiles]','background: #3949AB; color: #fff;padding: 1px 2px');

	console.log.apply(console,args);
}

/**
 * Возвращает значение иначе сохраняет его
 *
 * @param string key
 * @param mixed  value
 *
 * @return mixed
 */
function putStorage (key,value) {
	var storage = getStorage(key);

	if (storage === null) {
		return setStorage(key,value);
	}

	return storage;
}

/**
 * Проверяет наличие в локальном хранилище
 *
 * @param string key
 *
 * @return boolean
 */
function hasStorage (key) {
	return key in storageCache;
}

/**
 * Возвращает их хранилища
 *
 * @param string key
 * @param mixed  value
 *
 * @return mixed
 */
function getStorage (key,value) {
	if (hasStorage(key)) {
		return storageCache[key];
	}

	return value !== undefined?value:null;
}

/**
 * Устанавливает значение в хранилище
 *
 * @param string key
 * @param mixed  value
 *
 * @return mixed
 */
function setStorage (key,value) {
	storageCache = _getStorage();

	storageCache[key] = value;

	localStorage.setItem('MipedSmiles',JSON.stringify(storageCache));

	return storageCache[key];
}

/**
 * Возвращает полностью хранилище
 *
 * @private
 *
 * @return object
 */
function _getStorage () {
	var storage = localStorage.getItem('MipedSmiles');

	if (storage === null) {
		storage = {};
	} else {
		storage = JSON.parse(storage);
	}

	return storage;
}

/**
 * Парсирит HTML
 *
 * @param string html
 *
 * @return object
 */
function parseHTML (html) {
	var domParser = new DOMParser();

	domParser = domParser.parseFromString(html,'text/html');
	domParser = domParser.querySelector('body');

	return domParser.childNodes[0];
}

/**
 * Создаёт элемент с атрибутами
 *
 * @param string name
 * @param object options
 *
 * @return nodeElement
 */
function createElement (name,options) {
	options = options || {};

	var element = document.createElement(name), attribute;

	for (attribute in options) {
		element.setAttribute(attribute,options[attribute]);
	}

	return element;
}
