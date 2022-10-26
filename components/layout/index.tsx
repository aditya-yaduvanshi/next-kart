import React, {PropsWithChildren, useState} from 'react';
import Nav from 'components/nav';
import Sider from 'components/sider';
import {useAuth} from 'contexts/auth';
import CartProvider from 'contexts/cart';
import styles from './layout.module.css';
import CartSider from 'components/cart-sider';
import {useRouter} from 'next/router';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
	const {user} = useAuth();
	const [sider, setSider] = useState(false);
	const [cart, setCart] = useState(false);
	const router = useRouter();
	return (
		<>
			<div className={styles.layout}>
				{router.pathname.startsWith('/auth') ? null : (
					<CartProvider>
						<Nav
							onToggle={() => setSider((current) => !current)}
							onCart={() => setCart((current) => !current)}
						/>
					</CartProvider>
				)}
				<main className={styles.main}>
					{user && (
						<Sider className={`${styles.sider} ${sider ? '' : 'hidden'}`} />
					)}
					<section className={styles.page}>{children}</section>
					{user && (
						<CartProvider>
							<CartSider open={cart} />
						</CartProvider>
					)}
				</main>
			</div>
		</>
	);
};

export default React.memo(Layout);
