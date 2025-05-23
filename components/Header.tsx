import { useLocation, useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { useState } from "react";

interface Props {
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}

const Header = ({ title, description, ctaText, ctaUrl }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (ctaUrl) {
      setIsLoading(true);
      // Navigate to url after showing loading state
      setTimeout(() => {
        navigate(ctaUrl);
      }, 100);
    }
  };

  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "text-dark-100",
            location.pathname === "/"
              ? "text-2xl md:text-4xl font-bold"
              : "text-xl md:text-2xl font-semibold"
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "text-gray-100 font-normal",
            location.pathname === "/"
              ? "text-base md:text-lg"
              : "text-sm md:text-lg"
          )}
        >
          {description}
        </p>
      </article>
      {ctaText && ctaUrl && (
        <ButtonComponent
          className="button-class !h-11 !w-[240px] md:w-[240px]"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <img
              src="/assets/icons/loader.svg"
              alt="loading"
              className="size-5 animate-spin"
            />
          ) : (
            <img src="/assets/icons/plus.svg" alt="create" className="size-5" />
          )}
          <span className="p-16-semibold text-white">
            {isLoading ? "Loading..." : ctaText}
          </span>
        </ButtonComponent>
      )}
    </header>
  );
};

export default Header;
