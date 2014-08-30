(function(global) {
	"use strict";

	/***************************************************************************
	 *	swapper.js:
	 *	A JS class to help you toggle the visibility of parts of your web project.
	 *
	 *	By Dani Gámez Franco, http://gmzcodes.com
	 *	Licensed under MIT.
	 *
	 *	Version: 1.1.3
	 *	Last Update: 2014-08-30
	 *
	 *	NOTE:
	 *	The current page class CAN NOT be changed programmatically. Search and
	 *	replace "currentPage" with the desired class name inside this file
	 *	instead or adapt your project to work with the default value.
	 *	
	 *	Same thing for "deadPage" and "pageMe".
	 *
	 **************************************************************************/

	// CONSTRUCTOR & (PUBLIC) VARIABLES ////////////////////////////////////////
	
	var Swapper = function(IDs, currentIndex, defaultIndex, anchorMode) {
		this.pagesIDs = [];
		this.pagesDOM = [];
		this.pagesCount=0;
		
		if(typeof IDs === "string"){
			if(IDs==="autoMODE"){ // Automatically seach for .pageMe elements.
				var elements=document.getElementsByClassName("pageMe");
				
				IDs = [];
				
				for(var i=0, L=elements.length; i<L; ++i) {
					var id = elements[i].id
					id.length>0 && IDs[IDs.length] = id;
				}
			}
			else IDs = [IDs]; // Just one element added.
		}
		
		if(Object.prototype.toString.call( IDs ) === "[object Array]")
			this.addPages(IDs);
		else
			throw "Invalid argument 'IDs'.";
		
		// Current element: 
		if(typeof currentIndex === "number" && this.pagesCount > 0)
			this.currentIndex = Math.max( Math.min(currentIndex, this.pagesCount-1), 0);
		else
			this.currentIndex = null;

		// Default element:
		this.setDefaultByIndex(defaultIndex);
		
		// Anchor mode:
		this.anchorMode = anchorMode?true:false;
	};
	
	// PROTOTYPE VARIABLES /////////////////////////////////////////////////////
	
	// Set transitionEvent property in the prototype. Code from Modernizr:
	Swapper.prototype.transitionEvent = (function(){
		"use strict";
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
	})();
	
	// METHODS /////////////////////////////////////////////////////////////////

	Swapper.prototype.addPage=function(ID) {

		if(this.pagesIDs.indexOf(ID)==-1){
			
			var element=document.getElementById(ID);
			
			if(element){
				this.pagesIDs[pagesIDs.length] = ID;
				this.pagesDOM[pagesDOM.length] = element;

				++this.pagesCount;

				/*
				
				TO-DO: Maybe in future versions...
				
				element.addEventListener(this.transitionEvent, function(e) {

					if(e.propertyName=="opacity"){
						console.log(e.target.className);
						if(e.target.className=="hiddenPage"){
							e.target.className="hiddenPage";
						}
						else {
							console.log("VISIBLE");
							console.log(e.target);
						}
					}
				});
				
				*/

				return true;
			}
			else{
				console.error("Swapper.js (ERR) - No element with ID '"+ID+"' found.");
			}
		}
		else{
			console.error("Swapper.js (ERR) - Element with ID '"+ID+"' already exists.");
		}

		return false;
	};

	Swapper.prototype.addPages=function(IDs) {
		for (var i=0, L=IDs.length; i<L; ++i)
			this.addPage(IDs[i]);
	};

	// ******************

	Swapper.prototype.setDefaultByID=function(ID) {
		var index = this.pagesIDs.indexOf(ID);
		
		if(index>-1) this.setDefaultByIndex(index);
		else throw "Swapper.js (ERR) - Invalid ID.";
	};

	Swapper.prototype.setDefaultByIndex=function(index) {
		if(typeof index == "number" && this.pagesCount > 0)
			this.defaultIndex = Math.max( Math.min(index, this.pagesCount-1), 0);
		else
			this.defaultIndex = null;
	};

	Swapper.prototype.clearDefault=function(){
		this.defaultIndex = null;
	};

	// ******************

	Swapper.prototype.selectByID=function(ID) {
		this.selectByIndex(this.pagesIDs.indexOf(ID));
	};
	
	Swapper.prototype.selectByIndex=function(index) {

		if( typeof index == "number" && index >=0 & index < this.pagesCount){

			// If there's a default element and we want to select the current one (already selected):
			if(this.currentIndex == index && this.defaultIndex != null) index = this.defaultIndex;

			if(this.anchorMode){
				window.location.hash="#"+this.pagesIDs[index];
			}
			else{
				if(this.currentIndex >=0)
					this.pagesDOM[this.currentIndex].classList.remove("currentPage");
					
				this.pagesDOM[index].className += " currentPage";
				this.currentIndex=index;
			}
		}
		else console.error("Swapper.js (ERR) - Invalid index.");
	};
	
	// ******************
	
	Swapper.prototype.selectNone=function() {
		if(this.anchorMode){
			window.location.hash = "";
		}
		else{
			if(this.currentIndex >=0)
				this.pagesDOM[this.currentIndex].classList.remove("currentPage");

			this.currentIndex=null;
		}
	};
	
	// ******************
	
	Swapper.prototype.kill=function(id){ // Page DOM id, not private one.
		var deadElement = document.getElementById(id);
		
		if(deadElement){
			deadElement.addEventListener(this.transitionEvent, function(e) {
				if(e.propertyName=="opacity"){
					e.target.remove();
				}
			});
			
			deadElement.className += " deadPage";		
		}
	};
	
	// ******************
	
	global.Swapper = Swapper;

}(window));
