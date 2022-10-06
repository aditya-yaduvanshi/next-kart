import React, {PropsWithChildren} from 'react';
import Nav from 'components/nav';
import Sider from 'components/sider';
import {useAuth} from 'contexts/auth';
import SiderProvider from 'contexts/sider';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
	const {user} = useAuth();
	return (
		<>
			<div className='overflow-hidden h-full'>
				<SiderProvider>
					<Nav />
				</SiderProvider>
				<main className='h-full pb-14'>
					{user && user.role === 'admin' && (
						<SiderProvider>
							<Sider />
						</SiderProvider>
					)}
					<section className='h-full overflow-x-hidden overflow-y-auto pb-1'>{children}</section>
				</main>
			</div>
		</>
	);
};

export default React.memo(Layout);
