import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-indigo-300 shadow-inner">
      <div className="max-w-6xl mx-auto p-4 text-center">
        <div className="text-slate-700 mt-4 sm:mt-0">
          © {new Date().getFullYear()} Food Palette. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
