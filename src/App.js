import React from 'react';
import { useState, useMemo, useRef } from 'react';

function App() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);

  const nameRef = useRef();
  const handleSubmit = () => {
    setProducts([
      ...products,
      {
        name,
        price: parseInt(price),
      },
    ]);
    setName('');
    setPrice('');

    nameRef.current.focus();
  };

  const total = useMemo(() => {
    const result = products.reduce(
      (result, prod) => {
        return result + prod.price;
      },
      [products],
    );
    return result;
  });

  return (
    <div style={{ padding: '10px 32px' }}>
      <input ref={nameRef} value={name} placeholder="Enter name ?" onChange={(e) => setName(e.target.value)} />
      <br />
      <input value={price} placeholder="Enter price ?" onChange={(e) => setPrice(e.target.value)} />
      <br />
      <button onClick={handleSubmit}>Add</button>
      <br />
      Total : {total}
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
