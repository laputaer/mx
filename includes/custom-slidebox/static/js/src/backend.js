define(function(require, exports, module){
	'use strict';
	var uploader = require('modules/uploader'),
		tools = require('modules/tools');
	exports.init = function(){
		jQuery(document).ready(function(){
			exports.bind();
		});
	}
	
	
	exports.config = {
		items_id : '.slidebox-item',
		items_prefix_id : '#slidebox-item-',
		add_btn_id : '#slidebox-add',
		control_box_id : '#slidebox-control',
		del_btn_id : '.slidebox-del',
		file_btn_id : '.slidebox-file',
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
		exports.cache.$item = $(exports.config.items_id);
		exports.cache.$add_btn = $(exports.config.add_btn_id);
		exports.cache.$control_box = $(exports.config.control_box_id);
		exports.cache.$del_btns = $(exports.config.del_btn_id);
		exports.cache.$file_btns = $(exports.config.file_btn_id);
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
				$item : $(this)
			});
		});

		
	}
	exports.file = function(args){
		var that = this,
			$item = args.$item,
			$file = $item.find('.slidebox-file'),
			$area = $item.find('.slidebox-upload-area'),
			$tip = $item.find('.slidebox-upload-tip'),
			$url = $item.find('.slidebox-img-url');
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
				$new_item = $(tpl).hide();
			exports.event_del($new_item.find('.slidebox-del'));
			/** 
			 * bind upload event
			 */
			exports.file({
				$item : $new_item
			});
			
			exports.cache.$control_box.before($new_item);
			$new_item.fadeIn().find('input').eq(0).focus();
			
		});
	}
	exports.event_del = function($del){
		$del.on('click',function(){
			var $this = $(this),
				id = $this.data('id');
			$(exports.config.items_prefix_id + id).fadeOut('1',function(){
				$(this).remove();
			}).css({
				'background-color':'#d54e21'
			});
		});
	}
	exports.get_next_id_number = function(){
		exports.cache.$items = $(exports.config.items_id);
		if(!exports.cache.$items[0]) return 1;
		return exports.cache.$items.eq(exports.cache.$items.length - 1).data('placeholder') + 1;
	}

	exports.color_tpl = function(curr_color){
		var tpl = '';
		for(var i in exports.config.preset_colors){
			var color = exports.config.preset_colors[i],
				curr_class = curr_color == color ? ' class="current" ' : '';
			tpl += '<a href="javascript:;" style="background-color:#' + color + '" data-color="' + color + '" ' + curr_class +'></a>';
		}
		tpl = '<div id="colorful-selector">' + tpl + '</div>';
		return tpl;
		
	}
});