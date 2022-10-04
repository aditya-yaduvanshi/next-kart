import React, {PropsWithChildren, useEffect} from 'react';

const PrivateRoute: React.FC<PropsWithChildren> = ({children}) => {
  

  useEffect(() => {

  }, []);

	return (
		<>
			{children}
		</>
	);
};

export default React.memo(PrivateRoute);
