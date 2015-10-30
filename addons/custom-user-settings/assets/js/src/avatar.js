define(function(require, exports){
	'use strict';
	var tools = require('modules/tools'),
		js_request 	= require('theme-cache-request');
		require('theme_custom_user_settings-avatar-cropper');
		
	exports.config = {
		process_url : '',
		lang : {
			M00001 : 'Loading, please wait...',
			E00001 : 'Sorry, server error please try again later.'
		}
	
	};
	var cache = {},
		config = exports.config;
		
	exports.init = function(){
		tools.ready(exports.bind);
	}
	function I(e){
		return document.getElementById(e);
	}
	exports.bind = function(){
		cache.$fm = I('fm-change-avatar');
		cache.$crop_container = I('cropper-container');
		cache.$avatar_preview = I('avatar-preview');
		cache.$crop_done_btn = I('cropper-done-btn');
		cache.$base64 = I('avatar-base64');
		if(!cache.$crop_container) return;
		exports.upload();
	}
	exports.upload = function(){
		cache.$file = I('file');
		
		cache.$file.addEventListener('drop', file_select , false);
		cache.$file.addEventListener('change', file_select , false);

		cache.$fm.addEventListener('submit',validate,false);
		
		function file_select(e){
			e.stopPropagation();  
			e.preventDefault();  
			cache.files = e.target.files.length ? e.target.files : e.originalEvent.dataTransfer.files;
			cache.file = cache.files[0];
			file_read(cache.file);
		}
		function file_read(file){
			var	reader = new FileReader();
			reader.onload = function (e) {
				if(file.type.indexOf('image') === -1){
					alert('Invaild file type.');
					return false;
				}

				cache.$crop_container.innerHTML = '<img src="' + reader.result + '" alt="cropper">';
				cache.$crop_container.style.display = 'block';
				
				cache.$crop_img = cache.$crop_container.querySelector('img');
				
				cache.$avatar_preview.style.display = 'block';
				
				jQuery(cache.$crop_img).cropper({
					aspectRatio: 1 / 1,
					preview : '#avatar-preview',
					guides: false,
					minCropBoxWidth : 150,
					minCropBoxHeight : 150
				});
				cache.$crop_done_btn.style.display = 'block';

				
			};
			reader.readAsDataURL(file);	
		}
		function validate(){
			var xhr = new XMLHttpRequest(),
				form_data = new FormData(),
				$submit = cache.$fm.querySelector('[type=submit]');
			/**
			 * tip
			 */
			tools.ajax_loading_tip('loading',config.lang.M00001);
			$submit.setAttribute('disabled',true);

			cache.base64 = jQuery(cache.$crop_img).cropper('getDataURL',{
				width : 150,
				height : 150,
			},'image/jpeg',0.8);
			
			form_data.append('base64',cache.base64);
			form_data.append('theme-nonce',js_request['theme-nonce']);
			form_data.append('type','avatar');
			
			xhr.open('POST',config.process_url);
			xhr.send(form_data);
			xhr.onload = function(){
				if(xhr.status >= 200 && xhr.status < 400){
					var data;
					try{data = JSON.parse(xhr.responseText)}catch(e){data = xhr.responseText}
					
					if(data && data.status === 'success'){
						document.querySelector('.current-avatar > img').src = cache.base64;
						tools.ajax_loading_tip(data.status,data.msg);
						setTimeout(function(){
							location.href = location.href;
						},3000);
					}else if(data && data.status === 'error'){
						tools.ajax_loading_tip(data.status,data.msg);
						$submit.removeAttribute('disabled');
					}else{
						tools.ajax_loading_tip('error',config.lang.E00001);
						$submit.removeAttribute('disabled');
					}
				}else{
					tools.ajax_loading_tip('error',config.lang.E00001);
					$submit.removeAttribute('disabled');
				}
			};
			xhr.onerror = function(){
				tools.ajax_loading_tip('error',config.lang.E00001);
				$submit.removeAttribute('disabled');
			}

		}
	}
});