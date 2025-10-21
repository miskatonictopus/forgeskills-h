"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border">
      © {new Date().getFullYear()}{" "}
      <span className="font-bold text-foreground">ForgeSkills</span>{" "}
      — Made with{" "}
      <FontAwesomeIcon
        icon={faHeart}
        className="text-red-500 mx-1"
      />{" "}
      in Barcelona — Todos los derechos reservados.
    </footer>
  );
}