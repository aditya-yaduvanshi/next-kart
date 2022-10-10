import ProductForm from 'components/product-form';
import { protectedRoute } from 'hoc/protected-route';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

const NewProduct: NextPage = () => {
  return (
    <>
      <Head>
				<title>Admin | New Product</title>
				<meta name="description" content='List of available categories.' />
			</Head>
      <ProductForm />
    </>
  )
}

export default protectedRoute({Component: NewProduct})