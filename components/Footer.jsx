import { GithubIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-gray-100 p-4 md:px-8 md:pt-8 lg:px-12">
      <div className="flex  justify-between">
        <div>
          <h3 className="mb-3">Links</h3>
          <ol className="text-sm space-y-2">
            <li className="cursor-pointer hover:underline underline-offset-1">
              <Link href={"/contact"}>Contact</Link>
            </li>
            <li className="cursor-pointer hover:underline underline-offset-1">
              Feedback
            </li>
          </ol>
        </div>
        <div className="flex items-baseline flex-col justify-end">
          <h3>Connect</h3>

          <ol className="flex gap-4 mt-2">
            <li>
              <Link
                href={"https://www.instagram.com/ravi.thaakurr/"}
                target="_blank"
              >
                <InstagramIcon size={18} />
              </Link>
            </li>
            <li>
              <Link
                href={"https://www.linkedin.com/in/ravi-kr-thakur-aa1820216/"}
                target="_blank"
              >
                <LinkedinIcon size={18} />
              </Link>
            </li>
            <li>
              <Link href={"https://github.com/Thakur127"} target="_blank">
                <GithubIcon size={18} />
              </Link>
            </li>
          </ol>
        </div>
      </div>
      <div className="text-center border-t pt-4 mt-4 border-gray-500">
        &copy; copyright {new Date().getFullYear()}, <span>notes.</span>
      </div>
    </div>
  );
};

export default Footer;
