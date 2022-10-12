import React, {PropsWithChildren, useState} from 'react';
import Nav from 'components/nav';
import Sider from 'components/sider';
import {useAuth} from 'contexts/auth';
import SiderProvider from 'contexts/sider';
import CartProvider from 'contexts/cart';
import styles from './layout.module.css';
import CartSider from 'components/cart-sider';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
	const {user} = useAuth();
	const [sider, setSider] = useState(false);
	const [cart, setCart] = useState(false);
	return (
		<>
			<div className={styles.layout}>
				<CartProvider>
					<Nav
						onToggle={() => setSider((current) => !current)}
						onCart={() => setCart((current) => !current)}
					/>
				</CartProvider>
				<main className={styles.main}>
					{user && <Sider className={styles.sider} state={sider} />}
					<section className={styles.page}>{children}</section>
					{cart && (
						<CartProvider>
							<CartSider />
						</CartProvider>
					)}
				</main>
			</div>
		</>
	);
};

export default React.memo(Layout);
