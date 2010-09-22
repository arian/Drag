

Drag.Drop = new Class({

	Extends: Drag.Move,

	options: {
		precalculate: false
	},

	initialize: function(element, droppables, options){
		this.parent(element, options);
		element = this.element;
		this.droppables == $$(droppables);

		if (this.options.precalculate) this.addEvent('beforeStart', function(){
			this.positions = this.droppables.map(function(el){
				return el.getCoordinates();
			});
		});

		this.addEvent('drag', function(element, event, delta){
			var overed = this.droppables.filter(function(el, i){
				el = this.positions ? this.positions[i] : el.getCoordinates();
				var now = event.page;
				return (now.x > el.left && now.x < el.right && now.y < el.bottom && now.y > el.top);
			}, this).getLast();

			if (this.overed != overed){
				if (this.overed) this.fireEvent('leave', [this.element, this.overed]);
				if (overed) this.fireEvent('enter', [this.element, overed]);
				this.overed = overed;
			}
		});

	}
});
