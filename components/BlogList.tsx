import React from "react";

const posts = [
  {
    id: 1,
    category: "Sport",
    time: "4 Hours read",
    title: "2022 NFL: Top 4 Quarterbacks selected",
    description:
      "The social-media company is in discussions to sell itself to Elon, a dramatic turn of events just 11 days after the...",
    author: "Anastasia",
    image: "https://source.unsplash.com/800x600/?technology",
  },
  {
    id: 2,
    category: "Life Style",
    time: "4 Hours read",
    title: "2022 NFL: Top 4 Quarterbacks selected",
    image: "https://source.unsplash.com/200x150/?laptop",
  },
  {
    id: 3,
    category: "Life Style",
    time: "4 Hours read",
    title: "2022 NFL: Top 4 Quarterbacks selected",
    image: "https://source.unsplash.com/200x150/?books",
  },
  {
    id: 4,
    category: "Life Style",
    time: "4 Hours read",
    title: "2022 NFL: Top 4 Quarterbacks selected",
    image: "https://source.unsplash.com/200x150/?workspace",
  },
  {
    id: 5,
    category: "Life Style",
    time: "4 Hours read",
    title: "2022 NFL: Top 4 Quarterbacks selected",
    image: "https://source.unsplash.com/200x150/?woman",
  },
];

const BlogListing = () => {
  return (
    <div className="">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Featured Post */}
        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-md">
          <img
            src={posts[0].image}
            alt={posts[0].title}
            className="w-full h-72 object-cover rounded-xl"
          />
          <div className="mt-4">
            <span className="text-sm bg-gray-200 px-2 py-1 rounded-lg">
              {posts[0].category}
            </span>
            <span className="text-sm text-gray-500 ml-2">{posts[0].time}</span>
            <h2 className="text-xl font-bold mt-2">{posts[0].title}</h2>
            <p className="text-gray-600 mt-2">{posts[0].description}</p>
            <button className="mt-3 px-4 py-2 bg-black text-white rounded-lg">
              Read Article →
            </button>
          </div>
        </div>

        {/* Other Posts */}
        <div className="flex flex-col gap-4">
          {posts.slice(1).map((post) => (
            <div
              key={post.id}
              className="flex gap-4 items-center bg-white p-3 rounded-lg shadow-md"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <span className="text-sm bg-gray-200 px-2 py-1 rounded-lg">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500 ml-2">{post.time}</span>
                <h3 className="text-md font-bold mt-1">{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListing;
