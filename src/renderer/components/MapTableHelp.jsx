import React from 'react';
import { Alert } from 'react-bootstrap';
import ElectronLink from './shared/ElectronLink';

export default function MapTableHelp() {
  return (
    <>
      <Alert>
        <p>
          This section allows you to install the map from{' '}
          <ElectronLink href="https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0">
            Try Mode 2.0
          </ElectronLink>{' '}
          (
          <ElectronLink href="https://github.com/jamiephan/HeroesOfTheStorm_TryMode2.0/releases/latest">
            GitHub Release
          </ElectronLink>
          ) directly without manually download and install it yourself.
        </p>
        <p>
          Select one of the map you would like to download and install (Maps
          with <b>(AI)</b> in the name indicates it will populate with AI
          players).
        </p>
        <ul>
          <li>
            <code>Try Mode</code>: The map can be launched When entering Try
            Mode in Heroes of the Storm.
          </li>
          <li>
            <code>Tutorial: Beginner</code>: The map can be launched via In
            Game: &nbsp;
            <code>Settings -&gt; Tutorial -&gt; Introduction</code>
          </li>
          <li>
            <code>Tutorial: Map Mechanic</code>: The map can be launched via In:
            &nbsp;
            <code>Game Settings -&gt; Tutorial -&gt; Basic</code>
          </li>
          <li>
            <code>Tutorial: Veteran</code>: The map can be launched via In Game:
            &nbsp;
            <code>Settings -&gt; Tutorial -&gt; Advanced</code>
          </li>
        </ul>
        <p>
          You can also click on &quot;Run&quot; to run the map directly without
          overriding the maps above. However there will be some issues such as
          talents not loading.
        </p>
      </Alert>
    </>
  );
}
