import React from "react";
import { FaRegCalendarAlt, FaRegUser } from "react-icons/fa";
import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Tips to Complete Tasks Faster",
    author: "Hasnat H.",
    date: "Sep 20, 2025",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    excerpt: "Learn how to increase your productivity and earn more by completing micro tasks efficiently...",
  },
  {
    id: 2,
    title: "How to Choose the Right Tasks for You",
    author: "Jane Doe",
    date: "Sep 18, 2025",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    excerpt: "Picking the right tasks can save time and maximize your earnings. Here’s a simple guide...",
  },
  {
    id: 3,
    title: "Earning Strategies for Micro Workers",
    author: "John Smith",
    date: "Sep 15, 2025",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    excerpt: "Discover some effective strategies to boost your income while completing small online jobs...",
  },
];

const Blog = () => {
  return (
    <section id="blog" className="mb-16 max-w-6xl mx-auto px-5">
      <h2 className="text-3xl font-bold text-center mb-12">Latest Blogs</h2>

      <div className="flex flex-col space-y-12">
        {blogPosts.map((post, index) => {
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row items-center gap-16 p-8 pl-10
                rounded-xl bg-gradient-to-br from-purple-50 to-pink-50
              `}
            >
              {/* Blog Image */}
              <div className="flex-shrink-0 w-24 h-24 md:w-36 md:h-36
               rounded-full border-4 border-[#373c36] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Blog Text */}
              <div className="flex-1">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <FaRegUser className="mr-1" /> {post.author} &nbsp; | &nbsp;
                  <FaRegCalendarAlt className="mr-1" /> {post.date}
                </div>
                <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <button className="px-5 py-2 bg-[#29d409] hover:bg-[#f8b02f] text-white font-semibold rounded-lg transition">
                  Read More
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Blog;
