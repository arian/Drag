

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
		element.positionAbsolute();

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


Element.implement({

	makeDraggable: function(options){
		var drag = new Drag.Move(this, options);
		this.store('dragger', drag);
		return drag;
	},

	makeResizable: function(options){
		var drag = new Drag.Move(this, Object.merge({
			modifiers: {
				x: 'width',
				y: 'height'
			}
		}, options));

		this.store('resizer', drag);
		return drag.addEvent('drag', function(){
			this.fireEvent('resize', drag);
		}.bind(this));
	}

});



