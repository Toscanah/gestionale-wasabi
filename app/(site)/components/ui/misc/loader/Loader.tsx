"use client";

import RandomSpinner, { RandomSpinnerProps } from "./RandomSpinner";

type LoaderProps = React.PropsWithChildren<RandomSpinnerProps>;

export default function Loader({ isLoading, children, size, color }: LoaderProps) {
  if (isLoading) {
    return <RandomSpinner isLoading={isLoading} size={size} color={color} />;
  }

  return <>{children}</>;
}
