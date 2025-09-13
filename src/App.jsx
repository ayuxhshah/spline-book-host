import React, { useRef } from "react";
import Spline from "@splinetool/react-spline";

const BOOK_UID = "6c01ca56-1b02-4b91-93f3-9e2e3034d7a7";
const SCENE_URL = "https://prod.spline.design/IdjWBrKZNtngTfmu/scene.splinecode";

export default function App() {
  const splineRef = useRef(null);

  function onLoad(app) {
    splineRef.current = app;

    // try common runtime finders
    let book = null;
    if (typeof app.findObjectById === "function") book = app.findObjectById(BOOK_UID);
    if (!book && app.scene && typeof app.scene.findById === "function") book = app.scene.findById(BOOK_UID);
    if (!book && typeof app.find === "function") {
      try { book = app.find((o) => o && (o.id === BOOK_UID || o.name === "book-main")); } catch (e) {}
    }

    if (!book) {
      console.warn("Book not found by UID:", BOOK_UID, "— open devtools to inspect 'app'.");
      return;
    }

    try {
      book.onPointerDown = () => {
        window.parent.postMessage({ type: "spline:bookToggled", id: BOOK_UID }, "*");
      };
    } catch (err) {
      console.warn("Could not attach onPointerDown:", err);
    }
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Spline scene={SCENE_URL} onLoad={onLoad} />
    </div>
  );
}
