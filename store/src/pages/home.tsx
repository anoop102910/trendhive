const LandingPage = () => {
  const products = [
    {
      id: 1,
      name: "Minimalist Chair",
      price: "$250",
      image:
        "https://images.unsplash.com/photo-1596704082215-d91d9154b52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 2,
      name: "Modern Desk",
      price: "$599",
      image:
        "https://images.unsplash.com/photo-1596548777085-f86a0735b5a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
    {
      id: 3,
      name: "Elegant Lamp",
      price: "$120",
      image:
        "https://images.unsplash.com/photo-1627483296238-d9a6c6a2e2a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    },
  ];

  return (
    <div className="bg-white text-gray-900">
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 p-8">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">Discover Your Style</h1>
          <p className="text-lg md:text-2xl mb-8 font-light">
            Curated collections of modern home and office essentials.
          </p>
          <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300">
            Shop Now
          </button>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-gray-700">{product.price}</p>
                <button className="mt-4 bg-gray-900 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-700 transition duration-300">
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-lg text-gray-600 mb-8">
            Stay up-to-date with our latest collections and exclusive offers.
          </p>
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="py-3 px-6 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 transition duration-300 w-1/2 md:w-1/3"
            />
            <button className="bg-gray-900 text-white font-bold py-3 px-8 rounded-r-full hover:bg-gray-700 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
