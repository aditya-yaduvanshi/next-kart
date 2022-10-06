import NavLink from 'components/nav-link';
import React from 'react';

const Sider = () => {
	return (
    <>
      <aside>
        <ul>
          <li>
            <NavLink href="/admin/products">Products</NavLink>
          </li>
          <li>
            <NavLink href="/admin/orders">Orders</NavLink>
          </li>
          <li>
            <NavLink href="/admin/categories">Categories</NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default React.memo(Sider);
