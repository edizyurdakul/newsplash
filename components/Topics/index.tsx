import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";

export interface Topics {
  topics: Topic[];
}

type Topic = {
  title: string;
  slug: string;
};

function Topics({ topics }: Topics) {
  const [ref] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 6,
    },
    mode: "free-snap",
  });
  return (
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
              <span className="hover:text-zinc-300">{topic.title}</span>
            </div>
          );
        })}
      </>
    </div>
  );
}

export default Topics;
