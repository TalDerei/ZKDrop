import '../styles/globals.css';
import { useEffect } from 'react';

// 'App' component to intialize pages, with 'Component' and 'pageProps' as inputs
// 'Component' prop is the active page
// 'pageProps' is an object with the initial props preloaded for page
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const threeScript = document.createElement("script");
    threeScript.setAttribute("id", "threeScript");
    threeScript.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js")
    document.getElementsByTagName("head")[0].appendChild(threeScript)
    return () => {
      if (threeScript) {
        threeScript.remove();
      }
    }
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
