import { ReactNode } from "react";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export type CarouselItem = {
  imagePath: string;
  text: string;
  description: string;
};
