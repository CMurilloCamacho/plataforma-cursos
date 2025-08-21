"use client";
import React, { useState } from "react";

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   fetch("/api/auth/register", {
    method: "POST",
headers: {"content-type": "application/json"},
body: JSON.stringify(userData),
   })
   .then((res)=>res.json())
   .then((data)=> {console.log(data)})
  };

  return (
    <div className="flex justify-center items-center bg-amber-400 min-h-screen">
      <form
        className="bg-yellow-50 max-w-sm p-4 rounded-2xl shadow-2xl "
        onSubmit={handleSubmit}
      >
        <h1 className="text-center font-bold text-2xl mb-6">
          Formulario de Registro
        </h1>
        <div>
          <label htmlFor="name" className="block  font-light mb-1">
            Ingresa tu nombre
          </label>
          <input
            onChange={handleInput}
            value={userData.name}
            type="text"
            id="name"
            name="name"
            placeholder="Ingresa tu nombre"
            required
            className="w-full px-4 py-2 border rounded mb-4"
          />
          <label htmlFor="email" className="block  font-medium mb-1">
            Email
          </label>
          <input
            onChange={handleInput}
            value={userData.email}
            type="email"
            id="email"
            name="email"
            placeholder="Ingresa tu email"
            required
            className="border w-full rounded px-4 py-2 mb-4"
          />
          <label htmlFor="password" className="block  font-light mb-1">
            Contraseña
          </label>
          <input
            onChange={handleInput}
            value={userData.password}
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            required
            className="w-full border rounded px-4 py-2 mb-4"
          />
          <button
            type="submit"
            className="block   mb-1 w-full py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors mt-4 font-semibold text-lg"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
