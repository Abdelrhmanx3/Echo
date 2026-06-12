import { ThemeProvider as NextThemeProvider } from "next-themes";
import { AppProps } from "next/app";

function ThemeProvider({ Component, pageProps }: AppProps) {
    return (
        <NextThemeProvider>
            <Component {...pageProps} />
        </NextThemeProvider>
    );
}

export default ThemeProvider;