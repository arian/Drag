
Element.implement('positionAbsolute', function(){

	var parentStyles,
		parent = this.getOffsetParent();

	if (parent) parentStyles = parent.getStyles('border-top-width', 'border-left-width');
	var styles = this.getStyles('left', 'top', 'position');

	if (parent && styles.left == 'auto' || styles.top == 'auto'){
		var parentPosition = this.getPosition(parent);
		parentPosition.x = parentPosition.x - (parentStyles['border-left-width'] ? parentStyles['border-left-width'].toInt() : 0);
		parentPosition.y = parentPosition.y - (parentStyles['border-top-width'] ? parentStyles['border-top-width'].toInt() : 0);
		this.setPosition(parentPosition);
	}

	if (styles.position == 'static') this.setStyle('position', 'absolute');

	return this;

});
