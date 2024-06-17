import React from 'react';
import { Stack } from 'rsuite';

const Copyright = () => {
  return (
    <Stack className="copyright" justifyContent="center" style={{ height: 40, marginTop: 20 }}>
      <div className="container">
        <p>
          © 2022, Made with ❤️ by{' '}
          <a href="https://github.com/hanu7674" target="_blank" rel="noreferrer">
            Hanu7674
          </a>
        </p>
      </div>
    </Stack>
  );
};

export default Copyright;
