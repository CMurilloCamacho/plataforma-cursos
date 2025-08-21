"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };
const handleSubmit =(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    fetch("/api/auth/login", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(userLogin)
    }).then((res)=>res.json())
    .then((data)=>{console.log(data)})

}
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Credenciales de usuario</h1>
        <div>
          <label className="block" htmlFor="email">
            Email
          </label>
          <input
          value={userLogin.email}
            onChange={handleInput}
            className="border"
            type="text"
            name="email"
          />
          <label className="block" htmlFor="password">
            Password
          </label>
          <input
          value={userLogin.password}
            onChange={handleInput}
            className="block border"
            type="password"
            name="password"
          />
          <button className="cursor-pointer border rounded-2xl px-1.5 mt-1.5">
            {" "}
            enviar
          </button>
        </div>
      </form>
    </div>
  );
}
