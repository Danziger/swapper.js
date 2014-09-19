(function(global) {
	"use strict";

	/***************************************************************************
	 *	swapper.js:
	 *	A JS class to help you toggle the visibility of parts of your web project.
	 *
	 *	By Dani Gámez Franco, http://gmzcodes.com
	 *	Licensed under MIT.
	 *
	 *	Version: 2.1.1
	 *	Last Update: 2014-09-18
	 *
	 *	NOTE about classes:
	 *	The classNames attribute can be changed to use custom class names, but
	 *  it will be changed in the prototype, so all instances of Swapper will be
	 *  affected.
	 *
	 **************************************************************************/
	
	// CONSTRUCTOR & (PUBLIC) VARIABLES ////////////////////////////////////////
	
	var Swapper = function(IDs, currentIndex, defaultIndex, options) {

		/* OPTIONS FORMAT:
		
		options = {
		
			anchorMode: boolean,
			
			classNames: {
				page: className (String),
				pageButton: className (String),
				currentPage: className (String),
				currentButton: className (String),
				loadingPage: className (String),
				deadPage: className (String)
			},
			
			buttonsIDs: DOM id (String), "autoMODE", or Array (of Strings),
			
			callbacks: {
				DOM id (String): callback (function),
				...
			},
			
			callbacksEnabled: boolean,
			
			masterProperty: String of a CSS property

		} 
		
		*/
		
		// Initialize options:
		options = options || {};

		// VARIABLES:
		this.pagesIDs = [];
		this.pagesDOM = [];

		this.buttonsIDs = [];
		this.buttonsDOM = [];
		
		this.callbacks = {};
		this.callbacksEnabled = false;
		
		this.pagesCount=0;
				
		this.masterProperty = options.masterProperty || "opacity";
		
		// Initialize classNames (in prototype):
		if(options.hasOwnProperty("classNames")) for(var key in this.classNames) this.classNames[key] = options.classNames[key] || this.classNames[key];

		// Load pages:
		IDs = this._normalizeIDs(IDs, this.classNames.page);
		this.addPages(IDs);

		// Load buttons, if required:
		if(options.hasOwnProperty("buttonsIDs")){
			IDs = this._normalizeIDs(options.buttonsIDs, this.classNames.pageButton);
			this.addButtons(IDs);
			
			if(this.pagesIDs.length != this.pagesCount || this.pagesIDs.length != this.buttonsIDs.length || this.pagesDOM.length != this.buttonsDOM.length) // Check.
				throw "Swapper.js - There is a different number of pages and buttons.";
		}

		// Validate and set callbacks:
		if(typeof options.callbacks == "object") for(key in options.callbacks) this.setCallbackByID(key, options.callbacks[key]);
		
		// Current element: 
		if(typeof currentIndex === "number" && this.pagesCount > 0)
			this.currentIndex = Math.max( Math.min(currentIndex, this.pagesCount-1), 0);
		else
			this.currentIndex = null;

		// Default element:
		this.setDefaultByIndex(defaultIndex);

		// Anchor mode:
		this.anchorMode = options.anchorMode===true?true:false;
		
		// Create transitionEnd listener closure for this instance (delegation approach):
		(function(instance){
			var masterProperty = instance.masterProperty;
			var currentPageClass = instance.classNames.currentPage;
			var callbacks = instance.callbacks;
			
			instance.transitionListener = function(e){
				if(e.target.classList.contains(currentPageClass) && e.propertyName==masterProperty && callbacks.hasOwnProperty(e.target.id)) callbacks[e.target.id](e);
			};

		})(this);
		
		// Enable callbacks:
		if(options.callbacksEnabled===true) this.enableCallbacks();
		
		// Select currentIndex if not null:
		if(typeof this.currentIndex === "number" && !this.pagesDOM[this.currentIndex].classList.contains(this.classNames.currentPage)) this.selectByIndex(this.currentIndex);
	};

	// PROTOTYPE VARIABLES /////////////////////////////////////////////////////

	// Set transitionEvent property in the prototype. Code from Modernizr: *****

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
	
	// ClassNames: *************************************************************

	Swapper.prototype.classNames = {
		"page":"page",
		"pageButton":"pageButton",
		"currentPage":"currentPage",
		"currentButton":"currentButton",
		"loadingPage":"loadingPage",
		"deadPage":"deadPage"
	};

	// AUX. METHODS (PRIVATE) //////////////////////////////////////////////////

	Swapper.prototype._normalizeIDs=function(IDs, className) {

		if(typeof IDs === "string"){
			if(IDs==="autoMODE"){ // Automatically seach for .page elements.
				var elements=document.getElementsByClassName(className);
				
				IDs = [];
				
				for(var i=0, L=elements.length; i<L; ++i) {
					var id = elements[i].id;
					id.length>0 && (IDs[IDs.length] = id);
				}
			}
			else IDs = [IDs]; // Just one element added.
		}
		else if(IDs == null || !IDs) IDs = [];
		
		if(Object.prototype.toString.call( IDs ) === "[object Array]")
			return IDs;
		else
			throw "Swapper.js  - Invalid IDs.";	

	};

	// PAGES METHODS ///////////////////////////////////////////////////////////
	
	// Add pages: **************************************************************
	
	Swapper.prototype.addPage=function(ID) {

		if(this.pagesIDs.indexOf(ID)==-1){
			
			var element=document.getElementById(ID);
			
			if(element){
				this.pagesIDs[this.pagesCount] = ID;
				this.pagesDOM[this.pagesCount] = element;
				++this.pagesCount;
				return true;
			}
			else{
				console.error("Swapper.js - No element with ID '"+ID+"' found.");
			}
		}
		else{
			console.error("Swapper.js - Page with ID '"+ID+"' already exists.");
		}

		return false;
	};

	Swapper.prototype.addPages=function(IDs) {
		for (var i=0, L=IDs.length; i<L; ++i)
			this.addPage(IDs[i]);
	};
	
	// Remove pages: ***********************************************************
	
	Swapper.prototype.removeByID=function(ID) {
		this.removeByIndex(this.pagesIDs.indexOf(ID));
	};
	
	Swapper.prototype.removeByIndex=function(index) {

		if( typeof index == "number" && index >=0 & index < this.pagesCount){

			// If we want to remove the default element:
			if(this.defaultIndex == index) this.defaultIndex = null;
			
			// If we want to remove the current element:
			if(this.currentIndex == index && this.currentIndex >=0){

				// Deselect the current element:
				this.pagesDOM[index].classList.remove(this.classNames.currentPage);
				if(this.buttonsDOM[index]) this.buttonsDOM[index].classList.remove(this.classNames.currentButton);

				if(this.defaultIndex != null){ // If there's a default.
					this.currentIndex = this.defaultIndex; 
					if(this.anchorMode) window.location.hash="#"+this.pagesIDs[this.defaultIndex];
					
					// Select the default element:
					this.pagesDOM[this.defaultIndex].classList.add(this.classNames.currentPage);
					if(this.buttonsDOM[this.defaultIndex]) this.buttonsDOM[this.defaultIndex].classList.add(this.classNames.currentButton);
				}
				else{ // If there's NOT a default:
					this.currentIndex = null;
					if(this.anchorMode) window.location.hash="";
				}
			}
			
			// REMOVE ALL RELATED ELEMENTS:
			
			delete this.callbacks[this.pagesIDs[index]];
			
			this.pagesIDs.splice(index, 1);
			this.pagesDOM.splice(index, 1);
			
			this.buttonsIDs.splice(index, 1);
			this.buttonsDOM.splice(index, 1);
			
			--this.pagesCount;
		}
		else console.error("Swapper.js - Invalid index.");
	};

	// Select pages: ***********************************************************
	
	Swapper.prototype.selectByID=function(ID, loading) {
		this.selectByIndex(this.pagesIDs.indexOf(ID), loading);
	};
	
	Swapper.prototype.selectByIndex=function(index, loading) {
	
		if( typeof index == "number" && index >=0 & index < this.pagesCount){
		
			// If there's a default element and we want to select the current one (already selected):
			if(this.currentIndex == index && this.defaultIndex != null) index = this.defaultIndex;
			
			// Hide current page:
			if(typeof this.currentIndex === "number" && this.currentIndex >=0){
				this.pagesDOM[this.currentIndex].classList.remove(this.classNames.currentPage);
				if(this.buttonsDOM[this.currentIndex]) this.buttonsDOM[this.currentIndex].classList.remove(this.classNames.currentButton);
			}

			// Put loading cover if required:
			if(loading===true) this.pagesDOM[index].classList.add(this.classNames.loadingPage);
			else this.pagesDOM[index].classList.remove(this.classNames.loadingPage);
			
			// Show requested page:			
			if(this.anchorMode) window.location.hash="#"+this.pagesIDs[index];

			this.pagesDOM[index].classList.add(this.classNames.currentPage);
			if(this.buttonsDOM[index]) this.buttonsDOM[index].classList.add(this.classNames.currentButton);
			
			this.currentIndex=index;
		}
		else console.error("Swapper.js - Invalid index.");
	};

	Swapper.prototype.selectNone=function() {
		if(this.anchorMode) window.location.hash = "";

		if(typeof this.currentIndex === "number" && this.currentIndex >=0){
			this.pagesDOM[this.currentIndex].classList.remove(this.classNames.currentPage);
			if(this.buttonsDOM[this.currentIndex]) this.buttonsDOM[this.currentIndex].classList.remove(this.classNames.currentButton);
		}
		
		this.currentIndex=null;
	};
	
	// Kill pages: *************************************************************
	
	Swapper.prototype.kill=function(id){ // Page DOM id, not private one.
		var deadElement = document.getElementById(id);
		
		if(deadElement){
			var that = this.masterProperty;
			deadElement.addEventListener(this.transitionEvent, function(e) {
				if(e.propertyName==that) e.target.remove(); // Also remove the event listener.
			});
			
			deadElement.classList.add(this.classNames.deadPage);		
		}
	};
	
	// BUTTONS METHODS /////////////////////////////////////////////////////////
	
	// Add buttons: ************************************************************
	
	Swapper.prototype.addButton=function(ID) {

		if(this.buttonsIDs.indexOf(ID)==-1){
			if(this.buttonsIDs.length < this.pagesCount){
				
				if(typeof ID == "string" && ID.length>0){
					var element=document.getElementById(ID);
					
					if(element){
						this.buttonsIDs[this.buttonsIDs.length] = ID;
						this.buttonsDOM[this.buttonsDOM.length] = element;
						return true;
					}
					else{
						console.error("Swapper.js - No element with ID '"+ID+"' found.");
					}
				}
				else{
					this.buttonsIDs[this.buttonsIDs.length] = null;
					this.buttonsDOM[this.buttonsDOM.length] = null;					
				}
			}
			else{
				console.error("Swapper.js - You can't add more buttons than pages. Add a page first.");
			}
		}
		else{
			console.error("Swapper.js - Button with ID '"+ID+"' already exists.");
		}

		return false;
	};

	Swapper.prototype.addButtons=function(IDs) {
		for (var i=0, L=IDs.length; i<L; ++i)
			this.addButton(IDs[i]);
	};
	
	// CALLBACKS METHODS ///////////////////////////////////////////////////////
	
	// Add callbacks: **********************************************************
	
	Swapper.prototype.setCallbackByID=function(ID, callback) {
		
		if(this.pagesIDs.indexOf(ID)>-1){
			if(callback == null) delete this.callbacks[ID];
			else if(typeof callback == "function") this.callbacks[ID] = callback;
			else throw "Swapper.js - Invalid callback.";
		}
		else throw "Swapper.js - Invalid ID.";
		
	};

	Swapper.prototype.setCallbackByIndex=function(index, callback) {
		if( typeof index == "number" && index >=0 & index < this.pagesCount)
			this.setCallbackByID(this.pagesIDs[index], callback);
		else console.error("Swapper.js - Invalid index.");
	};
	
	// Remove callbacks: *******************************************************
	
	Swapper.prototype.removeCallbackByID=function(ID) {
		if(this.pagesIDs.indexOf(ID)>-1) delete this.callbacks[ID];
		else throw "Swapper.js - Invalid ID.";
	};

	Swapper.prototype.removeCallbackByIndex=function(index) {
		if( typeof index == "number" && index >=0 & index < this.pagesCount)
			this.removeCallbackByID(this.pagesIDs[index]);
		else console.error("Swapper.js - Invalid index.");
	};

	// Enable / Disable callbacks: *********************************************

	Swapper.prototype.enableCallbacks=function(){
		if(!this.callbacksEnabled) document.addEventListener(this.transitionEvent, this.transitionListener);		
	};

	Swapper.prototype.disableCallbacks=function(){
		if(this.callbacksEnabled) document.removeEventListener(this.transitionEvent, this.transitionListener);		
	};

	// SET & CLEAR DEFAULT PAGE ////////////////////////////////////////////////
	
	Swapper.prototype.setDefaultByID=function(ID) {
		var index = this.pagesIDs.indexOf(ID);
		
		if(index>-1) this.setDefaultByIndex(index);
		else throw "Swapper.js - Invalid ID.";
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

	// LOADER METHODS //////////////////////////////////////////////////////////

	Swapper.prototype.removeLoaderByID=function(ID) {
		this.removeLoaderByIndex(this.pagesIDs.indexOf(ID));
	};

	Swapper.prototype.removeLoaderByIndex=function(index) {
		if( typeof index == "number" && index >=0 & index < this.pagesCount)
			this.pagesDOM[index].classList.remove(this.classNames.loadingPage);
		else console.error("Swapper.js - Invalid index.");
	};

	Swapper.prototype.removeAllLoaders=function() {
		var pages = this.pagesDOM;
		for(var i=this.pagesCount; i--;)
			this.pagesDOM[i].classList.remove(this.classNames.loadingPage);
	};
		
	// *************************************************************************
	
	global.Swapper = Swapper;

}(window));





var swapper; // Global so that you can use the console inspector on it.

window.onload =function(e){
	// You can use any of this two declarations:
	//swapper = new Swapper("autoMODE", 0, 3);
	swapper = new Swapper(["page1","page2","page3","page4"], 0, 3, {
		buttonsIDs: ["bot1","bot2","bot3","bot4"]
	
	});
	
	document.onclick = function(e){ // Delegated.
	
		if(e.target.nodeName == "LI"){ // If we clicked on the desired element:
			// You can use any of this two methods:
			//swapper.selectByIndex(parseInt(e.target.getAttribute("data-index")));
			swapper.selectByID(e.target.getAttribute("data-id"));
		}
		
	};
};