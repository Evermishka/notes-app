import React from 'react';

interface LinkComponentProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
}

export const LinkComponent = ({ href, children, ...props }: LinkComponentProps) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
);
