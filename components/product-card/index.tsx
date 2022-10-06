import Img from 'components/img';
import React from 'react';
import styles from './product-card.module.css';

export interface ProductCardProps {
	product: {
		title: string;
		price: number;
		thumbnail: string;
		id: string;
	};
	className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({product: {
	thumbnail,
	title,
	price,
}, className}) => {
	return (
		<>
			<article className={`${styles.card} ${className}`}>
				<Img
					src={
						thumbnail ??
						'/no-image.jpg'
					}
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
			</article>
		</>
	);
};

export default React.memo(ProductCard);
