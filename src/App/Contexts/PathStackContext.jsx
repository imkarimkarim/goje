import React, { createContext, useState } from "react";

export const PathStackContext = createContext();

export const PathStackProvider = (props) => {
  const [paths, setPaths] = useState([]);

  const getBackPath = () => {
    if (paths.length === 1) {
      return paths[0];
    } else {
      return paths[paths.length - 2];
    }
  };

  const setCurrentPath = (path) => {
    if (paths.length === 0) {
      setPaths([path]);
    } else {
      if (path != paths[paths.length - 1]) {
        setPaths([...paths, path]);
      }
    }
    if (path === paths[paths.length - 3]) {
      let tmpPaths = [...paths];
      tmpPaths.splice(tmpPaths.length - 2, 1);
      tmpPaths.splice(tmpPaths.length - 2, 1);
      setPaths(tmpPaths);
    }
  };

  return (
    <PathStackContext.Provider
      value={{ setCurrentPath: setCurrentPath, getBackPath: getBackPath }}
    >
      {props.children}
    </PathStackContext.Provider>
  );
};
