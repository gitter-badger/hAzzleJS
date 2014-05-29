/*!
 * Compatibility
 *
 * This module picks the best functions for each individual browser
 *
 * TODO!!
 *
 *  Find the differences and create the best function for each browsers. Then in top of the Core file we do:
 *
 *  var substring = Compatibility['Chrome'][substr] || prototype.substring
 *
 * We then first need to find current browser. All this will make sure each browser have the same performance
 *
 * 
 * NOTE!!  Mainly CSS related functions have huge differences between browsers. Will update this soon.
 *
 *
 */
 
 var Compatibility = {
	 
    FireFox: {
	
	// Functions that perform faster in Firefox here
	
	},
    Chrome: {
	
	// Functions that perform faster in Chrome here
	
	},
    
	IE: {
	
	// Functions that perform faster in IE here
	
	},
    
	Opera: {
	
	// Functions that perform faster in Opera here
	
	} 
	 
  }