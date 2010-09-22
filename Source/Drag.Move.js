

Drag.Move = new Class({

	Extends: Drag,

	options: {
		unit: 'px',
		modifiers: {
			x: 'left',
			y: 'top'
		}
	},

	initialize: function(element, options){
		this.parent(element, options);
		element = this.element;

		// Make the element absolute and set left/top styles
		var parentStyles,
			parent = element.getOffsetParent();
		if (parent) parentStyles = parent.getStyles('border-top-width', 'border-left-width');
		var styles = element.getStyles('left', 'top', 'position');
		if (parent && styles.left == 'auto' || styles.top == 'auto'){
			var parentPosition = element.getPosition(parent);
			parentPosition.x = parentPosition.x - (parentStyles['border-left-width'] ? parentStyles['border-left-width'].toInt() : 0);
			parentPosition.y = parentPosition.y - (parentStyles['border-top-width'] ? parentStyles['border-top-width'].toInt() : 0);
			element.setPosition(parentPosition);
		}

		if (styles.position == 'static') element.setStyle('position', 'absolute');

		// Get begin styles
		this.endDelta = {x:0, y:0};
		this.startStyle = {};
		var modifiers = this.options.modifiers,
			unit = this.options.unit;

		this.addEvent('beforeStart', function(el, event){
			if (modifiers.x) this.startStyle.x = (this.element.getComputedStyle(modifiers.x).toInt() || 0) - this.endDelta.x;
			if (modifiers.y) this.startStyle.y = (this.element.getComputedStyle(modifiers.y).toInt() || 0) - this.endDelta.y;
		});

		// Set styles while dragging
		this.addEvent('drag', function(element, event, delta){
			if (modifiers.x) element.setStyle(modifiers.x, (this.startStyle.x + delta.x) + unit);
			if (modifiers.y) element.setStyle(modifiers.y, (this.startStyle.y + delta.y) + unit);
		});

		this.addEvent('complete', function(element, delta){
			this.endDelta = delta;
		});

	}
});
