import React, { PropsWithChildren } from 'react';
import Link, {LinkProps} from 'next/link';
import styles from './navlink.module.css';

interface NavLinkProps extends LinkProps, PropsWithChildren {
  className?: React.HTMLAttributes<HTMLAnchorElement>['className'];
}

const NavLink: React.FC<NavLinkProps> = ({className, onClick, children, ...rest}) => {
	return (
		<>
			<Link {...rest}>
        <a className={`${styles.a} ${className}`} onClick={onClick}>{children}</a>
      </Link>
		</>
	);
};

export default React.memo(NavLink);
