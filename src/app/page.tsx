import Head from "next/head";
import Image from "next/image";
import {BsFillMoonStarsFill} from 'react-icons/bs'
import {AiFillTwitterCircle, AiFillLinkedin, AiFillYoutube, AiFillGithub} from 'react-icons/ai'
import jdev from "../../public/personal_nobg.png";

import { LINKEDIN_URL, GITHUB_URL, RESUME_PDF } from "./constants.js";
import BackgroundWithTriangles from "./BackgroundWithTriangles";

import SpookyText from "./animatedTags";
import WordflowBackground from "./WordflowBackground.tsx";
import Comp from "./BackgroundSim.jsx";

// "bg-white px-10 "
export default function Home() {
  return (
    <>
      <Comp />
      <div>
      <Head>
        <title> Mohammed Al-Jawaheri Portofolio </title>
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main>
        {/* <BackgroundWithTriangles start_x={0} start_y={0} end_x={700} end_y={700} /> */}
        <section className="bg-transparent">
          <nav className="py-5 mb-12 flex justify-between">
            <SpookyText />
            <ul className="flex items-center">
              <li>
                <BsFillMoonStarsFill className="cursor-pointer text-2xl"/>
              </li>
              <li>
                <a className="bg-gradient-to-r  from-teal-500 to-cyan-700 hover:text-gray-700 transition duration-300 hover:scale-130 text-white px-4 py-2 border-none rounded-md ml-6"
                    href={RESUME_PDF}
                    target="_blank"
                    rel="noopener noreferrer">
                      Resume
                </a>
              </li>
            </ul>
          </nav>


          <div className="text-center p-10">
            <h2 className="text-3xl py-2 text-teal-600 font-medium">Mohammed Al-Jawaheri</h2>
            <h3 className="text-2xl py-2">Systems Developer & tinker</h3>
            <p className="text-md py-5 leading-8 text-gray-800">
              Academic, researcher and systems engineer
            </p>
            <p className="text-md  text-gray-400">
              compilers, operating systems, game server backends and funky web stuff
            </p>
          </div>

          <div className="text-5xl flex justify-center gap-16 py-3 text-gray-600 overflow-hidden">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <AiFillLinkedin className="hover:text-teal-300 hover:scale-110 transition duration-300" />
            </a>

            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <AiFillGithub className="hover:text-teal-300 hover:scale-110 transition duration-300" />
            </a>
          </div>

          <div className="relative mx-auto bg-gradient-to-b from-teal-700 rounded-full w-72 h-72 overflow-hidden">
            <Image src={jdev} layout="fill" objectFit="cover" alt="Personal Picture"/>
          </div>

        </section>
      </main>
    </div>
    <div className="font-naskh">محمد الجواهري</div>
    </>
  )
}
