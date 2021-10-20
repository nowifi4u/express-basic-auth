import pdf from 'pdfkit';

const font = '$src/../res/Qdbettercomicsans-jEEeG.ttf';

import { Base64Encode } from 'base64-stream';
import { IUserImage } from '#src/models/userImage';
import { IUserData } from '#src/models/userData';

export function generate(data: IUserData & IUserImage): Promise<string> {
  const doc = new pdf({});

  const result: Array<string> = [];
  const stream = doc.pipe(new Base64Encode());

  if (data.image) doc.image(Buffer.from(data.image, 'base64'), 10, 10, { width: 100, height: 100, fit: [100, 100] });

  doc
    .font(font)
    .fontSize(25)
    .text(`First name: ${String(data.firstName)}`, 10, 100);

  doc
    .font(font)
    .fontSize(25)
    .text(`Last name: ${String(data.lastName)}`, 10, 200);

  doc.end();

  stream.on('data', chunk => {
    result.push(String(chunk));
  });

  return new Promise(resolve => {
    stream.on('end', () => {
      resolve(result.join());
    });
  });
}
