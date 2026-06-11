function About() {
  return (
    <section className="min-h-screen bg-gray-400 pt-20 bg-[radial-gradient(circle,#111_0.5px,transparent_1px)] bg-[length:24px_24px]">
      <div className="px-4 sm:px-8 md:px-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-medium pb-8 pt-5 mt-10 font-['JetBrains']">
          About Us
        </h1>

        <div className="text-gray-900 max-w-3xl space-y-6 leading-relaxed">
          <p>
            Welcome to BlogEra — a space where ideas, stories, and creativity
            come together. We created this blog to share insights, experiences,
            and content that people can genuinely enjoy reading. From technology
            and design to lifestyle and inspiration, every article is written
            with the goal of informing, engaging, and sparking curiosity.
          </p>

          <p>
            BlogEra started as a simple passion project driven by a love for
            writing and web development. Over time, it evolved into a platform
            for sharing knowledge, exploring trends, and creating meaningful
            conversations through content. Each post reflects a mix of
            creativity, learning, and the desire to build something valuable for
            readers around the world.
          </p>

          <p>
            We believe that a great blog should feel clean, easy to navigate,
            and enjoyable on every device. That’s why we focus on simplicity,
            readability, and smooth user experience while delivering
            high-quality content. Whether you're here to learn something new,
            discover fresh ideas, or simply enjoy a good read, BlogEra is built
            to make every visit worthwhile.
          </p>
        </div>
      </div>

      <div className="text-center border-t-2 p-2 border-black mt-10">
        <h1>@ 2026 BlogEra</h1>
      </div>
    </section>
  );
}

export default About;