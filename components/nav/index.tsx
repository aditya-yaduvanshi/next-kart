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
} from 'react-icons/fa';
import {useAuth} from 'contexts/auth';

const Nav: React.FC = () => {
	const {user, signout} = useAuth();
	return (
		<>
			<nav className={styles.nav}>
				<div className={styles.left_container}>
					<button className={styles.toggle}>
						<FaBars size='28' />
					</button>
					<NavLink href='/' className={styles.brand}>
						<Img src='/nextkart.png' alt='cart-icon' width='125' height='30' />
					</NavLink>
				</div>
				<form
					className={styles.search_form}
					onSubmit={(e) => e.preventDefault()}
				>
					<Input placeholder='Search...' />
				</form>
				<ul className={styles.nav_links}>
					{user ? (
						<>
							<li className={styles.nav_item}>
								<NavLink href='#' className={styles.nav_link}>
									<span>{user.name}</span>
									<Img
										src={user.avatar as string}
										alt='avatar'
										width='25'
										height='25'
										className={styles.avatar}
									/>
								</NavLink>
							</li>
							<li className={styles.nav_item}>
								<NavLink
									href='#!'
									onClick={() => signout()}
									className={styles.nav_link}
								>
									Sign Out <FaSignOutAlt size='16' />
								</NavLink>
							</li>
						</>
					) : (
						<li className={styles.nav_item}>
							<NavLink href='/auth' className={styles.nav_link}>
								Sign In <FaSignInAlt size='16' />
							</NavLink>
						</li>
					)}
					<li className={styles.nav_item}>
						<NavLink href='/cart' className={styles.nav_link}>
							Cart <FaShoppingCart size='16' />
						</NavLink>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default React.memo(Nav);
