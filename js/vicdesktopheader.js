// jQuery like syntax for retrieving elements

var $ = function (query) {
  var returnElement;
  if (document.querySelectorAll(query).length > 1) {
    returnElement = document.querySelectorAll(query);
  }
  else {
    returnElement = document.querySelector(query); 
  }
  return returnElement;
};

// Add Class
function addClass(elem, className) {
  if (elem.classList)
  elem.classList.add(className);
else
  elem.className += ' ' + className;
}

// Remove Class
function removeClass(elem, className) {

  if (elem.classList)
    elem.classList.remove(className);
  else
    elem.className = elem.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function addmouseover() {
	console.log('mouseover');
	addClass(this,'hover1');
}

function addmouseout() {
	console.log('mouseout');
	removeClass(this,'hover1');
}

var menuItems;


document.addEventListener('DOMContentLoaded', function() {


	console.log('DOM Ready');


	menuItems = $('.nav2').children;
	var i;
	for (i=0;i<menuItems.length;i++) {

		menuItems[i].addEventListener('mouseover', addmouseover, false);
		menuItems[i].addEventListener('mouseout', addmouseout, false);
		console.log(i);
	}

});


