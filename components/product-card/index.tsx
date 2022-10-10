import Img from 'components/img';
import {IProduct} from 'contexts/products';
import Link from 'next/link';
import React from 'react';
import styles from './product-card.module.css';

export interface ProductCardProps {
	product: IProduct;
	className?: string;
	linkClassName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
	product: {thumbnail, title, price, slug},
	className,
	linkClassName,
}) => {
	return (
		<>
			<article className={`${styles.card} ${className}`}>
				<Link href={`/products/${slug}`}>
					<a className={`${styles.link} ${linkClassName}`}>
						<Img
							src={thumbnail ?? '/no-image.jpg'}
							alt='product'
							width='180'
							height='180'
						/>
						<div className={styles.body}>
							<h3>{title.length > 25 ? title.slice(0, 25) + '...' : title}</h3>
							<p className={styles.price}>
								Price Rs. <strong>{price}</strong>
							</p>
						</div>
					</a>
				</Link>
			</article>
		</>
	);
};

export default React.memo(ProductCard);
