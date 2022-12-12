import { GetStaticProps } from "next";
import { useKeenSlider } from "keen-slider/react";
import useSWR, { Key, Fetcher } from "swr";
import "keen-slider/keen-slider.min.css";
import TopicsSlider, { Topics } from "../components/Topics";
import { useEffect, useState } from "react";
import Image from "next/image";

const topics = [
  { title: "Wallpapers", slug: "wallpapers" },
  { title: "3D Renders", slug: "3d-renders" },
  { title: "Travel", slug: "travel" },
  { title: "Nature", slug: "nature" },
  { title: "Street Photography", slug: "street-photography" },
  { title: "Experimental", slug: "experimental" },
  { title: "Textures & Patterns", slug: "textures-patterns" },
  { title: "Animals", slug: "animals" },
  { title: "Architecture & Interiors", slug: "architecture-interiors" },
  { title: "Fashion & Beauty", slug: "fashion-beauty" },
];

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState("wallpapers");
  const [selectedImage, setSelectImage] = useState<any[]>([]);

  const fetcher = async () => {
    const response = await fetch(
      `https://api.unsplash.com/topics/${selectedTopic}/photos/?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}`
    );
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading } = useSWR(selectedTopic, fetcher);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [ref] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 6,
    },
    mode: "free-snap",
  });
  return (
    <>
      <div
        ref={ref}
        className="keen-slider p-4 border-t border-b border-zinc-500"
      >
        <>
          {topics.map((topic, idx) => {
            return (
              <div
                key={topic.title}
                className={`keen-slider__slide number-slide${idx} text-center`}
              >
                {selectedTopic === topic.title ? (
                  <span className="hover:text-zinc-300 font-semibold cursor-pointer">
                    {topic.title}
                  </span>
                ) : (
                  <span
                    className="hover:text-zinc-300 cursor-pointer"
                    onClick={() => {
                      setSelectedTopic(topic.slug);
                    }}
                  >
                    {topic.title}
                  </span>
                )}
              </div>
            );
          })}
        </>
      </div>
      <section className="grid grid-cols-4 container mx-auto gap-4 mt-8">
        {isLoading
          ? Array.from(Array(10).keys()).map((idx) => {
              return (
                <div
                  key={idx}
                  role="status"
                  className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
                >
                  <div className="flex justify-center items-center w-full h-64 rounded-sm sm:w-96 bg-gray-700"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              );
            })
          : data.map(
              (image: {
                id: string;
                urls: { small: string };
                alt_description: string;
                width: number;
                height: number;
              }) => {
                return (
                  <div
                    key={image.id}
                    className="relative h-64 object-cover rounded-sm"
                  >
                    <Image
                      src={image.urls.small}
                      alt={image.alt_description}
                      width={image.width}
                      height={image.height}
                      className="object-cover h-full"
                    />
                  </div>
                );
              }
            )}
        {}
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ topics: Topics[] }> = async (
  context
) => {
  const res = await fetch(
    "https://api.unsplash.com/topics/?client_id=" +
      process.env.NEXT_PUBLIC_ACCESS_KEY
  );
  const topics: Topics[] = await res.json();

  return {
    props: {
      topics,
    },
  };
};
