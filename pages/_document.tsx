import React from 'react';
import {Html, Head, Main, NextScript} from 'next/document';

const MyDocument = () => {
	return (
		<Html>
			<Head />
			<body>
				<Main />
				<NextScript />
				<div id='modal-root'></div>
			</body>
		</Html>
	);
};

export default React.memo(MyDocument);
