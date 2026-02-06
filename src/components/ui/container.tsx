import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  reverse?: boolean;
};

export default function Container(props: ContainerProps) {
  return (
    <div
      className={twMerge(
        "w-full px-8 lg:px-16 my-10 flex flex-col gap-6 lg:flex-row",
        props.className,
        props.reverse === true && "lg:flex-row-reverse"
      )}
    >
      {props.children}
    </div>
  );
}

/** Standardised section wrapper with max-width and padding */
export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "w-full px-6 md:px-12 lg:px-16 py-16 md:py-20",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
