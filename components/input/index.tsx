import React from 'react';

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const Input = React.forwardRef(function Input({className, placeholder, ...inputProps}: InputProps, ref) {
	return (
		<>
			<div className={'container relative' + className}>
        <input className='w-full h-full py-2 px-3 outline-none' placeholder={placeholder} ref={ref as React.LegacyRef<HTMLInputElement>} {...inputProps} />
        <label className='absolute top-0 left-0'>{placeholder}</label>
      </div>
		</>
	);
});

export default React.memo(Input);
