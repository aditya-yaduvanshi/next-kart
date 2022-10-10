import React, {PropsWithChildren} from 'react';
import Nav from 'components/nav';
import Sider from 'components/sider';
import {useAuth} from 'contexts/auth';
import SiderProvider from 'contexts/sider';
import CartProvider from 'contexts/cart';
import styles from './layout.module.css';
import CartSider from 'components/cart-sider';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
	const {user} = useAuth();
	return (
		<>
			<div className={styles.layout}>
				<CartProvider>
					<SiderProvider>
						<Nav />
					</SiderProvider>
				</CartProvider>
				<main className={styles.main}>
					{user && (
						<SiderProvider>
							<Sider className={styles.sider} />
						</SiderProvider>
					)}
					<section className={styles.page}>{children}</section>
					<CartProvider>
						<CartSider />
					</CartProvider>
				</main>
			</div>
		</>
	);
};

export default React.memo(Layout);
