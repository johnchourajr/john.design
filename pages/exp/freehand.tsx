import Head from "next/head";
import Image from "next/image";
import FreehandCanvas from "../../components/FreehandCanvas";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <div className="relative flex items-center justify-start w-full h-[100vh]">
        <p>Start drawing with your cursor ✎</p>
      </div>
      <FreehandCanvas />
    </>
  );
}
