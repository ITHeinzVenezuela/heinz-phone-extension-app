import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <section className="flex justify-center items-center h-screen">
        <div>
          <img width={200} src="https://i.imgur.com/clYcMlm.gif" />
          <h1>Empezando un nuevo proyecto</h1>
        </div>
      </section>
    </main>
  )
}
