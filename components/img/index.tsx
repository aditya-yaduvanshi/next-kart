import React from 'react';
import Image, {ImageProps} from 'next/image';

interface ImgProps extends ImageProps {};

const Img: React.FC<ImgProps> = ({className, alt, ...rest}) => {
	return (
		<>
      <span className={"flex justify-center items-center " + className}>
			  <Image alt={alt ?? ''} {...rest} />
      </span>
		</>
	);
};

export default React.memo(Img);
