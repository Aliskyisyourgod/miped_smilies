function copySmiles() {
	var element = '['+document.querySelector('.accountUsername').innerHTML+']';
	
	get_storage('userSmiles', true).forEach(function (a) {
		element += ' '+a;
	});
}

function del(id) {
	document.querySelector('#containerLink .i'+id).outerHTML = '';
}

function addLink() {
	var alls = document.createElement('div'),
		call = document.querySelectorAll('.smilediv #containerLink div').length;
		
	alls.className = 'boss i'+call;
		
	alls.innerHTML = "<img src=\"\" class=\"i"+call+" ms_image\" style='width: 26px; height: 26px;'><input value='' onchange=\"document.querySelector('.i"+call+"').src = this.value;\"><span onclick=\"del("+call+");\" class='listButton' style='font-size: 12px;'>D</span></div>";
	document.querySelector('#containerLink').appendChild(alls);
}

function saveSmilies(){
	var massive = [];
	
	document.querySelectorAll('#containerLink input').forEach(function(a, k) {
		massive[k] = a.value;
	});
	
	setStorage('userSmiles', massive);
	
	location.reload();
}

function getStorage (key,value) {
	if (hasStorage(key)) {
		return storageCache[key];
	}
	
	return value !== undefined?value:null;
}

function setStorage (key,value) {
	storageCache = _getStorage();
	
	storageCache[key] = value;
	
	localStorage.setItem('MipedSmiles', JSON.stringify(storageCache));
	
	return storageCache[key];
}

function _getStorage () {
	var storage = localStorage.getItem('MipedSmiles');
	
	if (storage === null) {
		storage = {};
	} else {
		storage = JSON.parse(storage);
	}
	
	return storage;
}