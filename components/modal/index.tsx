import React, {PropsWithChildren, useCallback, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';

interface ModalProps extends PropsWithChildren {
  show: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({children, show, onClose}) => {
	const [browser, setBrowser] = useState(false);
  const modalRef = useRef() as React.RefObject<HTMLDivElement>;

  const handleBackDropClick = useCallback((e: MouseEvent) => {
    if(!modalRef.current?.contains(e.target as Node)) return;
    onClose();
  }, [onClose, modalRef]);

	useEffect(() => {
		setBrowser(true);
    window.addEventListener('click', handleBackDropClick);

    return window.removeEventListener('click', handleBackDropClick);
	}, [handleBackDropClick]);

	if (!browser) return null;

	return ReactDOM.createPortal(show &&
		<div className='absolute top-0 bottom-0 right-0 left-0 bg-black bg-opacity-75 flex justify-center items-center z-50'>
			<div className='border border-zinc-600' ref={modalRef}>{children}</div>
		</div>,
		document.getElementById('modal-root')!
	);
};

export default React.memo(Modal);
