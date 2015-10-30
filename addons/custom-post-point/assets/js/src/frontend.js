define(function(require, exports){
	'use strict';
	var js_request = require('theme-cache-request'),
		tools = require('modules/tools'),
		doc = document;
		
	exports.config = {
		process_url : '',
		lang : {
			M01 : 'Loading, please wait...',
			E01 : 'Sorry, server is busy now, can not respond your request, please try again later.'
		}
	}
	exports.init = function(){
		tools.ready(exports.bind);
	}

	var config = exports.config,
		caches = {};
		
	exports.bind = function(){
		caches.$btns = doc.querySelectorAll('.post-point-btn');
		if(!caches.$btns[0])
			return false;
			
		for(var i = 0,len = caches.$btns.length; i<len; i++){
			caches.$btns[i].addEventListener('click',event_click);
		}
	}

	function event_click(e){
		e.preventDefault();
		e.stopPropagation();
		var $btn = this,
			post_id = this.getAttribute('data-post-id'),
			points = this.getAttribute('data-points');

		caches.$number = I('post-point-number-' + post_id);
		
		tools.ajax_loading_tip('loading',config.lang.M01);
		
		var xhr = new XMLHttpRequest(),
			fd = new FormData();
		fd.append('post-id',post_id);
		fd.append('points',points);
		fd.append('theme-nonce',js_request['theme-nonce']);
		
		xhr.open('post',config.process_url);
		xhr.send(fd);
		
		xhr.onload = function(){
			if(xhr.status >= 200 && xhr.status < 400){
				var data;
				try{data = JSON.parse(xhr.responseText)}catch(err){data = xhr.responseText}
				
				if(data && data.status){
					done(data);
				}else{
					fail(data);
				}
			}else{
				tools.ajax_loading_tip('error',config.lang.E01);
			}
		};
		xhr.onerror = function(){
			tools.ajax_loading_tip('error',config.lang.E01);
		};

		function done(data){
			if(data.status === 'success'){
				tools.ajax_loading_tip(data.status,data.msg,3);
				/** incre points to dom */
				caches.$number.innerHTML = data.points;
			}else{
				tools.ajax_loading_tip(data.status,data.msg,3);
			}
		};
		function fail(text){
			tools.ajax_loading_tip('error',config.lang.E01);
		}
		
	}
	function I(e){
		return doc.getElementById(e);
	}
});