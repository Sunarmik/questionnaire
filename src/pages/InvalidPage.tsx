import React from "react";

interface IInvalidPageProps {}

const InvalidPage: React.FC<IInvalidPageProps> = () => {
  return (
    <div className="invalidPage">
      <h1>Page Not Found!</h1>
    </div>
  );
};

export default InvalidPage;
