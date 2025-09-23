import { init, post, text, button, image } from '@farcaster/frame-sdk';
let initialized = false;

export function initFrame() {
  if (initialized) return;
  init({
    initialState: () =>
      post(
        image({ src: 'https://dummyimage.com/1200x630/111827/ffffff&text=CastBounties', aspectRatio: '1.91:1' }),
        text('Баунти дня: открой форму на сайте, введи пароль и заклеймь.'),
        button({ label: 'Open', onClick: ({ state }) => ({ ...state, open: true }) }),
      ),
  });
  initialized = true;
}
