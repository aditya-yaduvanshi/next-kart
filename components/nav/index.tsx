import Input from 'components/input';
import Img from 'hoc/img';
import NavLink from 'hoc/nav-link';
import React from 'react';
import styles from './nav.module.css';
import {FaBars, FaShoppingCart, FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';
import {useAuth} from 'contexts/auth';

const Nav: React.FC = () => {
	const {user, signout} = useAuth();
	return (
		<>
			<nav className={styles.nav}>
				<div className={styles.left_container}>
					<button className={styles.flex_center}>
						<FaBars size='28' />
					</button>
					<NavLink href='/' className='flex justify-between items-center gap-2'>
						<Img src='/nextkart.png' alt='cart-icon' width='125' height='30' />
					</NavLink>
				</div>
				<form className='w-full md:w-1/3' onSubmit={(e) => e.preventDefault()}>
					<Input
						placeholder='Search for product, category, brand and more'
						className=''
					/>
				</form>
				<ul className='flex gap-2'>
					{user ? (
						<>
							<li className='flex justify-center items-center'>
								<NavLink
									href='#'
									className='px-2 py-1 hover:bg-zinc-500 rounded'
								>
									<span>{user.name}</span>
									<Img
										src={user.avatar as string}
										alt='avatar'
										width='25'
										height='25'
										className='rounded-full overflow-hidden'
									/>
								</NavLink>
							</li>
							<li className='flex justify-center items-center'>
								<NavLink
									href='#!'
									onClick={() => signout()}
									className='px-2 py-1 hover:bg-zinc-500 rounded'
								>
									Sign Out <FaSignOutAlt size="16" />
								</NavLink>
							</li>
						</>
					) : (
						<li className='flex justify-center items-center'>
							<NavLink
								href='/signin'
								className='px-2 py-1 hover:bg-zinc-500 rounded'
							>
								Sign In <FaSignInAlt size="16" />
							</NavLink>
						</li>
					)}
					<li className='flex justify-center items-center'>
						<NavLink
							href='/cart'
							className='px-2 py-1 hover:bg-zinc-500 rounded'
						>
							Cart <FaShoppingCart size='16' />
						</NavLink>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default React.memo(Nav);
