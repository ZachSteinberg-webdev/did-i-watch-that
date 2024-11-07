import React from 'react';

export default function AddShowform({
	addShowFormId,
	addShowFormOnSubmit,
	addShowFormInputId,
	addShowFormInputClassName,
	addShowFormInputType,
	addShowFormInputPlaceholder,
	addShowFormInputValue,
	addShowFormInputOnChange,
	addShowFormInputAutofocus
}){
	return(
		<form id={addShowFormId} onSubmit={addShowFormOnSubmit}>
			<input
				id={addShowFormInputId}
				className={addShowFormInputClassName}
				type={addShowFormInputType}
				placeholder={addShowFormInputPlaceholder}
				value={addShowFormInputValue}
				onChange={addShowFormInputOnChange}
				autoFocus={addShowFormInputAutofocus}
			/>
		</form>
	);
};
