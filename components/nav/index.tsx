import Input from 'components/input';
import Img from 'hoc/img';
import NavLink from 'hoc/nav-link';
import React from 'react';
import styles from './nav.module.css';
import {FaBars} from 'react-icons/fa';

const Nav: React.FC = () => {
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
				<form className='w-full md:w-1/3'>
					<Input
						placeholder='Search for product, category, brand and more'
						className=''
					/>
				</form>
				<ul className='flex gap-2'>
					<li>
						<NavLink href='/auth/signin' className='px-2 py-1'>
							Sign In
						</NavLink>
					</li>
					<li>
						<NavLink href='/auth/register' className='px-2 py-1'>
							Register
						</NavLink>
					</li>
					<li>
						<NavLink href='/cart' className='px-2 py-1'>
							Cart
						</NavLink>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default React.memo(Nav);
