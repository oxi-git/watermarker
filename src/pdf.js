// ── Minimal A4 PDF writer ──────────────────────────────────
// Lays JPEG images out in a single column, like a scanned document,
// and embeds them directly (DCTDecode) without external dependencies.

const PT_PER_MM = 72 / 25.4;

export const A4 = { width: 210, height: 297 };

/**
 * Distribute images over A4 pages, one column, scaled to the content width.
 * @param {{bytes:Uint8Array,width:number,height:number}[]} images JPEG data, in load order
 * @param {{margin?:number,gap?:number}} options millimetres
 * @returns {Array<Array<{x:number,y:number,w:number,h:number,image:object}>>} pages in mm, origin bottom-left
 */
export function layoutPages(images, { margin = 12, gap = 6 } = {}) {
  const contentW = A4.width - margin * 2;
  const contentH = A4.height - margin * 2;
  const pages = [];
  let page = [];
  let top = A4.height - margin;

  images.forEach(image => {
    let w = contentW;
    let h = contentW * (image.height / image.width);

    // Very tall images are limited by the page height instead of the width.
    if (h > contentH) {
      h = contentH;
      w = contentH * (image.width / image.height);
    }

    const needed = (page.length ? gap : 0) + h;
    if (page.length && top - needed < margin) {
      pages.push(page);
      page = [];
      top = A4.height - margin;
    }
    if (page.length) top -= gap;

    const y = top - h;
    page.push({ x: margin + (contentW - w) / 2, y, w, h, image });
    top = y;
  });

  if (page.length) pages.push(page);
  return pages;
}

const num = v => (Math.round(v * 100) / 100).toString();

/**
 * Build the PDF binary.
 * @param {Array<Array<{bytes:Uint8Array,width:number,height:number,x:number,y:number,w:number,h:number}>>} pages
 */
export function buildPdf(pages) {
  const encoder = new TextEncoder();
  const chunks = [];
  let length = 0;
  const offsets = [];

  const push = data => {
    const bytes = typeof data === 'string' ? encoder.encode(data) : data;
    chunks.push(bytes);
    length += bytes.length;
  };
  const startObject = num => {
    offsets[num] = length;
    push(`${num} 0 obj\n`);
  };
  const endObject = () => push('endobj\n');

  const pageInfo = [];
  let nextObject = 3;
  pages.forEach(pageItems => {
    const items = pageItems.map(item => ({
      ...item.image,
      x: item.x, y: item.y, w: item.w, h: item.h,
    }));
    pageInfo.push({
      page: nextObject++,
      content: nextObject++,
      images: items.map(() => nextObject++),
      items,
    });
  });
  const objectCount = nextObject - 1;

  push('%PDF-1.4\n');
  push(new Uint8Array([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]));

  // 1 – Catalog
  startObject(1);
  push('<< /Type /Catalog /Pages 2 0 R >>\n');
  endObject();

  // 2 – Pages
  startObject(2);
  push(`<< /Type /Pages /Kids [${pageInfo.map(p => `${p.page} 0 R`).join(' ')}] /Count ${pageInfo.length} >>\n`);
  endObject();

  pageInfo.forEach(({ page, content, images, items }) => {
    const xobjects = images.map((n, i) => `/Im${i} ${n} 0 R`).join(' ');

    startObject(page);
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(A4.width * PT_PER_MM)} ${num(A4.height * PT_PER_MM)}]` +
      ` /Resources << /XObject << ${xobjects} >> >> /Contents ${content} 0 R >>\n`
    );
    endObject();

    const operators = items.map((item, i) =>
      `q\n${num(item.w * PT_PER_MM)} 0 0 ${num(item.h * PT_PER_MM)} ` +
      `${num(item.x * PT_PER_MM)} ${num(item.y * PT_PER_MM)} cm\n/Im${i} Do\nQ\n`
    ).join('');
    const stream = encoder.encode(operators);

    startObject(content);
    push(`<< /Length ${stream.length} >>\nstream\n`);
    push(stream);
    push('\nendstream\n');
    endObject();

    items.forEach((item, i) => {
      startObject(images[i]);
      push(
        `<< /Type /XObject /Subtype /Image /Width ${item.width} /Height ${item.height}` +
        ` /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${item.bytes.length} >>\nstream\n`
      );
      push(item.bytes);
      push('\nendstream\n');
      endObject();
    });
  });

  const xrefOffset = length;
  push(`xref\n0 ${objectCount + 1}\n`);
  push('0000000000 65535 f \n');
  for (let n = 1; n <= objectCount; n++) {
    push(`${String(offsets[n]).padStart(10, '0')} 00000 n \n`);
  }
  push(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const output = new Uint8Array(length);
  let offset = 0;
  chunks.forEach(chunk => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}
