import React from 'react';
import '../styles/globals.css';
import type {AppProps} from 'next/app';
import Layout from 'components/layout';
import AuthProvider from 'contexts/auth';

const App = ({Component, pageProps}: AppProps) => {
	return (
		<>
			<AuthProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</AuthProvider>
		</>
	);
};

export default React.memo(App);
