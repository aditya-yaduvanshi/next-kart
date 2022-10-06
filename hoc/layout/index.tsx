import Nav from 'components/nav';
import React, {PropsWithChildren} from 'react';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
	return (
		<>
			<div className='overflow-hidden h-full'>
				<Nav />
				<main className='p-5 h-full'>{children}</main>
			</div>
		</>
	);
};

export default React.memo(Layout);
