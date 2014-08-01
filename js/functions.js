// jQuery like syntax for retrieving elements

var $ = function (query) {
  if (document.querySelectorAll(query).length > 1) {
    var returnElement = document.querySelectorAll(query);
  }
  else {
    var returnElement = document.querySelector(query); 
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


/* yell namespace
   ========================================================================== */

if (typeof yell == 'undefined') yell = {};
if (typeof yell.app == 'undefined') yell.app = {};
if (typeof yell.addTouchEventTo == 'undefined') yell.addTouchEventTo = {};
if (typeof yell.transitionEnd == 'undefined') yell.transitionEnd = {};
if (typeof yell.cookies == 'undefined') yell.cookies = {};
(function(){

  /* yell.app functions
     ========================================================================== */

    // Initialise - currently adds touch capability to menu
    // need to add logic in re: touch capability and media query/screen size
    // Nee to also add removeTouchEventFrom functions
    this.app.init = function() {
      // Add touch events to Mobile/Burger menu icon and search icon
      yell.addTouchEventTo.mobileMenu();
      yell.addTouchEventTo.mobileSearch();
      // Move menu items into mainmenu div
      yell.app.moveMenuItemsToMain();
      // Add touch events to back buttons
      yell.addTouchEventTo.backButtons();
      // Add transitionend event listeners to sub menu
      yell.transitionEnd.subm();
      // Add transitionend event listeners to main menu
      yell.transitionEnd.main();
      // Add touch events to top level menu items
      yell.addTouchEventTo.topLevelMenuItems();
      // Add touch event to mobile search input button
      yell.addTouchEventTo.searchFind();
      // Add keyup event to mobile search term
      yell.app.mobileSearch();
    };

    this.app.whichTransitionEvent = function(){
      var t;
      var el = document.createElement('fakeelement');
      var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
      }
      for(t in transitions){
        if( el.style[t] !== undefined ){
          return transitions[t];
        }
      }
    }

    // Check if a menu is visible
    this.app.getMenuVisibility = function (menutype) {
      var prop;
      var elem;
      switch(menutype) {
        case 'main':
          prop = 'left';
          elem = '#mainmenu';
          break;
        case 'sub':
          prop = 'left';
          elem = '#submenu';
          break;
        case 'search':
          prop = 'top';
          elem = '#mobile-search';
          break;
      }

      var menuVisible = parseInt(getComputedStyle($(elem),null).getPropertyValue(prop));
      return menuVisible;
    };

    // Check if an element contains a specified element
    this.app.checkElementContains = function(containingelem,elemtocheck) {
      if(containingelem.querySelector([elemtocheck]) != null) {
        return true;
      }
      else {
        return false;
      }
    };

    // Find index of empty ul.subnavul
    this.app.findListIndex = function() {
      var topLevelMenuItems = $('li.top-level');
      var index;
      // Loop through items to find empty ul
      for (i=0;i<=topLevelMenuItems.length - 1;i++) {
        if (yell.app.checkElementContains(topLevelMenuItems[i],'ul.subnavul') == false) index = i;
      }
      return index;
    };


    // Move menu items into #mainmenu div
    this.app.moveMenuItemsToMain = function() {
      $('#mainmenu').appendChild($('.nav2'));
    };

    // Move list from #submenu to respective li.top-level
    this.app.moveListToMain = function(index) {
      var thelist = $('#submenu .subnavul');
      var topLevelMenuItems = $('li.top-level');
      topLevelMenuItems[index].appendChild(thelist);
    };

    // Mobile Menu Sub Menu Back link tapped
    this.app.goBack = function() {
      // Show main menu
      yell.showMainMenu();
      // Hide sub menu
      yell.hideSubMenu();
    };

  
  /* yell.addTouchEventTo functions
     ========================================================================== */

  /*
  this.addTouchEventTo.somefunc = function() {
    console.log('yes it works');
  }
  */

  // Add touch events to top level menu items
  this.addTouchEventTo.topLevelMenuItems = function() {
    var topLevelMenuItems = $('li.top-level');
    for (i=0;i<topLevelMenuItems.length;i++) {   
      topLevelMenuItems[i].addEventListener('touchstart', yell.addTouchEventTo.topLevelMenuItem,false );
    }
  }
  
  this.addTouchEventTo.topLevelMenuItem = function() {
    if (yell.app.checkElementContains(this,'ul.subnavul')) {
      $('#submenu').appendChild(this.querySelector('.subnavul'));
      yell.hideMainMenu();
      yell.showSubMenu();
    }
  }

  // Add sub menu back button click/touch events
  this.addTouchEventTo.backButtons = function() {
    var backButtons = $('.back');
    for (i=0;i<=backButtons.length - 1;i++) {
        backButtons[i].addEventListener('touchstart', yell.addTouchEventTo.backButton, false);
    }
  };

  this.addTouchEventTo.backButton = function(e) {
    e.stopPropagation();
    yell.app.goBack();
  }

  // Add touch event handler to mobile/burger menu icon
  this.addTouchEventTo.mobileMenu = function() {
    $('#mobile-menu-icon').addEventListener('touchstart', yell.addTouchEventTo.mobileMenuButton, false);
  }

  this.addTouchEventTo.mobileMenuButton = function() {
    yell.showMenuContainer();
    // Check to see whether search menu is visible
    if (yell.app.getMenuVisibility('search') > 0) {
      yell.hideMobileSearch();
      $('#searchterm').blur();
    }

    // Check menu state
    // if both main and sub are off-screen, show main
    if (yell.app.getMenuVisibility('main') < 0 && yell.app.getMenuVisibility('sub') > 0) {
      console.log('*main and sub not visible, show main');
      yell.showMainMenu();
    }

    // If main is showing, hide it
    if (yell.app.getMenuVisibility('main') == 0) {
      console.log('*main is showing, hide main');
      yell.hideMainMenu();
    }

    // If sub is showing, hide it
    if (yell.app.getMenuVisibility('sub') == 0) {
      console.log('*sub is showing, hide sub');
      yell.hideSubMenu();
    }
  }

  // Add touch event handler to mobile search icon
  this.addTouchEventTo.mobileSearch = function() {
    $('#mobile-search-icon').addEventListener('touchstart', yell.addTouchEventTo.mobileSearchButton, false);
  }

  this.addTouchEventTo.mobileSearchButton = function() {
    console.log('*search clicked');

    // If main is showing, hide it
    if (yell.app.getMenuVisibility('main') == 0) {
      console.log('*main is showing, hide main');
      yell.hideMainMenu();
    }

    // If sub is showing, hide it
    if (yell.app.getMenuVisibility('sub') == 0) {
      console.log('*sub is showing, hide sub');
      yell.hideSubMenu();
    }

    // If search is hidden, show it
    if (yell.app.getMenuVisibility('search') < 0) {
      yell.showMobileSearch();
    }
    // otherwise hide search
    else {
      yell.hideMobileSearch();
    }
  }

  // Add touch event handler to search form button
  this.addTouchEventTo.searchFind = function() {
    $('#search-btn').addEventListener('touchstart', yell.addTouchEventTo.searchFindButton, false);
  }

  this.addTouchEventTo.searchFindButton = function() {
    console.log('search button clicked');
    var searchTerm = $('#mobile-search #searchterm').value;
    if (searchTerm.length < 1) {
      console.log('search term empty, show error');
      $('.mobile-search-error').style.display='block';
      //$('#mobile-search #searchterm').focus();
    }
    else {
      console.log('search term is:' + searchTerm);
      console.log('OK to submit form');
      // submit form here ...
    }
  }

  // Mobile search term keyup
  this.app.mobileSearch = function() {
    $('#mobile-search #searchterm').addEventListener('keyup', yell.app.mobileSearchKeyup, false);
  }

  this.app.mobileSearchKeyup = function() {
    console.log('search focus, ' + $('.mobile-search-error').style.display);
    if ($('.mobile-search-error').style.display == 'block') {
      $('.mobile-search-error').style.display = 'none';
    }
  }

  // Show/Hide Mobile Search
  this.showMobileSearch = function() { addClass($('#mobile-search'),'mobilesearchslidein'); };
  this.hideMobileSearch = function() { removeClass($('#mobile-search'),'mobilesearchslidein'); };

  // Show/Hide Main Menu
  this.showMainMenu = function() { addClass($('#mainmenu'),'mainmenuslideright'); };
  this.hideMainMenu = function() { removeClass($('#mainmenu'),'mainmenuslideright'); };

  // Show/Hide Sub Menu
  this.showSubMenu = function() { addClass($('#submenu'),'submenuslideleft'); };
  this.hideSubMenu = function() { removeClass($('#submenu'),'submenuslideleft'); };

  // Show/Hide Menu Container
  this.showMenuContainer = function() { addClass($('#container'),'show'); };
  this.hideMenuContainer = function() { removeClass($('#container'),'show'); };


  /* transition end events
     ========================================================================== */

  // Main menu 
  this.transitionEnd.main = function() {
    var transitionEvent = yell.app.whichTransitionEvent();
    transitionEvent && $('#mainmenu').addEventListener(transitionEvent, yell.transitionEnd.mainMenu, false);
  }

  this.transitionEnd.mainMenu = function () {
    console.log('*new mainMenuTransitionEnd function firing');
    if (yell.app.getMenuVisibility('main') < 0 && yell.app.getMenuVisibility('sub') != 0) yell.hideMenuContainer();
  }

  // Sub menu
  this.transitionEnd.subm = function() {
    var transitionEvent = yell.app.whichTransitionEvent();
    transitionEvent && $('#submenu').addEventListener(transitionEvent, yell.transitionEnd.subMenu, false);
  }

  this.transitionEnd.subMenu = function() {
    console.log('*new subMenuTransitionEnd function firing');
    // If sub menu isn't visible, append the list to the relevant top level item and hide it
    if (yell.app.getMenuVisibility('sub') > 0) {
      yell.app.moveListToMain(yell.app.findListIndex());
    }
    if (yell.app.getMenuVisibility('main') < 0 && yell.app.getMenuVisibility('sub') != 0) yell.hideMenuContainer();
  }


  this.isTouchDevice = function() { return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);};



  /* Cookie functions
     ========================================================================== */

  this.cookies.getItem = function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    };

  this.cookies.setItem = function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    };

  this.cookies.removeItem = function(sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    };

  this.cookies.hasItem = function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    };

  this.cookies.keys = function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    };

}).call(yell);