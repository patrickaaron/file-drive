import { UploadButton } from "./UploadButton";

interface HeadingProps {
  title: string;
  formActionElement?: JSX.Element;
}

export const Heading = ({ title, formActionElement }: HeadingProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      {formActionElement}
    </div>
  );
};
