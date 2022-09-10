// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react'
import { Html, Head, Main, NextScript } from 'next/document'
// import theme from './theme'
import chakraTheme from '@/styles/theme';

export default function Document() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
}
