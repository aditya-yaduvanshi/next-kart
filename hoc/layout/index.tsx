import Nav from 'components/nav';
import React, {PropsWithChildren} from 'react';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
	return (
		<>
			<div className='overflow-hidden'>
				<Nav />
				<main className='p-5'>{children}</main>
			</div>
		</>
	);
};

export default React.memo(Layout);
