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
    excerpt: "Learn how to increase your productivity, work efficiently, time management and earn more by completing micro tasks efficiently...",
  },
  {
    id: 2,
    title: "How to Choose the Right Tasks for You",
    author: "Jane Doe",
    date: "Sep 18, 2025",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    excerpt: "Picking the right tasks can save time and maximize your earnings. How and which tasks to choose? Here’s a simple guide...",
  },
  {
    id: 3,
    title: "Earning Strategies for Micro Workers",
    author: "John Smith",
    date: "Sep 15, 2025",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    excerpt: "Discover some effective strategies to boost your income while completing small online jobs.Here are some tips...",
  },
];

const Blog = () => {
  return (
    <section id="blog" className=" max-w-6xl mx-auto px-5">
      <h2 className="text-3xl font-bold text-center mb-2">Latest Blogs</h2>
      <p className="text-center secondary mb-12">Stay updated with the latest tips and insights from our blog.</p>
      <div className="flex flex-col space-y-5">
        {blogPosts.map((post, index) => {
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 pl-10
                rounded-xl bg-gradient-to-br from-green-50 to-white shadow
              `}
            >
              {/* Blog Image */}
              <div className="flex-shrink-0  w-36 h-36
               rounded-full overflow-hidden">
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
                <p className="text-gray-700 mb-4 text-sm">{post.excerpt}</p>
                <button className="px-5 py-2 bg-[#29d409] hover:bg-[#f8b02f] text-white text-sm font-semibold rounded transition">
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
