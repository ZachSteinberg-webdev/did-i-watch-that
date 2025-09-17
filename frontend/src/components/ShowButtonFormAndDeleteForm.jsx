import React from 'react';

export default function ShowButtonFormAndDeleteForm({
	showButtonFormAndDeleteFormClassName,
	showButtonFormAndDeleteFormId,
	children
}) {
	return (
		<div
			className={showButtonFormAndDeleteFormClassName}
			id={showButtonFormAndDeleteFormId}
		>
			{children}
		</div>
	);
}
