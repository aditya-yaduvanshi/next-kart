import React from "react";

const ProductForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

  }
  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <section>
            <input type="file" />
          </section>
        </form>
      </div>
    </>
  )
}

export default React.memo(ProductForm);
