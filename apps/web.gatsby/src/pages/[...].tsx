import { Router } from "@reach/router";
import { HeadFC } from "gatsby";
import React from "react";

import { LandingPage } from "../features/landing-page";
import { NanoMachine } from "../features/nano-machine";

const App = () => {
  return (
    <Router basepath="/">
      <LandingPage path="/" />
      <NanoMachine path="/:nanoMachineId" />
    </Router>
  );
};

export default App;

export const Head: HeadFC = () => <title>Nanodrop</title>;
