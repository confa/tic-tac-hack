define(function (require) {
	'use strict';

	var _ = require('underscore'),
		$ = require('jquery'),
		mediator = require('libs/mediator');

	var ModalWindow = function(options) {
		var model = {
			header : options.header,
			text : options.text,
			confirmButton : options.confirmButton,
			cancelButton : options.cancelButton
		};

		var el_ = {};
		el_.body = $('body');
		el_.template = $('#modal-template');

		$(document).on('click', '#modal-button-cancel', function() {
			mediator.publish('modal:cancel-clicked');
			$('#modal-window').remove();
		});
		$(document).on('click', '#modal-button-confirm', function() {
			mediator.publish('modal:confirm-clicked');
			$('#modal-window').remove();
		});

		var templateCompiled = _.template(el_.template.html());

		this.launch = function() {
			var html = templateCompiled(model);
			el_.body.append(html);
			el_.cancelButton = $('#modal-button-cancel');
			el_.confirmButton = $('#modal-button-confirm');
		};
	};

	return ModalWindow;
});