import React, {PropsWithChildren} from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.css';
import {GrFormClose} from 'react-icons/gr';

interface ModalProps extends PropsWithChildren {
	show: boolean;
	onClose: () => void;
	headerTitle?: string;
}

const Modal: React.FC<ModalProps> = ({
	children,
	show,
	onClose,
	headerTitle,
}) => {
	if (typeof window === 'undefined') return null;

	return ReactDOM.createPortal(
		show && (
			<div className={styles.modal} onClick={onClose}>
				<div className={styles.popup} onClick={(e) => e.stopPropagation()}>
					<section className={styles.header}>
						<h3>{headerTitle}</h3>
						<button onClick={onClose}>
							<GrFormClose size='30' />
						</button>
					</section>
					<section className={styles.content}>{children}</section>
				</div>
			</div>
		),
		document.getElementById('modal-root')!
	);
};

export default React.memo(Modal);
