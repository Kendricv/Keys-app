"use client"
import { useLocalStorageSession } from "./hooks/use-local-storage-sesion";

export default function Home() {
  useLocalStorageSession();

  return (
    <h1>Redireccionando...</h1>
  );
}
