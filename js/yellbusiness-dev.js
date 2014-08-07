/* tap.js
   ========================================================================== */
/*!
 * tap.js
 * Copyright (c) 2013 Alex Gibson, http://alxgbsn.co.uk/
 * Released under MIT license
 */
(function (window, document) {

    'use strict';

    function Tap(el) {
        el = typeof el === 'object' ? el : document.getElementById(el);
        this.element = el;
        this.moved = false; //flags if the finger has moved
        this.startX = 0; //starting x coordinate
        this.startY = 0; //starting y coordinate
        this.hasTouchEventOccured = false; //flag touch event
        el.addEventListener('touchstart', this, false);
        el.addEventListener('touchmove', this, false);
        el.addEventListener('touchend', this, false);
        el.addEventListener('touchcancel', this, false);
        el.addEventListener('mousedown', this, false);
        el.addEventListener('mouseup', this, false);
    }

    Tap.prototype.start = function (e) {
        if (e.type === 'touchstart') {
            this.hasTouchEventOccured = true;
        }
        this.moved = false;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    };

    Tap.prototype.move = function (e) {
        //if finger moves more than 10px flag to cancel
        if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
            this.moved = true;
        }
    };

    Tap.prototype.end = function (e) {
        var evt;

        if (this.hasTouchEventOccured && e.type === 'mouseup') {
            e.preventDefault();
            e.stopPropagation();
            this.hasTouchEventOccured = false;
            return;
        }

        if (!this.moved) {
            //create custom event
            if (window.CustomEvent) {
                evt = new window.CustomEvent('tap', {
                    bubbles: true,
                    cancelable: true
                });
            } else {
                evt = document.createEvent('Event');
                evt.initEvent('tap', true, true);
            }
            
            // dispatchEvent returns false if any handler calls preventDefault,
            if (!e.target.dispatchEvent(evt)) {
                // in which case we want to prevent clicks from firing.
                e.preventDefault();
            }
        }
    };

    Tap.prototype.cancel = function (e) {
        this.hasTouchEventOccured = false;
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
    };

    Tap.prototype.destroy = function () {
        var el = this.element;
        el.removeEventListener('touchstart', this, false);
        el.removeEventListener('touchmove', this, false);
        el.removeEventListener('touchend', this, false);
        el.removeEventListener('touchcancel', this, false);
        el.removeEventListener('mousedown', this, false);
        el.removeEventListener('mouseup', this, false);
        this.element = null;
    };

    Tap.prototype.handleEvent = function (e) {
        switch (e.type) {
        case 'touchstart': this.start(e); break;
        case 'touchmove': this.move(e); break;
        case 'touchend': this.end(e); break;
        case 'touchcancel': this.cancel(e); break;
        case 'mousedown': this.start(e); break;
        case 'mouseup': this.end(e); break;
        }
    };

    window.Tap = Tap;

}(window, document));


// Tap Usage

/*

var el = document.getElementById('my-id');
myTap = new Tap(el);

el.addEventListener('tap', onTap, false);

function onTap (e) {
    //your code
}

el.removeEventListener('tap', onTap, false);

*/


/* Common functions
   ========================================================================== */

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
    if (elem.classList) {
        elem.classList.add(className);
    } else {
        elem.className += ' ' + className;
    }
}

// Remove Class
function removeClass(elem, className) {
    if (elem.classList) {
        elem.classList.remove(className);
    } else {
        elem.className = elem.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}

// Has Class
function hasClass(elem, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(elem.className);
}

// Remove node
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// Load external JS Files
function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}





/* DOM Ready
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Loaded');
    // Generic touchstart enabler - don't think this will be needed
    //document.addEventListener("touchstart", function () { }, true);

    if (!window.CustomEvent) {
        console.log('Looks like IE :(');
    }



    // Initialise App
    yell.app.init();

});

/* Resize window
   ========================================================================== */

window.onresize = function (e) {
    yell.app.resizeDelay(function () {
        console.log(new Date().getTime());

        if (window.outerWidth < yell.app.mobileViewWidth) {
            console.log('mobile view - ' + window.outerWidth);
            // remove desktop view if necessary and show mobile view

        }
        else {
            console.log('desktop view - ' + window.outerWidth);
            // remove mobile view if necessary and show desktop view
        }
        yell.app.detectView();
    }, 250);
}




/* yell namespace
   ========================================================================== */
if (typeof yell == 'undefined') yell = {};
if (typeof yell.app == 'undefined') yell.app = {};
if (typeof yell.addTouchEventTo == 'undefined') yell.addTouchEventTo = {};
if (typeof yell.removeTouchEventFrom == 'undefined') yell.removeTouchEventFrom = {};
if (typeof yell.addTapEventTo == 'undefined') yell.addTapEventTo = {};
if (typeof yell.removeTapEventFrom == 'undefined') yell.removeTapEventFrom = {};
if (typeof yell.addMouseEventTo == 'undefined') yell.addMouseEventTo = {};
if (typeof yell.transitionEnd == 'undefined') yell.transitionEnd = {};
if (typeof yell.cookies == 'undefined') yell.cookies = {};


(function () {

    /* yell.app functions
       ========================================================================== */

    // Set mobile view width/breakpoint
    this.app.mobileViewWidth = 768;
    this.app.resizeDelay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };

    })();

    // Initialise - currently adds touch capability to menu
    // need to add logic in re: touch capability and media query/screen size

    this.app.init = function () {

        // Add tracking to all a tags with data attribute 'linkname'
    
        // Detect voew
        yell.app.detectView();
        
    }

    this.app.detectView = function() {
        var hasOrientation = yell.isMobileDevice();
        var hasTouch = yell.isTouchDevice();
        /*
        if (hasOrientation) {
            console.log('orientation detected - probably a mobile device');
        }

        if (hasTouch) {
            console.log('touch detected - probably a mobile device');
            yell.app.showMobileView();
        }
        */
        // If device has touch and orientation and screen width is less than mobile width - show mobile menu
        if (hasTouch && hasOrientation && window.innerWidth < yell.app.mobileViewWidth) {
            console.log('touch and orientation detected but viewport is less than ' + yell.app.mobileViewWidth + ' - show mobile menu');
            yell.app.showMobileView();   
        }
        // If device has touch and orientation and screen width is greater than mobile width - show desktop menu
        if (hasTouch && hasOrientation && window.innerWidth >= yell.app.mobileViewWidth) {
            console.log('touch and orientation detected but viewport is greater than ' + yell.app.mobileViewWidth + ' - show desktop menu');
            yell.app.showDesktopView();            
        }

        /*
        if (!hasOrientation) {
            console.log('no orientation detected - probably not a mobile device');
        }

        if (!hasTouch) {
            console.log('no touch detected - probably not a mobile device');

            yell.app.showDesktopView();
        }
        */
        // If device has no touch or orientation and screen width is less than mobile width - show mobile menu
        if (!hasOrientation && !hasTouch && window.innerWidth < yell.app.mobileViewWidth) {
            console.log('no touch or orientation detected, viewport is less than ' + yell.app.mobileViewWidth + ' - show mobile menu');
            yell.app.showMobileView();
        }

        // If device has no touch or orientation and screen width is greater than mobile width - show desktop menu
        if (!hasOrientation && !hasTouch && window.innerWidth >= yell.app.mobileViewWidth) {
            console.log('no touch or orientation detected, viewport is greater than ' + yell.app.mobileViewWidth + ' - show desktop menu');
            yell.app.showDesktopView();
            yell.app.moveMenuItemsToBar();
        }
    }


    

    this.app.showMobileView = function () {
        // Add Mobile/Burger menu
        /*
        yell.addTouchEventTo.mobileMenu();
        yell.addTouchEventTo.mobileSearch();
        */
        yell.addTapEventTo.mobileMenu();
        yell.addTapEventTo.mobileSearch();
        // Move menu items into mainmenu div
        yell.app.moveMenuItemsToMain();
        // add click events to back buttons
        /*
        yell.addTouchEventTo.backButtons();
        */
        yell.addTapEventTo.backButtons();
        // Add transitionend event listeners to sub menu
        //yell.subMenuTransitionEnd();
        yell.transitionEnd.subm();
        // Add transitionend event listeners to main menu
        //yell.mainMenuTransitionEnd();
        yell.transitionEnd.main();
        // Add click events to top level menu items
        /*
        yell.addTouchEventTo.topLevelMenuItems();
        yell.addTouchEventTo.searchFind();
        */
        yell.addTapEventTo.topLevelMenuItems();
        yell.addTapEventTo.searchFind();
    }

    this.app.showDesktopView = function () {
        yell.addMouseEventTo.topLevelMenuItems();
    }

    this.app.hideDesktopView = function () {
        yell.removeMouseEventFrom.topLevelMenuItems()
    }


    this.app.whichTransitionEvent = function () {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    };

    // Check if a menu is visible
    this.app.getMenuVisibility = function (menutype) {
        var prop;
        var elem;
        switch (menutype) {
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

        var menuVisible = parseInt(getComputedStyle($(elem), null).getPropertyValue(prop));
        return menuVisible;
    };

    // Check if an element contains a specified element
    this.app.checkElementContains = function (containingelem, elemtocheck) {
        if (containingelem.querySelector([elemtocheck]) != null) {
            return true;
        }
        else {
            return false;
        }
    };

    // Find index of empty ul.subnavul
    this.app.findListIndex = function () {
        var topLevelMenuItems = $('li.top-level:not(.nav2ad)');
        var index;
        // Loop through items to find empty ul
        for (i = 0; i <= topLevelMenuItems.length - 1; i++) {
            if (yell.app.checkElementContains(topLevelMenuItems[i], 'ul.subnavul') == false) index = i;
        }

        return index;
    };


    // Move menu items into #mainmenu div
    this.app.moveMenuItemsToMain = function () {
        //$('#mainmenu').appendChild($('.menu-items'));
        $('#mainmenu').appendChild($('.nav2'));
    };

    // Move menu items into .bar2 div
    this.app.moveMenuItemsToBar = function () {
        //$('#mainmenu').appendChild($('.menu-items'));
        $('.bar2').appendChild($('.nav2'));
    };

    // Move list from #submenu to respective li.top-level
    this.app.moveListToMain = function (index) {
        var thelist = $('#submenu .subnavul');
        var topLevelMenuItems = $('li.top-level');
        topLevelMenuItems[index].appendChild(thelist);
    };

    // Mobile Menu Sub Menu Back link tapped
    this.app.goBack = function () {
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
    this.addTouchEventTo.topLevelMenuItems = function () {
        var topLevelMenuItems = $('li.top-level');
        for (i = 0; i < topLevelMenuItems.length; i++) {
            topLevelMenuItems[i].addEventListener('touchstart', yell.addTouchEventTo.topLevelMenuItem, false);
        }
    };

    this.addTouchEventTo.topLevelMenuItem = function () {
        if (yell.app.checkElementContains(this, 'ul.subnavul')) {
            $('#submenu').appendChild(this.querySelector('.subnavul'));
            yell.hideMainMenu();
            yell.showSubMenu();
        }
    };

    this.removeTouchEventFrom.topLevelMenuItems = function () {
        var topLevelMenuItems = $('li.top-level');
        for (i = 0; i < topLevelMenuItems.length; i++) {
            topLevelMenuItems[i].removeEventListener('touchstart', yell.addTouchEventTo.topLevelMenuItem, false);
        }
    };


    // Add sub menu back button click/touch events
    this.addTouchEventTo.backButtons = function () {
        var backButtons = $('.back');
        for (i = 0; i <= backButtons.length - 1; i++) {
            backButtons[i].addEventListener('touchstart', yell.addTouchEventTo.backButton, false);
        }
    };

    this.addTouchEventTo.backButton = function (e) {
        e.stopPropagation();
        yell.app.goBack();
    };

    this.removeTouchEventFrom.backButtons = function () {
        var backButtons = $('.back');
        for (i = 0; i <= backButtons.length - 1; i++) {
            backButtons[i].removeEventListener('touchstart', yell.addTouchEventTo.backButton, false);
        }
    };

    // Add touch event handler to mobile/burger menu icon
    this.addTouchEventTo.mobileMenu = function () {
        $('#mobile-menu-icon').addEventListener('touchstart', yell.addTouchEventTo.mobileMenuButton, false);
    };

    this.addTouchEventTo.mobileMenuButton = function () {
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
    };

    this.removeTouchEventFrom.mobileMenu = function () {
        $('#mobile-menu-icon').removeEventListener('touchstart', yell.addTouchEventTo.mobileMenuButton, false);
    };

    // Add touch event handler to mobile search icon
    this.addTouchEventTo.mobileSearch = function () {
        $('#mobile-search-icon').addEventListener('touchstart', yell.addTouchEventTo.mobileSearchButton, false);
    };

    this.addTouchEventTo.mobileSearchButton = function () {
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
    };

    this.removeTouchEventFrom.mobileSearch = function () {
        $('#mobile-search-icon').removeEventListener('touchstart', yell.addTouchEventTo.mobileSearchButton, false);
    };

    // Add touch event handler to search form button
    this.addTouchEventTo.searchFind = function () {
        $('#search-btn').addEventListener('touchstart', yell.addTouchEventTo.searchFindButton, false);
    };

    this.addTouchEventTo.searchFindButton = function () {
        console.log('search button clicked');
        var searchTerm = $('#mobile-search #searchterm').value;
        if (searchTerm.length < 1) {
            console.log('search term empty, show error');
            $('.mobile-search-error').style.display = 'block';
            //$('#mobile-search #searchterm').focus();
        }
        else {
            console.log('search term is:' + searchTerm);
            console.log('OK to submit form');
            // submit form here ...
        }
    };

    this.removeTouchEventFrom.searchFind = function () {
        $('#search-btn').removeEventListener('touchstart', yell.addTouchEventTo.searchFindButton, false);
    };


    /* yell.addTapEventTo functions
       ========================================================================== */

    /*
    this.addTapEventTo.somefunc = function() {
      console.log('yes it works');
    }
    */

    // Add tap events to top level menu items
    this.addTapEventTo.topLevelMenuItems = function () {
        var topLevelMenuItems = $('li.top-level');
        for (i = 0; i < topLevelMenuItems.length; i++) {
            var myTap = new Tap(topLevelMenuItems[i]);
            topLevelMenuItems[i].addEventListener('tap', yell.addTapEventTo.topLevelMenuItem, false);
        }
    };

    this.addTapEventTo.topLevelMenuItem = function () {
        if (yell.app.checkElementContains(this, 'ul.subnavul')) {
            $('#submenu').appendChild(this.querySelector('.subnavul'));
            yell.hideMainMenu();
            yell.showSubMenu();
        }
    };

    this.removeTapEventFrom.topLevelMenuItems = function () {
        var topLevelMenuItems = $('li.top-level');
        for (i = 0; i < topLevelMenuItems.length; i++) {
            topLevelMenuItems[i].removeEventListener('tap', yell.addTapEventTo.topLevelMenuItem, false);
        }
    };


    // Add sub menu back button tap events
    this.addTapEventTo.backButtons = function () {
        var backButtons = $('.back');
        for (i = 0; i <= backButtons.length - 1; i++) {
            var myTap = new Tap(backButtons[i]);
            backButtons[i].addEventListener('tap', yell.addTapEventTo.backButton, false);
        }
    };

    this.addTapEventTo.backButton = function (e) {
        e.stopPropagation();
        yell.app.goBack();
    };

    this.removeTapEventFrom.backButtons = function () {
        var backButtons = $('.back');
        for (i = 0; i <= backButtons.length - 1; i++) {
            backButtons[i].removeEventListener('tap', yell.addTapEventTo.backButton, false);
        }
    };

    // Add tap event handler to mobile/burger menu icon
    this.addTapEventTo.mobileMenu = function () {
        var myTap = new Tap($('#mobile-menu-icon'));
        $('#mobile-menu-icon').addEventListener('tap', yell.addTapEventTo.mobileMenuButton, false);
    };

    this.addTapEventTo.mobileMenuButton = function () {
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
    };

    this.removeTapEventFrom.mobileMenu = function () {
        $('#mobile-menu-icon').removeEventListener('tap', yell.addTapEventTo.mobileMenuButton, false);
    };

    // Add tap event handler to mobile search icon
    this.addTapEventTo.mobileSearch = function () {
        var myTap = new Tap($('#mobile-search-icon'));
        $('#mobile-search-icon').addEventListener('tap', yell.addTapEventTo.mobileSearchButton, false);
    };

    this.addTapEventTo.mobileSearchButton = function () {
        console.log('*search tapped');

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
    };

    this.removeTapEventFrom.mobileSearch = function () {
        $('#mobile-search-icon').removeEventListener('tap', yell.addTapEventTo.mobileSearchButton, false);
    };

    // Add tap event handler to search form button
    this.addTapEventTo.searchFind = function () {
        var myTap = new Tap($('#search-btn'));
        $('#search-btn').addEventListener('tap', yell.addTapEventTo.searchFindButton, false);
    };

    this.addTapEventTo.searchFindButton = function () {
        console.log('search button tapped');
        var searchTerm = $('#mobile-search #searchterm').value;
        if (searchTerm.length < 1) {
            console.log('search term empty, show error');
            $('.mobile-search-error').style.display = 'block';
            //$('#mobile-search #searchterm').focus();
        }
        else {
            console.log('search term is:' + searchTerm);
            console.log('OK to submit form');
            // submit form here ...
        }
    };

    this.removeTapEventFrom.searchFind = function () {
        $('#search-btn').removeEventListener('tap', yell.addTapEventTo.searchFindButton, false);
    };



    // Mobile search term keyup
    this.app.mobileSearch = function () {
        $('#mobile-search #searchterm').addEventListener('keyup', yell.app.mobileSearchKeyup, false);
    };

    this.app.mobileSearchKeyup = function () {
        console.log('search focus, ' + $('.mobile-search-error').style.display);
        if ($('.mobile-search-error').style.display == 'block') {
            $('.mobile-search-error').style.display = 'none';
        }
    };

    // Add touch events to burger menu
    this.addMobileTouchEvents = function () {

        /* MOBILE SEARCH INPUT FOCUS */
        $('#mobile-search #searchterm').addEventListener('keyup', function () {
            console.log('search focus, ' + $('.mobile-search-error').style.display);
            if ($('.mobile-search-error').style.display == 'block') {
                $('.mobile-search-error').style.display = 'none';
            }
        });

    };


    this.addMouseEventTo.topLevelMenuItems = function () {
        var menuItems;
        menuItems = $('.nav2').children;
        var i;
        for (i = 0; i < menuItems.length; i++) {

            menuItems[i].addEventListener('mouseover', yell.addMouseEventTo.addMouseOver, false);
            menuItems[i].addEventListener('mouseout', yell.addMouseEventTo.addMouseOut, false);
            //console.log(i);
        }
    }



    this.addMouseEventTo.addMouseOver = function () {
        //console.log('mouseover');
        addClass(this, 'hover1');
    }

    this.addMouseEventTo.addMouseOut = function () {
        //console.log('mouseout');
        removeClass(this, 'hover1');
    }

    // Need to add remove event listeners fo enu items mouse events






    this.isTouchDevice = function () { return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints); };
    this.isMobileDevice = function () { return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1); };



    // Show/Hide Mobile Search
    this.showMobileSearch = function () { addClass($('#mobile-search'), 'mobilesearchslidein'); };
    this.hideMobileSearch = function () { removeClass($('#mobile-search'), 'mobilesearchslidein'); };

    // Show/Hide Main Menu
    this.showMainMenu = function () { addClass($('#mainmenu'), 'mainmenuslideright'); };
    this.hideMainMenu = function () { removeClass($('#mainmenu'), 'mainmenuslideright'); };

    // Show/Hide Sub Menu
    this.showSubMenu = function () { addClass($('#submenu'), 'submenuslideleft'); };
    this.hideSubMenu = function () { removeClass($('#submenu'), 'submenuslideleft'); };

    // Show/Hide Menu Container
    this.showMenuContainer = function () { addClass($('#container'), 'show'); };
    this.hideMenuContainer = function () { removeClass($('#container'), 'show'); };


    /* transition end events
       ========================================================================== */

    // Main menu 
    this.transitionEnd.main = function () {
        var transitionEvent = yell.app.whichTransitionEvent();
        transitionEvent && $('#mainmenu').addEventListener(transitionEvent, yell.transitionEnd.mainMenu, false);
    };

    this.transitionEnd.mainMenu = function () {
        console.log('*new mainMenuTransitionEnd function firing');
        if (yell.app.getMenuVisibility('main') < 0 && yell.app.getMenuVisibility('sub') != 0) yell.hideMenuContainer();
    };

    // Sub menu
    this.transitionEnd.subm = function () {
        var transitionEvent = yell.app.whichTransitionEvent();
        transitionEvent && $('#submenu').addEventListener(transitionEvent, yell.transitionEnd.subMenu, false);
    };

    this.transitionEnd.subMenu = function () {
        console.log('*new subMenuTransitionEnd function firing');
        // If sub menu isn't visible, append the list to the relevant top level item and hide it
        if (yell.app.getMenuVisibility('sub') > 0) {
            yell.app.moveListToMain(yell.app.findListIndex());
        }
        if (yell.app.getMenuVisibility('main') < 0 && yell.app.getMenuVisibility('sub') != 0) yell.hideMenuContainer();
    };



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

    this.cookies.removeItem = function (sKey, sPath, sDomain) {
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


    /*
      Yell equivalents of cookies stored on cookie preferences page on hibu:
    
      yell-analytics-cookie
      yell-essential-cookie
      yell-experience-cookie
      yell-interestbasedad-cookie
  
    */



    /* Tracking Functions
       ========================================================================== */

    this.addTracking = function (element) {

        var thisURL = window.location.href;
        var thisHost = window.location.host;
        var thisPath = window.location.pathname;
        var thisHostShortCode;
        switch (thisHost) {
            // UK Production
            case 'business.hibu.co.uk':
                thisHostShortCode = 'uk';
                var s = s_gi('yellyellhibub2buk');
                break;
                // US Production
            case 'business.hibu.com':
                thisHostShortCode = 'us';
                var s = s_gi('yellhibub2b');
                break;
                // UK UAT
            case 'uat.uk.business.hibu.int':
                thisHostShortCode = 'ku';
                var s = s_gi('yellyellhibub2bukdev');
                break;
                // US UAT
            case 'uat.us.business.hibu.int':
                thisHostShortCode = 'su';
                var s = s_gi('yellhibub2bdev');
                break;
                // UK Staging
            case 'staging2.business.hibu.co.uk':
                thisHostShortCode = 'ks';
                var s = s_gi('yellyellhibub2bukdev');
                break;
                // US Staging
            case 'staging2.business.hibu.com':
                thisHostShortCode = 'ss';
                var s = s_gi('yellhibub2bdev');
                break;
                // UK Local
            case 'local.hibustore.biostaging.co.uk':
                thisHostShortCode = 'lk';
                var s = s_gi('yellyellhibub2bukdev');
                break;
                // US Local
            case 'local.hibustore.biostaging.com':
                thisHostShortCode = 'ls';
                var s = s_gi('yellhibub2bdev');
                break;
                // Unknown ...
            default:
                thisHostShortCode = 'xx';
                var s = s_gi('yellhibub2bdev');
        }


        // Loop throught all elements in body
        var allATags = $('body a');
        var i,count = 0;
        for (i = 0; i < allATags.length; i++) {
            var thisElem = allATags[i];
            // If element has data attribute 'data-linkname'
            //if (thisElem.getAttribute('data-linkname') !== 'null') {
            if (thisElem.getAttribute('data-linkname')) {
                // Attach onclick event to element
                thisElem.addEventListener('click', function (e) {
                    // Prevent default action
                    e.preventDefault;
                    // Get href attribute
                    var destinationURL = thisElem.href;
                    // Get linkname data attribute
                    var thisLinkName = thisElem.getAttribute('data-linkname');
                    // Get date in epoch and date/time formats
                    // NB, data time currently in UK format:
                    // DD/MM/YYYY HH:MM:SS.ms
                    var now = new Date();
                    var nowepoch = now.getTime();
                    var nowdatetime = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();
                    /*
                    Omniture 'linkname' in reporting has max 100 chars
                    Use pipe-separated list to detail the following:
                    datetime|link|host|page
                    NB, link is HTML data attribute
                        to save space, host is a 2 character string as follows:
                        uk - UK Production
                        us - US Production
                        lk - UK Local development environment
                        ls - US Local development environment
                        ku - UK UAT
                        su - US UAT
                        ks - UK Staging
                        ss - US Staging
                        xx - unknown
                    */
                    var omnitureLinkName = nowepoch + '|' + thisLinkName + '|' + thisHostShortCode + '|' + thisPath;
                    // Fire omniture call:
                    // s.tl('true', 'e', omnitureLinkName);
                    // Go to URL
                    document.location.href = destinationURL;

                });
                count ++;
            }
        }
        console.log('tracking added - ' + count + ' items');
    }


    /*
    
    THIS IS OLD ES JAVASCRIPT FOR ADDING TOUCH OR MOUSE EVENTS
  
  
  
  
    this.mobile;
    this.touchEnabled;
    this.orientation;
    this.isTouchDevice = function() { return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);};
    this.burgerMenu = function() { if (getComputedStyle(document.querySelector('.mobilemenu'),null).getPropertyValue('display') === 'block') { return true; } else { return false; }; };
    // Mouseover/out & touchstart JS to replace reliance on :hover pseudo selector - eg, not supported in touch
    this.addMouseMenu = function() {
      // Get top nav menu items
      var menuitems = document.getElementById('primary-nav').firstElementChild.children;
      //console.log(menuitems);
      // Iterate through items
      for (i=0;i<menuitems.length;i++) {
        //console.log('Item ' + (i+1) + menuitems[i]);
        // Add mouseover event listener
        menuitems[i].addEventListener('mouseover', function(e) {
          //Add classes to top nav menu element and sub-menu drop-down
          this.className='hover1';
          this.children[0].className='hover2';
        }, true);
  
        // Add mouseout event listener
        menuitems[i].addEventListener('mouseout', function(e) {
        //Remove classes from top nav menu element and sub-menu drop-down
          this.className='';
          this.children[0].className='';
        }, true);  
      }
    };
    this.addTouchMenu = function() {
      // Get top nav menu items
      var menuitems = document.getElementById('primary-nav').firstElementChild.children;
      //console.log(menuitems);
      // Iterate through items
      for (i=0;i<menuitems.length;i++) {
        //console.log('Item ' + (i+1) + menuitems[i]);
        // Add touchstart event listener
        menuitems[i].addEventListener('touchstart', function(e) {
          // Add 'hover' classes to top nav menu element and sub-menu drop-down
          this.className='hover1';
          this.children[0].className='hover2';
        }, true);
  
        document.body.addEventListener("touchstart", function(){
          var menuitems = document.getElementById('primary-nav').firstElementChild.children;
            for (i=0;i<menuitems.length;i++) {
              // Remove 'hover' classes from top nav menu element and sub-menu drop-down
              menuitems[i].className='';
              menuitems[i].children[0].className='';
            }
        }, true);
      }
    };
    */
}).call(yell);