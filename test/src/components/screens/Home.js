import React from 'react';
import NavBar from '../NavBar';
import Card from '../Card';
import Footer from '../Footer';
// import Carousel from '../Carousel';

export default function Home() {
  return (
    <div>
      <div>
        <NavBar />
      </div>

      <div><Card /></div>
      <div><Footer /></div>
    </div>
  );
}
