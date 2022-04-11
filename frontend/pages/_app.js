import '../styles/globals.css';

// 'App' component to intialize pages, with 'Component' and 'pageProps' as inputs
// 'Component' prop is the active page
// 'pageProps' is an object with the initial props preloaded for page
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
