define(function(require, exports){
	'use strict';
	var uploader = require('modules/uploader'),
		tools = require('modules/tools');
	exports.init = function(){
		tools.ready(function(){
			exports.bind();
		});
	}
	
	
	exports.config = {
		items_id : '.theme_custom_slidebox-item',
		items_prefix_id : '#theme_custom_slidebox-item-',
		add_btn_id : '#theme_custom_slidebox-add',
		control_box_id : '#theme_custom_slidebox-control',
		del_btn_id : '.theme_custom_slidebox-del',
		file_btn_id : '.theme_custom_slidebox-file',
		container_id : '.theme_custom_slidebox-container',
		placeholder_pattern : /\%placeholder\%/ig,
		tpl : '',
		process_url : '',
		lang : {
			M00001 : 'Loading, please wait...',
			E00001 : 'Server error or network is disconnected.'
		}
	}
	exports.cache = {}
	
	exports.bind = function(){
		exports.cache.$item = jQuery(exports.config.items_id);
		exports.cache.$add_btn = jQuery(exports.config.add_btn_id);
		exports.cache.$control_box = jQuery(exports.config.control_box_id);
		exports.cache.$del_btns = jQuery(exports.config.del_btn_id);
		exports.cache.$file_btns = jQuery(exports.config.file_btn_id);
		exports.cache.$container = jQuery(exports.config.container_id);
		/** 
		 * bind del event for first init
		 */
		exports.event_del(exports.cache.$del_btns);
		/** 
		 * bind add event
		 */
		exports.event_add(exports.cache.$add_btn);
		/** 
		 * bind upload event
		 */
		exports.cache.$item.each(function(){
			exports.file({
				$item : jQuery(this)
			});
		});

		
	}
	exports.file = function(args){
		var that = this,
			$item = args.$item,
			$file = $item.find('.theme_custom_slidebox-file'),
			$area = $item.find('.theme_custom_slidebox-upload-area'),
			$tip = $item.find('.theme_custom_slidebox-upload-tip'),
			$url = $item.find('.theme_custom_slidebox-img-url');
		var upload = new uploader.init({
			url : exports.config.process_url,
			$file : $file,
			paramname : 'img',
			onstart : function(i,file,count){
				$area.hide();
				$tip.html(tools.status_tip('loading',exports.config.lang.M00001)).show();
			},
			onalways : function(data,i,file,count) {
				if(data && data.status === 'success'){
					$url.val(data.url);
					$tip.html(tools.status_tip('success',data.msg));
				}else if(data && data.status === 'error'){
					$tip.html(tools.status_tip('error',data.msg));
				}else{
					$tip.html(tools.status_tip('error',exports.config.lang.E00001));
				}
				$area.show();
				$file.val('');
			}
		});
	}
	exports.event_add = function($add){
		$add.on('click',function(){
			var tpl = exports.config.tpl.replace(exports.config.placeholder_pattern,exports.get_next_id_number()),
				$new_item = jQuery(tpl).hide();
			exports.event_del($new_item.find('.theme_custom_slidebox-del'));
			/** 
			 * bind upload event
			 */
			exports.file({
				$item : $new_item
			});
			
			exports.cache.$container.append($new_item);
			$new_item.fadeIn().find('input').eq(0).focus();
			
		});
	}
	exports.event_del = function($del){
		$del.on('click',function(){
			var $this = jQuery(this),
				id = $this.data('id');
			jQuery(exports.config.items_prefix_id + id).fadeOut('1',function(){
				jQuery(this).remove();
			}).css({
				'background-color':'#d54e21'
			});
		});
	}
	exports.get_next_id_number = function(){
		return new Date().getTime();
	}
});