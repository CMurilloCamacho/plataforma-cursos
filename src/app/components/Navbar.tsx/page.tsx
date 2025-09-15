import React from "react";
import Image from "next/image";
import Button from "../ui/Button";
import Link from "next/link";



const Navbar = () => {
  return (
    <nav className="  grid grid-cols-2 items-center  px-4 py-2  shadow-lg m-4 "> 
      <div className="flex items-center" >
        <Image  src="/images/uit.png" alt="LOGO UIT" width={50} height={40} />
        <span className=" text-sm font-medium px-4">Informatica y Tecnologia</span>
      </div>
        <ul className=" flex justify-end gap-4" >
          <li>
            <Link href="/auth/login">
            
            <Button>Iniciar session</Button>
            </Link>
          </li>
          <li>
            <Link href="/auth/register">
              <Button>Registrarse</Button>
            </Link>
          </li>
        </ul>
    </nav>
  );
};

export default Navbar;


