import React, {PropsWithChildren} from 'react';
import Nav from 'components/nav';
import Sider from 'components/sider';
import {useAuth} from 'contexts/auth';
import SiderProvider from 'contexts/sider';
import styles from './layout.module.css';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
	const {user} = useAuth();
	return (
		<>
			<div className={styles.layout}>
				<SiderProvider>
					<Nav />
				</SiderProvider>
				<main className={styles.main}>
					<SiderProvider>
						<Sider className={styles.sider} />
					</SiderProvider>
					<section className={styles.page}>{children}</section>
				</main>
			</div>
		</>
	);
};

export default React.memo(Layout);
