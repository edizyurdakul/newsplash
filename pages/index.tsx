import { GetStaticProps } from "next";
import { useKeenSlider } from "keen-slider/react";
import useSWR from "swr";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import Image from "next/image";

interface ImageProps {
  id: string;
  urls: { regular: string; small: string };
  alt_description: string;
  width: number;
  height: number;
  user: { links: { html: string }; name: string };
}

export default function Home({ topics }: { topics: { title: string }[] }) {
  const [selectedTopic, setSelectedTopic] = useState("wallpapers");
  const [selectedImage, setSelectImage] = useState<ImageProps>();
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);

  const fetcher = async () => {
    const response = await fetch(
      `https://api.unsplash.com/topics/${selectedTopic}/photos/?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}`
    );
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading } = useSWR(selectedTopic, fetcher);

  const [ref] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 6,
    },
    mode: "free-snap",
  });
  return (
    <>
      {open && (
        <div
          id="popup-modal"
          className={`fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 container mx-auto w-full h-full ${
            open ? "block" : "hidden"
          }`}
        >
          <div className="relative w-full h-full flex justify-center items-center">
            <div className="relative rounded-lg shadow bg-zinc-800 bg-opacity-70">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-zinc-50 bg-transparent transition-all hover:text-zinc-400 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                data-modal-toggle="popup-modal"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-10 pt-12 text-center">
                {selectedImage != undefined && (
                  <>
                    <Image
                      src={selectedImage.urls.regular}
                      alt={selectedImage.alt_description}
                      width={selectedImage.width}
                      height={selectedImage.height}
                      className={`object-cover  ${
                        zoom
                          ? "h-full cursor-zoom-out"
                          : "max-h-[80vh] cursor-zoom-in"
                      } `}
                      onClick={() => {
                        setZoom(!zoom);
                      }}
                    />
                    <div className="flex space-x-4">
                      <p>Author: </p>
                      <p>
                        <a
                          href={selectedImage.user.links.html}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {selectedImage.user.name}
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                      setSelectedTopic(topic.title);
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
          : data.map((image: ImageProps) => {
              return (
                <div
                  key={image.id}
                  className="relative h-64 object-cover rounded-sm cursor-pointer"
                  onClick={() => {
                    setSelectImage(image);
                    setOpen(!open);
                  }}
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
            })}
        {}
      </section>
    </>
  );
}

interface Topics {
  topics: Topic[];
}

type Topic = {
  title: string;
  slug: string;
};

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
