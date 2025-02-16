import Image from "next/image";

const MostPopular = () => {
  return (
    <section className="bg-purple-200 p-8 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold text-black">
            Our most popular articles
          </h2>
          <p className="text-gray-700 mt-2">
            The latest news, tips and advice to help you run your business with
            less fuss
          </p>
        </div>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800">
          Read All Articles
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            src: "https://images.unsplash.com/photo-1716802043669-8aabd339dc00?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "CREATORS",
          },
          {
            src: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "CREATORS",
          },
          {
            src: "https://images.unsplash.com/photo-1454944338482-a69bb95894af?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            title: "CREATORS",
          },
        ].map((article, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden">
            <Image
              src={article.src}
              alt={article.title}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {article.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostPopular;
