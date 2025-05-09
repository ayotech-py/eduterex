import { useEffect } from "react";

export const useDisableDevTools = () => {
  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    const handleKeyDown = (event) => {
      if (
        event.key === "F12" ||
        (event.ctrlKey &&
          event.shiftKey &&
          (event.key === "I" || event.key === "J" || event.key === "C")) ||
        (event.ctrlKey && event.key === "U")
      ) {
        event.preventDefault();
      }
    };

    //document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      //document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

export const detectDevTools = () => {
  setInterval(() => {
    const devtools =
      window.outerWidth - window.innerWidth > 200 ||
      window.outerHeight - window.innerHeight > 200;
    if (devtools) {
      console.clear();
      alert("Developer tools detected! Please close DevTools.");
      window.location.reload();
    }
  }, 1000);
};

export const disableConsoleLogs = () => {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
};
