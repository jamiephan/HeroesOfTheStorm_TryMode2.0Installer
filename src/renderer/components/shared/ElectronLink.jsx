import React from 'react';

export default function ElectronLink(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading, jsx-a11y/anchor-has-content
  return <a {...props} target="_blank" />;
}
