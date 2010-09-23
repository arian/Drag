

var Drag = new Class({

	Implements: [Options, Events],

	options: {
		snap: 6/*,
		grid: {
			x: 5,
			y: 5
		},
		limit: {
			x: [0, 40],
			y: [0, 20]
		},
		invert: false,
		multiply: false,
		preventDefault: false,
		stopPropagation: false*/
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = document.id(element);
		this.document = this.element.getDocument();
		this.selection = (Browser.ie) ? 'selectstart' : 'mousedown';

		if (!this.options.snap) this.options.snap = 0;

		var grid = this.options.grid;
		if (Type.isNumber(grid)) this.options.grid = {
			x: grid,
			y: grid
		};

		if (this.options.invert) this.options.multiply = (this.options.multiply || 1) * -1;

		this.bound = {
			mousedown: this.start.bind(this),
			mouseup: this.stop.bind(this),
			mousemove: this.drag.bind(this),
			stopEvent: Function.from(false)
		};

		this.attach();
	},

	attach: function(){
		this.element.addEvent('mousedown', this.bound.mousedown);
	},

	detach: function(){
		this.element.removeEvent('mousedown', this.bound.mousedown);
	},

	start: function(event){
		if (event.rightClick) return;

		if (this.options.preventDefault) event.preventDefault();
		if (this.options.stopPropagation) event.stopPropagation();

		var docEvents = {
			mouseup: this.bound.mouseup,
			mousemove: this.bound.mousemove
		};
		docEvents[this.selection] = this.bound.stopEvent;
		this.document.addEvents(docEvents);

		if (!this.startPos) this.startPos = event.page;
		this.relStartPos = event.page;

		this.traveled = 0;
		this.current = {};

		this.fireEvent('beforeStart', this.element);
	},

	stop: function(){
		var docEvents = {
			mouseup: this.bound.mouseup,
			mousemove: this.bound.mousemove
		};
		docEvents[this.selection] = this.bound.stopEvent;
		this.document.removeEvents(docEvents);

		this.snapped = false;

		this.fireEvent('stop', this.element).fireEvent('complete', [this.element, this.delta]);
	},

	drag: function(event){

		var delta = {
			x: event.page.x - this.startPos.x,
			y: event.page.y - this.startPos.y
		};
		var raw = delta;

		var relative = {
			x: event.page.x - this.relStartPos.x,
			y: event.page.y - this.relStartPos.y
		};

		var prevDistance = this.distance || 0;
		var distance = this.distance = Math.sqrt(relative.x * relative.x + relative.y * relative.y);
		var traveled = this.traveled = this.traveled + Math.abs(distance - prevDistance);

		if (!this.snapped){
			if (distance > this.options.snap){
				this.fireEvent('start', [this.element, event]).fireEvent('snap', this.element);
				this.snapped = true;
			}
		}

		if (this.snapped){

			var grid = this.options.grid;
			if (grid){
				delta.x = delta.x - delta.x % grid.x;
				delta.y = delta.y - delta.y % grid.y;
			}

			var multiply = this.options.multiply;
			if (multiply){
				delta.x = delta.x * multiply;
				delta.y = delta.y * multiply;
			}

			var limit = this.options.limit;
			if (limit){
				if (limit.x && limit.x[0] >= delta.x) delta.x = limit.x[0];
				if (limit.x && limit.x[1] <  delta.x) delta.x = limit.x[1];
				if (limit.y && limit.y[0] >= delta.y) delta.y = limit.y[0];
				if (limit.y && limit.y[1] <  delta.y) delta.y = limit.y[1];
			}

			if (delta.x != this.current.x || delta.y != this.current.y){
				this.fireEvent('drag', [this.element, event, delta, raw, relative, distance, traveled]);
			}

			this.current = delta;
		}

		this.delta = delta;
		this.fireEvent('dragRaw', [raw, relative, event]);
	}

});
