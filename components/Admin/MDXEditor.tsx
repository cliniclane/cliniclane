import React, { FC } from "react";
import MDEditor from "@uiw/react-md-editor";

interface IProps {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
}

const MdxEditor: FC<IProps> = ({ value, setValue }) => {
  return (
    <div className="container min-h-screen h-full">
      <MDEditor
        className="min-h-screen h-full"
        value={value?.trim() || ""}
        onChange={setValue}
      />
    </div>
  );
};

export default MdxEditor;
