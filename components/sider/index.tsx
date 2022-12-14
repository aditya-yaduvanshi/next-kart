import NavLink from 'components/nav-link';
import {useAuth} from 'contexts/auth';
import React from 'react';
import styles from './sider.module.css';
import {FaSitemap, FaList, FaShoppingBag} from 'react-icons/fa'

type SiderProps = {
	className?: string;
};

const Sider: React.FC<SiderProps> = ({className}) => {
	const {user} = useAuth();

	return (
		<>
			<aside className={`${styles.sider} ${className}`}>
				<ul>
					{user && (user.role === 'admin' ? (
						<>
							<li className={styles.sider_item}>
								<NavLink href='/admin/products' className={styles.sider_link}><FaList size='20' /> Products</NavLink>
							</li>
							<li className={styles.sider_item}>
								<NavLink href='/admin/orders' className={styles.sider_link}><FaShoppingBag size='20' /> Orders</NavLink>
							</li>
							<li className={styles.sider_item}>
								<NavLink href='/admin/categories' className={styles.sider_link}><FaSitemap size='20' /> Categories</NavLink>
							</li>
						</>
					) : (
						<>
							<li className={styles.sider_item}>
								<NavLink href='/orders' className={styles.sider_link}>Orders</NavLink>
							</li>
						</>
					))}
				</ul>
			</aside>
		</>
	);
};

export default React.memo(Sider);
