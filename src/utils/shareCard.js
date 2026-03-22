import { PERIODS } from '../data/composers';

export async function downloadComposerCard(composer, wiki) {
  const W = 800, H = 420;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const period = PERIODS[composer.period];
  const accent = period?.color ?? '#C9A84C';

  // Background
  ctx.fillStyle = '#0f0f0f';
  ctx.fillRect(0, 0, W, H);

  // Accent side bar
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 6, H);

  // Subtle gradient overlay
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, accent + '18');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Portrait
  let portraitLoaded = false;
  if (wiki?.thumbnail) {
    try {
      const img = await loadImage(wiki.thumbnail);
      const ph = H - 40, pw = Math.round(ph * (img.width / img.height));
      const px = W - pw - 20;
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.drawImage(img, px, 20, pw, ph);
      ctx.globalAlpha = 1;
      ctx.restore();
      portraitLoaded = true;
    } catch { /* ignore */ }
  }

  // Period name
  ctx.font = '500 13px system-ui, sans-serif';
  ctx.fillStyle = accent;
  ctx.fillText((period?.name ?? '').toUpperCase(), 30, 52);

  // Composer name
  const nameFontSize = composer.name.length > 22 ? 42 : 52;
  ctx.font = `700 ${nameFontSize}px Georgia, serif`;
  ctx.fillStyle = '#ffffff';
  wrapText(ctx, composer.name, 30, 110, W - (portraitLoaded ? 240 : 60), nameFontSize + 8);

  // Dates
  ctx.font = '400 18px system-ui, sans-serif';
  ctx.fillStyle = '#888';
  ctx.fillText(`${composer.born} – ${composer.died ?? 'present'}  ·  ${composer.nationality ?? ''}`, 30, 200);

  // Description
  if (composer.description) {
    ctx.font = '400 15px system-ui, sans-serif';
    ctx.fillStyle = '#aaa';
    wrapText(ctx, composer.description, 30, 240, W - 60, 22, 4);
  }

  // Divider
  ctx.fillStyle = accent + '55';
  ctx.fillRect(30, H - 56, W - 60, 1);

  // Footer
  ctx.font = '400 13px system-ui, sans-serif';
  ctx.fillStyle = '#555';
  ctx.fillText('anovabr.github.io/music_routes', 30, H - 28);

  ctx.font = '500 13px system-ui, sans-serif';
  ctx.fillStyle = accent + 'cc';
  ctx.textAlign = 'right';
  ctx.fillText('Classical Music Lineage', W - 30, H - 28);

  // Download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${composer.name.replace(/\s+/g, '_')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 99) {
  const words = text.split(' ');
  let line = '', lines = 0;
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      line = word; lines++;
      if (lines >= maxLines) { ctx.fillText(line + '…', x, y + lines * lineHeight); return; }
    } else { line = test; }
  }
  if (line) ctx.fillText(line, x, y + lines * lineHeight);
}
