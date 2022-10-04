import Input from 'components/input';
import Img from 'hoc/img';
import NavLink from 'hoc/nav-link';
import React from 'react';
import {FaBars} from 'react-icons/fa'

const Nav: React.FC = () => {
	return (
		<>
			<nav className='flex justify-between items-center p-5 py-4 bg-zinc-900 text-white'>
        <div className='flex justify-center items-center gap-5'>
          <button className='flex justify-center items-center'><FaBars size="28" /></button>
          <NavLink href="/" className='flex justify-between items-center gap-2'>
            <Img src="/nextkart.png" alt="cart-icon" width="125" height="30" />
          </NavLink>
        </div>
        <form>
          <Input placeholder="Search for product, category, brand and more" />
        </form>
        <ul className='flex gap-2'>
          <li>
            <NavLink href="/auth/signin" className='px-2 py-1'>Sign In</NavLink>
          </li>
          <li>
            <NavLink href="/auth/register" className='px-2 py-1'>Register</NavLink>
          </li>
          <li>
            <NavLink href="/cart" className='px-2 py-1'>Cart</NavLink>
          </li>
        </ul>
      </nav>
		</>
	);
};

export default React.memo(Nav);
