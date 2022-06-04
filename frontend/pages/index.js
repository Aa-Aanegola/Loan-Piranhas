import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Landing from './landing'
import Install from './install'
import { useState, useEffect } from 'react';

export default function Home() {

  const [isMetaMask, setIsMetaMask] = useState(false)

  useEffect(() => {
    setIsMetaMask(window.ethereum)
  })

  return (
    <div>
      <Head>
        <title>Something</title>
      </Head>
      {isMetaMask ? <Landing /> : <Install />}
      
    </div>
  )
}
