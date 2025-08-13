import Link from 'next/link';

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to the Hardware Playground!</h1>
      <p>Choose a section to get started:</p>
      <div style={{ marginTop: '30px' }}>
        <Link href="/playground" passHref>
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
            Playground
          </button>
        </Link>
        <Link href="/curriculum" passHref>
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
            Curriculum
          </button>
        </Link>
        <Link href="/challenges" passHref>
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
            Challenges
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
