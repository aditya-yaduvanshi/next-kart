import Button from 'components/button';
import Img from 'components/img';
import {ICategory} from 'contexts/categories';
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import styles from './category-card.module.css';

type CategoryCardProps = {
	category: ICategory;
	showEditButton?: boolean; 
	onEdit?: (category: ICategory) => void;
	className?: string;
};

const CategoryCard: React.FC<CategoryCardProps> = ({category, showEditButton, onEdit, className}) => {
	return (
		<>
			<article className={`${styles.card} ${className ?? ''}`}>
				<Img
					src={category.image}
					alt={category.name}
					width='100'
					height='100'
				/>
				<h4 className={styles.title}>{category.name}</h4>
				{showEditButton && <Button variant='primary' className={styles.editButton} size='small' onClick={() => onEdit?.(category)}>
					<span>Edit</span>
					<FaEdit />
				</Button>}
			</article>
		</>
	);
};

export default React.memo(CategoryCard);
