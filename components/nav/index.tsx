import Input from 'components/input';
import Img from 'components/img';
import NavLink from 'components/nav-link';
import React from 'react';
import styles from './nav.module.css';
import {
	FaBars,
	FaShoppingCart,
	FaSignInAlt,
	FaSignOutAlt,
	FaEdit,
	FaUser,
} from 'react-icons/fa';
import {useAuth} from 'contexts/auth';
import {useSider} from 'contexts/sider';
import { useCart } from 'contexts/cart';

const Nav: React.FC = () => {
	const {user, signout, loading} = useAuth();
	const {toggleSider} = useSider();
	const {toggleSiderCart} = useCart();

	return (
		<>
			<nav className={styles.nav}>
				<div className={styles.left_container}>
					{user && (
						<button className={styles.toggle} onClick={toggleSider}>
							<FaBars size='28' />
						</button>
					)}
					<NavLink href='/' className={styles.brand}>
						<Img src='/nextkart.png' alt='cart-icon' width='125' height='30' />
					</NavLink>
				</div>
				<form
					className={styles.search_form}
					onSubmit={(e) => e.preventDefault()}
				>
					<Input placeholder='Search...' className={styles.search_input} />
				</form>
				<ul className={styles.nav_links}>
					{user ? (
						<>
							<li className={styles.nav_item}>
								<NavLink href='#' className={styles.nav_link}>
									<span>{user.name ?? user.email?.split('@')[0]}</span>
									{user.avatar ? (
										<Img
											src={user.avatar as string}
											alt='avatar'
											width='25'
											height='25'
											className={styles.avatar}
										/>
									) : (
										<FaUser size='16' />
									)}
								</NavLink>
							</li>
							<li className={styles.nav_item}>
								<NavLink
									href='#!'
									onClick={() => signout()}
									className={styles.nav_link}
								>
									<span className={styles.link_text}>Sign Out</span> <FaSignOutAlt size='16' />
								</NavLink>
							</li>
						</>
					) : (
						!loading && (
							<>
								<li className={styles.nav_item}>
									<NavLink href='/auth/signin' className={styles.nav_link}>
										<span className={styles.link_text}>Sign In</span> <FaSignInAlt size='16' />
									</NavLink>
								</li>
								<li className={styles.nav_item}>
									<NavLink href='/auth/register' className={styles.nav_link}>
										<span className={styles.link_text}>Register</span> <FaEdit size='16' />
									</NavLink>
								</li>
							</>
						)
					)}
					<li className={styles.nav_item}>
						<NavLink href="#cart" className={styles.nav_link} onClick={toggleSiderCart}>
							<span className={styles.link_text}>Cart</span> <FaShoppingCart size='16' />
						</NavLink>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default React.memo(Nav);
