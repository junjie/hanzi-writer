var writer;
var isCharVisible;
var isOutlineVisible;

function printStrokePoints(data) {
	var pointStrs = data.drawnPath.points.map(point => `{x: ${point.x}, y: ${point.y}}`);
	console.log(`[${pointStrs.join(', ')}]`);
}

function updateCharacter() {
	document.querySelector('#target').innerHTML = '';
	document.querySelector('#fanningTarget').innerHTML = '';

	var character = document.querySelector('.js-char').value;
	var strokeDelay = document.querySelector('.js-strokeDelay').value;
	
	window.location.hash = character;
	writer = HanziWriter.create('target', character, {
		width: 400,
		height: 400,
		delayBetweenStrokes: strokeDelay,
		onCorrectStroke: printStrokePoints,
		onMistake: printStrokePoints,
		showCharacter: false,
	});
	isCharVisible = true;
	isOutlineVisible = true;
	window.writer = writer;
	writer.animateCharacter();
		
	HanziWriter.loadCharacterData(character).then(function(charData) {
	  var target = document.getElementById('fanningTarget');
	  for (var i = 0; i < charData.strokes.length; i++) {
	    var strokesPortion = charData.strokes.slice(0, i + 1);
	    renderFanningStrokes(target, strokesPortion);
	  }
	});
}

function renderFanningStrokes(target, strokes) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  target.appendChild(svg);
  var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // set the transform property on the g element so the character renders at 75x75
  var transformData = HanziWriter.getScalingTransform(75, 75);
  group.setAttributeNS(null, 'transform', transformData.transform);
  svg.appendChild(group);

  strokes.forEach(function(strokePath) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', strokePath);
    // style the character paths
    path.style.fill = '#555';
    group.appendChild(path);
  });
}

window.onload = function() {
	var char = decodeURIComponent(window.location.hash.slice(1));
	if (char) {
		document.querySelector('.js-char').value = char;
	}

	updateCharacter();

	document.querySelector('.js-char-form').addEventListener('submit', function(evt) {
		evt.preventDefault();
		updateCharacter();
	});

	document.querySelector('.js-toggle').addEventListener('click', function() {
		isCharVisible ? writer.hideCharacter() : writer.showCharacter();
		isCharVisible = !isCharVisible;
	});
	document.querySelector('.js-toggle-hint').addEventListener('click', function() {
		isOutlineVisible ? writer.hideOutline() : writer.showOutline();
		isOutlineVisible = !isOutlineVisible;
	});
	document.querySelector('.js-animate').addEventListener('click', function() {
		writer.animateCharacter();
	});
	document.querySelector('.js-quiz').addEventListener('click', function() {
		writer.quiz({
			showOutline: true
		});
	});
}
