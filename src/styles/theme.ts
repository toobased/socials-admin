import { extendTheme } from '@chakra-ui/react';
import { ButtonTheme } from '@/styles/chakraButtonTheme';

const chakraTheme = extendTheme({
      // colors: colors,
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
    components: {
        Button: ButtonTheme,
    },

})

export default chakraTheme

