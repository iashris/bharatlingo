import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div
          className="text-white m-0 text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          BharatLingo
        </div>
        <nav>
          <a href="/annotate" className="text-white hover:text-gray-200 mx-2">
            Create
          </a>
          <a href="/about" className="text-white hover:text-gray-200 mx-2">
            About
          </a>
        </nav>
      </div>
    </header>
  );
};

export const Footer = () => (
  <footer className="bg-gray-800 text-white py-4 mt-8">
    <div className="max-w-6xl mx-auto text-center">
      <p>Made with ❤️ by India in Pixels</p>
    </div>
  </footer>
);
