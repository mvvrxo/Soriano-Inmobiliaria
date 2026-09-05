import NextLink from "next/link";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof NextLink>;

export default function Link({ href, children, ...props }: LinkProps) {
  return <NextLink href={href} {...props}>{children}</NextLink>;
}
