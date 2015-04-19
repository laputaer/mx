define(function(require, exports, module){
	'use strict';
	var tools = require('modules/tools');
	
	/**
	 * lazyload
	 */
	require('modules/lazyload');
	
	exports.config = {
		is_home : false
	
	};
	exports.init = function(){
		tools.ready(exports.hide_no_js);
	};
	
	exports.hide_no_js = function(){
		var $no_js = document.querySelectorAll('.hide-no-js'),
			$on_js = document.querySelectorAll('.hide-on-js');
		if($no_js){
			Array.prototype.forEach.call($no_js, function(el){
				el.style.display = 'none';
			});
		}
		if($on_js){
			Array.prototype.forEach.call($on_js, function(el){
				el.style.display = 'block';
			});
		}
	};
});