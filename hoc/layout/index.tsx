import Nav from 'components/nav';
import React, { PropsWithChildren } from 'react';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
	return (
		<>
			<Nav />
			<main>
				{children}
			</main>
		</>
	);
};

export default React.memo(Layout);
