import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="w-full">
      {/*
       * Navbar
       */}
      <Navbar />
      {/* Content */}
      <main className="my-10 p-5 flex flex-col md:px-14 xl:px-20">
        <h1 className="text-5xl font-semibold">Everyone has a story to tell</h1>
        <span className="mt-10 text-xl">
          <strong>Cliniclane</strong> is a home for human stories and ideas.
          Here, anyone can share knowledge and wisdom with the world—without
          having to build a mailing list or a following first. The internet is
          noisy and chaotic; Cliniclane is quiet yet full of insight. It is
          simple, beautiful, collaborative, and helps you find the right readers
          for whatever you have to say.
        </span>
        <span className="mt-10 text-xl bg-gray-300 w-fit px-2 italic">
          Ultimately, our goal is to deepen our collective understanding of the
          world through the power of writing.
        </span>
        <span className="mt-10 text-xl">
          We believe that what you read and write matters. Words can divide or
          empower us, inspire or discourage us. In a world where the most
          sensational and surface-level stories often win, we are building a
          system that rewards depth, nuance, and time well spent. A space for
          thoughtful conversation more than drive-by takes, and substance over
          packaging.
        </span>
        <span className="mt-10 text-xl">
          Instead of selling ads or selling your data, we are supported by a
          growing community of over a million Cliniclane members who believe in our
          mission. If you are new here, start reading. Dive deeper into whatever
          matters to you. Find a post that helps you learn something new, or
          reconsider something familiar—and then write your story.
        </span>
      </main>
      {/*
       * Footer
       */}
      <Footer />
    </div>
  );
};

export default About;
